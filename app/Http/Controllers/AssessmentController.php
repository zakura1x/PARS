<?php

namespace App\Http\Controllers;

use App\Events\AssessmentStarted;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\Question;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentQuestion;
use App\Models\StudentResult;
use App\Models\StudentTopicProficiency;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use PDO;
use Illuminate\Support\Facades\Log;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexForPH()
    {
        // Fetch all assessments with status 'pending', excluding those with status 'draft'
        $assessments = Assessment::where('status', 'pending')
            ->where('status', '!=', 'draft') // Exclude assessments with status 'draft'
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Paginate the results (10 items per page)

        return inertia('Assessment/AssessmentIndex', ['assessments' => $assessments]);
    }


    public function indexForProf()
    {
        // Fetch all the assessments in descending order
        $assessments = Assessment::orderBy('created_at', 'desc')
        ->paginate(10);

        return inertia('Assessment/AssessmentIndex', ['assessments' => $assessments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create(Request $request)
    // {
    //     // Get all the Subjects for the dropdown
    //     $subjects = Subject::all();

    //     // Get the search query and subject ID
    //     $search = $request->input('search');
    //     $subjectId = $request->input('subject_id');


    //     // Get all the Topics with search functionality
    //     $topics = Topics::when($subjectId, function ($query, $subjectId) {
    //         return $query->where('subject_id', $subjectId);
    //     })
    //     ->when($search, function ($query, $search) {
    //         return $query->where('name', 'like', "%{$search}%");
    //     })
    //     ->latest() // Orders by created_at in descending order
    //     ->get(); // Remove pagination

    //     return inertia('Assessment/AssessmentGenerateForm', [
    //         'subjects' => $subjects,
    //         'topics' => $topics,
    //         'search' => $search,
    //         'subjectId' => $subjectId,
    //     ]);
    // }

    public function create()
    {
        // Fetch all subjects (or any other data needed for the form)
        $subjects = Subject::all();

        return inertia('Assessment/AssessmentGeneratorForm', [
            'subjects' => $subjects, // Send subjects to the form
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:assessment,exam',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'topics' => 'array|nullable',
            'topics.*' => 'exists:topics,id',
            'total_items' => 'integer|min:1|nullable',
            'time_limit' => 'required|integer',
        ]);

        //Initialize variables
        $type = $validated['type'];
        $subjectId = $validated['subject_id'];
        $topics = $validated['topics'] ?: Subject::find($subjectId)->topics->pluck('id')->toArray();
        $totalItems = $validated['total_items'];

        // Check if TopicGradingCriteria is available for the selected topics
        if ($type === 'assessment') {
            foreach ($topics as $topicId) {
                $criteria = TopicGradingCriteria::where('topic_id', $topicId)->exists();
                if (!$criteria) {
                    return response()->json(['message' => 'Assessment cannot be created because TopicGradingCriteria is not yet set by the faculty for topic ID: ' . $topicId], 422);
                }
            }
        }
        // Check if TableOfSpecification is available for the selected subject
        if ($type === 'exam') {
            $tableOfSpecifications = TableOfSpecification::where('subject_id', $subjectId)->exists();
            if (!$tableOfSpecifications) {
                return response()->json(['message' => 'Assessment cannot be created because TableOfSpecification is not yet set by the faculty for subject ID: ' . $subjectId], 422);
            }
        }

        // Check if there are available questions for the selected topics
        foreach ($topics as $topicId) {
            $questionsAvailable = Question::where('topic_id', $topicId)->exists();
            if (!$questionsAvailable) {
                return response()->json(['message' => 'Assessment cannot be created because questions are not yet available for topic ID: ' . $topicId], 422);
            }
        }

        $questions = [];
        if($type === 'assessment'){
            $questions = $this->generateCriteriaQuestions( $topics, $totalItems);
        }else if($type === 'exam'){
            $questions = $this->generateExamQuestions( $subjectId);
        }

        if (empty($questions) || $questions->isEmpty()) {
            return response()->json(['message' => 'No questions available for this assessment.'], 422);
        }

        //Create the assessment
        $assessment = Assessment::create([
            'created_by' => Auth::id(),
            'type' => $type,
            'subject_id' => $subjectId,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'time_limit' => $validated['time_limit']
        ]);

        //Attach the questions to the assessment
        foreach ($questions as $question) {
            StudentAssessmentQuestion::create([
                'assessment_id' => $assessment->id,
                'question_id' => $question->id,
            ]);
        }

        return inertia('PracticeAssessment/PracticeStart', ['practiceAssessmentId' => $assessment]);
    }

    private function generateCriteriaQuestions($topicIds, $totalItems)
    {
        $questions = collect(); // Use collection instead of array

        foreach ($topicIds as $topicId) {
            // Step 1: Get the grading criteria for the topic
            $criteria = TopicGradingCriteria::getCriteriaByTopic($topicId);

            foreach ($criteria as $criterion) {
                // Step 2: Calculate the number of questions based on the percentage
                $questionsForCriterion = (int) floor(($criterion->percentage / 100) * $totalItems);

                // Ensure the minimum number of questions is met
                $questionsForCriterion = max($questionsForCriterion, $criterion->min_questions);

                // Map difficulty to Bloom's levels
                $bloomLevels = TopicGradingCriteria::getBloomLevelsForDifficulty($criterion->difficulty);

                // Step 4: Check unused questions and retrieve questions per Bloom level
                $criterionQuestions = collect();
                foreach ($bloomLevels as $level) {
                    $levelQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'assessment')
                        ->where('difficulty', $level)
                        ->where('is_used', false) // Check is_used directly
                        ->inRandomOrder()
                        ->take($questionsForCriterion)
                        ->get();

                    $criterionQuestions = $criterionQuestions->merge($levelQuestions);
                }

                // Step 5: If not enough questions, fallback to other difficulty levels
                if ($criterionQuestions->count() < $questionsForCriterion) {
                    $remaining = $questionsForCriterion - $criterionQuestions->count();

                    $additionalQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'assessment')
                        ->where('is_used', false) // Check is_used directly
                        ->whereNotIn('difficulty', $bloomLevels) // Exclude selected Bloom levels
                        ->inRandomOrder()
                        ->take($remaining)
                        ->get();

                    $criterionQuestions = $criterionQuestions->merge($additionalQuestions);
                }

                // Step 6: If still not enough questions, get random questions regardless of difficulty
                if ($criterionQuestions->count() < $questionsForCriterion) {
                    $remaining = $questionsForCriterion - $criterionQuestions->count();
                    $randomQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'assessment')
                        ->where('is_used', false) // Check is_used directly
                        ->inRandomOrder()
                        ->take($remaining)
                        ->get();

                    $criterionQuestions = $criterionQuestions->merge($randomQuestions);
                }

                // Step 7: Mark fetched questions as used
                foreach ($criterionQuestions as $question) {
                    $question->update(['is_used' => true, 'updated_at' => now()]);
                }

                $questions = $questions->merge($criterionQuestions);
            }
        }

        return $questions;
    }

    public function storeExam(Request $request){
        $validatedData = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer|min:1'
        ]);

        //Generate the exam
        try{
            $questions = $this->generateExamQuestions($validatedData['subject_id']);

            if($questions->isEmpty()){
                return back()->withErrors(['message' => 'No questions available to generate from this Subject']);
            }

            //Create the assessment Record
            $assessment = Assessment::create([
                'created_by' => Auth::id(),
                'type' => 'examination',
                'subject_id' => $validatedData['subject_id'],
                'title' => $validatedData['title'],
                'description' => $validatedData['description'] ?? null,
                'status' => 'draft',
                'time_limit' => $validatedData['time_limit'] ?? null
            ]);

            //Attach the questions to the assessment
            $assessment->questions()->attach($questions->pluck('id')->toArray());


            return to_route('assessment-edit.form', $assessment->id);

        }catch(\Exception $e){
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    private function generateExamQuestions($subjectId)
    {
        $questions = collect();
        $selectedQuestionIds = [];

        //Fetch the TOS for the subject
        $tableOfSpecification = TableOfSpecification::where('subject_id', $subjectId)->get();

        if ($tableOfSpecification->isEmpty()) {
            throw new \Exception("No Table of Specification found for the selected subject.");
        }

        //\Log::info("Processing TOS for subject ID: {$subjectId}");
        //\Log::info("TOS found: " . $tableOfSpecification->count());

        //Generate the questions based on the TOS
        foreach($tableOfSpecification as $tos){
            //\Log::info("Processing topic ID: {$tos->topic_id}");
            //\Log::info("Difficulty distribution: " . json_encode($tos->difficulty));

            $topicId = $tos->topic_id;
            //$difficultyDistribution = json_decode($tos->difficulty, true);
            $difficultyDistribution = $tos->difficulty;
            $totalQuestionsForTopic = $tos->num_questions;

            //Fetch the questions for each difficulty level
            foreach($difficultyDistribution as $difficultyLevel => $count){
                if($count <= 0){
                    continue; //SKip if no questions required for the difficulty
                }

                $questionsForDifficulty = Question::where('topic_id', $topicId)
                ->where('purpose_type', 'examination')
                ->where('difficulty', $difficultyLevel)
                ->where('is_used', false)
                ->whereNotIn('id', $selectedQuestionIds)
                ->inRandomOrder()
                ->take($count)
                ->get();

                //If insufficient questions for the difficulty level
                if ($questionsForDifficulty->count() < $count) {
                    $remainingQuestionsNeeded = $count - $questionsForDifficulty->count();

                    // Reset used questions for this difficulty level
                    Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'examination')
                        ->where('difficulty', $difficultyLevel)
                        ->update(['is_used' => false]);

                    // Re-fetch additional questions after reset
                    $additionalQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'examination')
                        ->where('difficulty', $difficultyLevel)
                        ->whereNotIn('id', $selectedQuestionIds)
                        ->inRandomOrder()
                        ->take($remainingQuestionsNeeded)
                        ->get();

                    if ($additionalQuestions->isEmpty()) {
                        throw new \Exception("Insufficient questions available for topic ID: {$topicId} and difficulty: {$difficultyLevel}.");
                    }

                    $questionsForDifficulty = $questionsForDifficulty->merge($additionalQuestions);
                }


                //Mark fetched questions as used and track ids
                foreach ($questionsForDifficulty as $question){
                    $question->update(['is_used' => true, 'updated_at'=> now()]);
                    $selectedQuestionIds[] = $question->id;
                }

                //add the question now to the main collection
                $questions = $questions->merge($questionsForDifficulty);
            }
        }

        return $questions;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($assessmentId)
    {
        $assessment = Assessment::with('questions.topic')->findOrFail($assessmentId);

        if($assessment->status !== 'draft'){
            return back()->withErrors(['message' => 'Assessment cannot be edited anymore']);
        }

        // Get all the questions related to the assessment
        //$questions = $assessment->questions;

        //dd($assessment->questions);

        return inertia('Assessment/AssessmentEditForm', [
            'assessment' => $assessment,
            'questions' => $assessment->questions
        ]);
    }


    public function replaceQuestion($questionId, $assessmentId)
    {
        DB::beginTransaction();

        try {
            // Find the old question
            $oldQuestion = Question::findOrFail($questionId);

            // Check if the question is part of the assessment
            if (!$oldQuestion->assessments()->where('assessment_id', $assessmentId)->exists()) {
                return back()->withErrors(['message' => 'Question is not part of this assessment']);
            }

            // Mark the old question as unused
            $oldQuestion->update(['is_used' => false]);

            // Find a replacement question
            $replacement = Question::where('topic_id', $oldQuestion->topic_id)
                ->where('difficulty', $oldQuestion->difficulty)
                ->where('purpose_type', 'examination')
                ->where('is_used', false)
                ->inRandomOrder()
                ->first();

            // If no replacement is found, revert the old question's status and return an error
            if (!$replacement) {
                $oldQuestion->update(['is_used' => true]);
                return back()->withErrors(['message' => 'No replacement found']);
            }

            // Mark the replacement question as used
            $replacement->update(['is_used' => true]);

            // Update the pivot table
            $oldQuestion->assessments()->updateExistingPivot($assessmentId, [
                'question_id' => $replacement->id,
                'updated_at' => now(),
            ]);

            // Commit the transaction
            DB::commit();

            // Return success message
            return back()->with([
                'message' => 'Question replaced successfully.',
                'replacement' => $replacement,
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            Log::error('Error replacing question: ' . $e->getMessage());
            return back()->withErrors(['message' => 'An error occurred while replacing the question.']);
        }
    }
    public function updateForApproval($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Check if the assessment has already been approved
        if ($assessment->approved) {
            return back()->withErrors(['message' => 'This assessment has already been approved.']);
        }

        // Update the status to 'pending' and set the updated_at timestamp
        $assessment->update([
            'status' => 'pending',
            'updated_at' => now(),
        ]);

        return back()->with([
            'message' => 'Assessment status updated to pending.',
        ]);
    }


    public function assessmentApprovalForm($assessmentId)
    {
        $assessment = Assessment::with('questions')->findOrFail($assessmentId);

        // Check if the assessment is already approved
        if ($assessment->approved) {
            return back()->withErrors(['message' => 'This assessment has already been approved.']);
        }else if($assessment->status === 'draft'){
            return back()->withErrors(['message'=> 'Submit the assessment for approval first']);
        }

        $assessment->questions->map(function ($question) {
            // Decode correct_answer if it's JSON string
            $correctAnswers = is_string($question->correct_answer)
            ? json_decode($question->correct_answer, true)
            : $question->correct_answer;

            // Ensure correct_answer is an array
            $correctAnswers = is_array($correctAnswers) ? $correctAnswers : [];

            $question->correct_answer_text = collect($question->options)->filter(function ($option) use ($correctAnswers) {
                return in_array($option, $correctAnswers);
            });

            return $question;
        });

        // Show the approval form if the assessment is not approved yet
        return inertia('Assessment/AssessmentApprovalForm', [
            'assessment' => $assessment,
        ]);
    }


    public function approveAssessment(Request $request, $assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        //Only program head can approve or disapprove
        if(Auth::user()->role !== 'program_head'){
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        //Check if the assessment is already approved
        if($assessment->approved){
            return back()->withErrors(['message' => 'Assessment is not yet ready for approval']);
        }elseif($assessment->status !== 'pending'){
            return back()->withErrors(['message' => 'Assessment is not yet ready for approval']);
        }

        //Approve the assessment
        $assessment->update([
            'approved' => true,
            'approved_by' => Auth::user()->id,
            'status' => 'active'
        ]);

        return to_route('assessment-PH.index')->with(['message' => 'Assessment approved successfully']);
    }

    public function rejectAssessment(Request $request, $assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:255'
        ]);

        if(Auth::user()->role !== 'program_head'){
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        //Check if the assessment is already approved
        if($assessment->approved){
            return response()->json(['message' => 'This assessment has already been approved.']);
        }

        $assessment->update([
            'status' => 'rejected',
            'approved' => false,
            'approved_by' => Auth::user()->id,
            'rejection_reason' => $validated['rejection_reason']
        ]);

        return to_route('assessment-PH.index')->with(['message' => 'Assessment was successfully rejected']);
    }

    public function destroy($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Update all related questions' is_used to false
        foreach ($assessment->questions as $question) {
            $question->update(['is_used' => false]);
        }

        // Delete the assessment
        $assessment->delete();

        return inertia('Assessment/AssessmentIndex',['message' => 'Assessment deleted successfully.']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'time_limit' => 'required|integer'
        ]);

        $assessment->update([
            'title' => $validated['title'],
            'description' => $validated['description']
        ]);
    }

    /**
     * Student View
     */

     
    public function studentIndex()
    {
        //Get the Id of the authenticated
        $studentId = Auth::id();

        //Retrieve the assessment the students joined
        $assessments = Assessment::whereHas('studentAssessments', function ($query) use ($studentId){
            $query->where('user_id', $studentId);
        })->get();

        return inertia('Assessment/Student/StudentAssessmentIndex',[
            'assessments' => $assessments
        ]);
    }

    public function inputCode(){
        return inertia('Assessment/Student/StudentInputCode');
    }

    public function joinAssessment(Request $request)
    {
        $code = $request->input('code');
        $assessment = Assessment::where('access_code', $code)->first();

        if (!$assessment) {
            return back()->withErrors(['code' => 'Invalid access code.']);
        }

        // Ensure the assessment is active or ongoing
        if (!in_array($assessment->status, ['waiting', 'on_going'])) {
            return back()->withErrors(['code' => 'Assessment is not available for joining.']);
        }

        // Check if the assessment is already due
        if ($assessment->time_limit && $assessment->started_at) {
            $dueTime = $assessment->started_at->addMinutes($assessment->time_limit);
            if (now()->greaterThan($dueTime)) {
                return back()->withErrors(['code' => 'The assessment has already ended.']);
            }
        }

        $student = Auth::user();

        // Check if the student has already joined
        $alreadyJoined = $assessment->studentAssessments()->where('user_id', $student->id)->exists();

        if (!$alreadyJoined) {$assessment->load('questions');
            // Load questions with the `question` relationship
            $assessment->load('questions');

            // Shuffle questions
            $shuffledQuestions = $assessment->questions->shuffle();

            // Shuffle options for each question
            $shuffledOptions = [];
            foreach ($shuffledQuestions as $question) {
                $options = $question->options;

                // Decode options if they are stored as JSON
                if (!is_array($options)) {
                    $options = json_decode($options, true);
                }

                // Shuffle the options
                $shuffledOptions[$question->id] = collect($options)->shuffle()->toArray();
            }

            // Set the status to 'started' for ongoing assessments
            $status = $assessment->status === 'on_going' ? 'started' : 'waiting';


            // Create a new StudentAssessment record
            $studentAssessment = $assessment->studentAssessments()->create([
                'user_id' => $student->id,
                'status' => $status,
                'shuffled_questions' => json_encode($shuffledQuestions->pluck('id')->toArray()), // Encode as JSON
                'shuffled_options' => json_encode($shuffledOptions), // Encode as JSON
            ]);

            foreach($shuffledQuestions as $question){
                StudentAssessmentQuestion::create([
                    'student_assessment_id' => $studentAssessment->id,
                    'assessment_id' => $assessment->id,
                    'question_id' => $question->id,
                ]);
            }
        }

        // Redirect based on assessment status
        if ($assessment->status === 'on_going') {
            return to_route('assessment.take-assessment', $assessment->id); // Redirect to the assessment taking page
        }

        // Store the assessment ID in the session or query parameters
        return redirect()->route('assessment.waitingList', ['assessment_id' => $assessment->id]);
    }

    public function waitingList(Request $request)
    {
        // Fetch the assessment ID from the query parameters or session
        $assessmentId = $request->query('assessment_id') ?? session('assessment_id');

        // Ensure the assessment ID is provided
        if (!$assessmentId) {
            return redirect()->route('assessment.inputCode')->withErrors([
                'message' => 'No assessment ID provided.',
            ]);
        }

        // Fetch the assessment
        $assessment = Assessment::find($assessmentId);

        // Ensure the assessment exists
        if (!$assessment) {
            return redirect()->route('assessment.inputCode')->withErrors([
                'message' => 'Assessment not found.',
            ]);
        }

        // Ensure the assessment is in a state where students can wait (e.g., pending or active)
        if (!in_array($assessment->status, ['waiting', 'active'])) {
            return redirect()->route('assessment.inputCode')->withErrors([
                'message' => 'This assessment is not available for joining.',
            ]);
        }

        // Pass the assessment data to the WaitingList view
        return inertia('Assessment/Student/WaitingList', [
            'assessment' => $assessment,
        ]);
    }

    public function takeAssessment($assessmentId)
    {
        // Retrieve the assessment
        $assessment = Assessment::findOrFail($assessmentId);

        // Ensure the assessment is ongoing
        if ($assessment->status !== 'on_going') {
            return back()->with(['message' => 'The assessment is not yet available or has been completed']);
        }

        // Get the student's shuffled questions and options from the student_assessments table
        $student = Auth::user();
        $studentAssessment = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('user_id', $student->id)
            ->first();

        if (!$studentAssessment) {
            return back()->with(['message' => 'Shuffled data not found. Please restart the assessment.']);
        }

        // Decode the shuffled questions and options
        $shuffledQuestionIds = json_decode($studentAssessment->shuffled_questions, true);
        $shuffledOptions = json_decode($studentAssessment->shuffled_options, true);

        // Load the assessment questions
        $assessment->load('questions');

        // Sort questions based on the shuffled order
        $shuffledQuestions = $assessment->questions->sortBy(function ($question) use ($shuffledQuestionIds) {
            return array_search($question->id, $shuffledQuestionIds);
        });

        // Apply shuffled options to each question
        foreach ($shuffledQuestions as $question) {
            if (isset($shuffledOptions[$question->id])) {
                $question->options = $shuffledOptions[$question->id];
            }
        }

        // Set the sorted and shuffled questions back to the assessment
        $assessment->setRelation('questions', $shuffledQuestions);

        return inertia('Assessment/Student/TakeAssessment', [
            'assessment' => $assessment,
        ]);
    }

    public function saveAnswer(Request $request, $assessmentId, $questionId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        $validated = $request->validate([
            'selected_option' => 'required|array'
        ]);
        //dd($validated);

        $studentAssessment = StudentAssessment::where('assessment_id', $assessmentId)
        ->where('user_id', Auth::id())
        ->firstOrFail();

        //dd($studentAssessment);

        //FInd the assessmentQuestion
        $assessmentQuestion = StudentAssessmentQuestion::where('student_assessment_id', $studentAssessment->id)
        ->where('question_id', $questionId)
        ->firstOrFail();

        //dd($assessmentQuestion);
        // Check if the assessment is already due
        if ($assessment->time_limit && $assessment->started_at) {
            $dueTime = $assessment->started_at->addMinutes($assessment->time_limit);
            if (now()->greaterThan($dueTime)) {
                return back()->withErrors(['message' => 'The assessment has already ended.']);
            }
        }

        //Check if the selected answer is correct
        $question = $assessmentQuestion->question;
        //dd($question);
        $correctAnswer = $question->correct_answer;

        $isCorrect = !array_diff($validated['selected_option'], $correctAnswer);

        $assessmentQuestion->update([
            'student_answer' => $validated['selected_option'],
            'is_correct' => $isCorrect
        ]);

        return back();
    }

    public function submitAssessment($assessmentId, $studentId)
    {
        //dd('reached');
        $assessment = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('user_id', $studentId) // Ensure it's scoped to the current student
            ->with('questions.question')
            ->firstOrFail();

        //dd($assessment->assessment_id);

        $assessmentMain = Assessment::findOrFail($assessmentId);

        DB::transaction(function () use ($assessment, $assessmentMain) {

            $assessment->refresh();

            // Prevent multiple submissions
            if ($assessment->status !== 'started') {
                throw new \Exception('Assessment has already been submitted.');
            }

            // Check if the assessment is already due
            if ($assessmentMain->time_limit && $assessmentMain->started_at) {
                $dueTime = $assessmentMain->started_at->addMinutes($assessmentMain->time_limit);
                $timedOut = now()->greaterThan($dueTime);
            }

            $assessment->update([
                'status' => $timedOut ? 'timed_out' : 'completed',
                'submitted_at' => now()
            ]);

            // Grade the assessment
            $this->gradeAssessment($assessment->assessment_id, $assessment->user_id );
        });

        return to_route('assessment.student-result', [
            'assessmentId' => $assessment->assessment_id,
            'studentId' => $assessment->user_id,
        ]);
    }


    public function gradeAssessment($assessmentId, $studentId)
    {
        //dd($assessmentId, $studentId);
        $assessment = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('user_id', $studentId) // Ensure it's scoped to the current student
            ->firstOrFail();
        //dd($assessment);


        $questions = $assessment->questions()->with('question')->get();

        // Initialize grading variables
        $correctAnswers = 0;
        $incorrectAnswers = 0;
        $totalWeightedScore = 0; // Total possible score (weighted)
        $earnedWeightedScore = 0; // Total score earned (weighted)

        // Group questions by topic for topic-specific calculations
        $questionsByTopic = $questions->groupBy(fn($q) => $q->question->topic_id);

        foreach ($questions as $question) {
            $isCorrect = $question->is_correct; // Check if the question was answered correctly
            $questionWeight = $question->question->weight ?? 1; // Default weight is 1 if not set

            if ($isCorrect) {
                $correctAnswers++;
                $earnedWeightedScore += $questionWeight;
            } else {
                $incorrectAnswers++;
            }

            $totalWeightedScore += $questionWeight; // Add to the total weighted score
        }

        // Calculate the final score percentage for the assessment
        $scorePercentage = ($totalWeightedScore > 0) ? ($earnedWeightedScore / $totalWeightedScore) * 100 : 0;

        DB::transaction(function () use ($assessmentId, $studentId, $assessment, $correctAnswers, $incorrectAnswers, $scorePercentage, $questionsByTopic) {
            // Re-fetch assessment inside transaction to prevent race conditions
            $assessment->refresh();
            //dd($assessment->assessment_id);

            $assessment->result()->create([
                'total_questions' => $correctAnswers + $incorrectAnswers,
                'correct_answers' => $correctAnswers,
                'wrong_answers' => $incorrectAnswers,
                'score' => $scorePercentage,
            ]);


            foreach ($questionsByTopic as $topicId => $topicQuestions) {
                $numerator = [];
                $denominator = [];

                foreach ($topicQuestions as $question) {
                    $isCorrect = $question->is_correct;
                    $questionWeight = $question->question->weight ?? 1;
                    $difficultyWeight = $this->getDifficultyWeight($question->question);

                    $score = $isCorrect ? 1 : 0;
                    $attemptWeight = 1;

                    $numerator[] = $attemptWeight * $score * $difficultyWeight * $questionWeight;
                    $denominator[] = $difficultyWeight * $questionWeight;
                }

                $this->updateTopicProficiency($assessment->user_id, $topicId, $numerator, $denominator);
            }
        });

        return $assessment;
    }

    /**
     * Get Difficulty Weight for a Question
     */
    private function getDifficultyWeight($question)
    {
        return match ($question->bloom_taxonomy_level) {
            'remembering', 'understanding' => 1, // Easy
            'applying' => 2,        // Moderate
            'analyzing', 'evaluating', 'create' => 3,       // Advanced
            default => 1,                        // Default to easy
        };
    }

    /**
     * Update Topic Proficiency
     */
    private function updateTopicProficiency($studentId, $topicId, $numerator, $denominator)
    {
        $totalNumerator = array_sum($numerator);
        $totalDenominator = array_sum($denominator);

        $proficiencyScore = $totalDenominator > 0 ? ($totalNumerator / $totalDenominator) * 100 : 0;

        // Fetch or create the current proficiency record
        $proficiency = StudentTopicProficiency::firstOrNew(
            [
                'student_id' => $studentId,
                'topic_id' => $topicId,
            ],
            [
                'proficiency_level' => 'beginner', // Fallback level
                'grade' => 0.00, // Fallback grade
                'average_score' => 0.00, // Fallback average score
                'attempts' => 0, // Fallback attempts
            ]
        );

        // Update the current proficiency record
        $newTotalScore = ($proficiency->average_score * $proficiency->attempts) + $proficiencyScore;
        $proficiency->attempts += 1; // Increment attempts
        $proficiency->average_score = $proficiency->attempts > 0 ? $newTotalScore / $proficiency->attempts : $proficiencyScore;
        $proficiency->grade = $proficiencyScore; // Current assessment grade
        $proficiency->proficiency_level = match (true) {
            $proficiency->average_score < 60 => 'beginner',
            $proficiency->average_score >= 60 && $proficiency->average_score <= 80 => 'intermediate',
            default => 'advanced',
        };
        // Determine mastery based on proficiency trends
        $proficiency->is_mastered = $proficiency->average_score >= 80 && $proficiency->attempts >= 3;

        $proficiency->save();
    }

    public function studentAssessmentResult($studentId)
    {
        // Fetch the student
        $student = User::findOrFail($studentId);

        // Fetch all assessments the student has answered
        $studentAssessments = StudentAssessment::where('user_id', $studentId)
            ->with(['assessment', 'result'])
            ->get();

        // Transform the data for the frontend
        $assessmentResults = $studentAssessments->map(function ($studentAssessment) {
            $assessment = $studentAssessment->assessment;
            $result = $studentAssessment->result;

            $timeAnswered = $studentAssessment->started_at && $studentAssessment->completed_at
                ? round((strtotime($assessment->ended_at) - strtotime($assessment->started_at)) / 60)
                : null;

            return [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'status' => $studentAssessment->status,
                'time_answered' => $timeAnswered,
                'score' => $result->score ?? null,
                'correct_answers' => $result->correct_answer ?? null,
                'total_questions' => $result->total_questions ?? null,
            ];
        });

        return inertia('Assessment/Student/AssessmentResults', [
            'student' => $student,
            'assessments' => $assessmentResults,
        ]);
    }

    /**
     * Professor View
     */

    public function updateToWait($assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        $assessment->update([
            'status' => 'waiting',
            'updated_at' => now()
        ]);

        return to_route('assessment.initialize', $assessmentId);
    }

    public function initializeAssessment($assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        $assessment->update([
            'status' => 'waiting',
            'updated_at' => now()
        ]);

        //$waitingStudents = $assessment->students()->wherePivot('status', 'waiting')->get();
        $waitingStudents = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('status', 'waiting')
            ->get();

        return inertia('Assessment/AssessmentWaitingProf', [
            'assessment' => $assessment,
            'initialWaitingStudents' => $waitingStudents,
            'assessmentCode' => $assessment->access_code,
        ]);

    }

    public function startAssessmentNow($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Ensure the assessment is approved and pending
        if ($assessment->status !== 'waiting' || !$assessment->approved) {
            return back()->withErrors(['error' => 'Assessment must be approved and pending to start.']);
        }

        // Update assessment status to on_going and set the start time
        $assessment->update([
            'status' => 'on_going',
            'started_at' => now(),
        ]);

        // Update all waiting students to 'started' status
        StudentAssessment::where('assessment_id', $assessmentId)
            ->where('status', 'waiting')
            ->update([
                'status' => 'started'
            ]);

        // Broadcast the AssessmentStarted event
        broadcast(new AssessmentStarted($assessment));

        // Redirect to the professor's dashboard or status view
        return to_route('assessment.status', $assessmentId)
            ->with('message', 'Assessment has started.');
    }

    public function assessmentStatus($assessmentId){
        //Fetch the assessment
        $assessment = Assessment::findOrFail($assessmentId);

        //Fetch the students with their status for the assessment
        //$students = $assessment->students()->wherePivot('status')->get();
        $studentAssessments = StudentAssessment::where('assessment_id', $assessmentId)
        ->with('student')
        ->get();

        $studentStatus = $studentAssessments->map(function ($studentAssessment){
            return [
                'id' => $studentAssessment->student->idNumber,
                'name' => $studentAssessment->student->full_name,
                'status' => $studentAssessment->status,
            ];
        });

        return inertia('Assessment/AssessmentStatus',[
            'assessment' => $assessment,
            'students' => $studentStatus
        ]);
    }

    public function getAssessmentStatus($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Fetch students with their status for this assessment
        $studentAssessments = StudentAssessment::where('assessment_id', $assessmentId)
        ->with('student')
        ->get();

        $studentStatus = $studentAssessments->map(function ($studentAssessment){
            return [
                'id' => $studentAssessment->student->idNumber,
                'name' => $studentAssessment->student->full_name,
                'status' => $studentAssessment->status,
            ];
        });

        return response()->json($studentStatus);
    }


    public function endAssessment($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Update assessment status to completed and set the end time
        $assessment->update([
            'status' => 'completed',
            'ended_at' => now(),
        ]);

        return redirect()->route('assessment.results', $assessmentId)
            ->with('success', 'Assessment has been completed.');
    }

    public function getWaitingStudents($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);
        $waitingStudents = $assessment->students()->wherePivot('status', 'waiting')->get();

        return response()->json($waitingStudents);
    }

    public function assessmentResults($assessmentId)
    {
        // Load only necessary assessment data
        $assessment = Assessment::select(['id', 'title'])
            ->findOrFail($assessmentId);

        // Get results with student data in chunks
        $results = StudentResult::whereHas('studentAssessment', function ($query) use ($assessmentId){
            $query->where('assessment_id', $assessmentId);
        })
            ->with(['student' => function($query){
                $query->select(['id', 'full_name']);
            }])
                ->select(['id', 'student_assessment_id','correct_answers', 'total_questions', 'score'])
                ->cursor();

        // Process results in memory-efficient way
        $students = [];
        $totalStudents = 0;
        $scores = [];
        $scoreDistribution = [];


        foreach ($results as $result) {
            $totalStudents++;
            $scores[] = $result->score;

            //dd($result->studentAssessment->student);

            // Build student list
            $students[] = [
                'idNumber' => $result->studentAssessment->student->idNumber,
                'id' => $result->studentAssessment->student->id,
                'name' => $result->studentAssessment->student->full_name,
                'latest_result' => $result->only(['correct_answers', 'total_questions', 'score'])
            ];

            // Build score distribution
            $range = floor($result->score / 10) * 10;
            $scoreDistribution[$range] = ($scoreDistribution[$range] ?? 0) + 1;
        }

        // Calculate metrics
        $averageScore = count($scores) > 0 ? array_sum($scores) / count($scores) : 0;
        $highestScore = count($scores) > 0 ? max($scores) : 0;
        $lowestScore = count($scores) > 0 ? min($scores) : 0;

        return inertia('Assessment/AssessmentResults', [
            'assessment' => $assessment,
            'students' => $students,
            'totalStudents' => (int) $totalStudents,
            'averageScore' => (float) $averageScore,
            'highestScore' => (float) $highestScore,
            'lowestScore' => (float) $lowestScore,
            'scoreDistribution' => $scoreDistribution,
        ]);
    }

    public function assessmentItemAnalysis($assessmentId){
        
        //Find the assessment
        $assessment = Assessment::select(['id', 'title'])->findOrFail($assessmentId);

        //Fetch the questions
        $questions = Question::whereHas('assessments', function ($query) use ($assessmentId) {
            $query->where('assessments.id', $assessmentId);
        })
        ->with(['studentAnswersForAssessment' => function ($query) use ($assessmentId){
            $query->whereHas('studentAssessment', function ($query) use ($assessmentId){
                $query->where('assessment_id', $assessmentId);
            });
        }])
        ->select(['id', 'question_text', 'options'])
        ->get();
    
        //dd($questions);
        //Process each questions per student
        $questionStats = $questions->map(function ($question){
            $options = is_array($question->options) ? $question->options : json_decode($question->options, true);
            $optionCounts = array_fill_keys($options, 0);

            //Count student response per option
            foreach($question->studentAnswersForAssessment as $answer){
                $studentAnswer = is_string($answer->student_answer) ? json_decode($answer->student_answer, true) : $answer->student_answer;


                if(is_array($studentAnswer)){
                    foreach($studentAnswer as $selectedOption){
                        if(isset($optionCounts[$selectedOption])){
                            $optionCounts[$selectedOption]++;
                        }
                    }
                }
            }

            return [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'correct_answers' => $question->studentAnswers->where('is_correct', true)->count(),
                'wrong_answers' => $question->studentAnswers->where('is_correct', false)->count(),
                'option_count' => $optionCounts
            ];
        });



        //dd($assessment, $questionStats);

        return inertia('Assessment/AssessmentItemAnalysis',[
            'assessment' => $assessment,
            'questions' => $questionStats   
        ]);
    }

    public function showIndividualAssessment($assessmentId, $studentId){
        //Fetch the students assessment
        //dd('reached');
        $assessment = StudentAssessment::with('result', 'questions.question')
        ->where('assessment_id', $assessmentId)
        ->where('user_id', $studentId)
        ->firstOrFail();

        //Get the current topic proficiency for the assessment
        $topicProficiencies = StudentTopicProficiency::where('student_id', $studentId)
        ->with('topic')
        ->get();

        return inertia('Assessment/IndividualAssessmentReport', [
            'assessment' => $assessment,
            'result' => $assessment->result,
            'questions' => $assessment->questions->map(function ($question) {
                return [
                    'question_text' => $question->question->question_text,
                    'question_options' => $question->question->options,
                    'correct_answer' => $question->question->correct_answer,
                    'student_answer' => $question->student_answer,
                    'is_correct' => $question->is_correct,
                    'score' => $question->question->weight,
                    'solution' => $question->question->solution,
                ];
            }),
            'topicProficiencies' => $topicProficiencies->map(function ($proficiency) {
                return [
                    'topic_name' => $proficiency->topic->name,
                    'grade' => $proficiency->grade,
                    'current_level' => $proficiency->proficiency_level,
                ];
            }),
        ]);


    }

}
