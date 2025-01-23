<?php

namespace App\Http\Controllers;


use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\Question;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentQuestion;
use App\Models\StudentTopicProficiency;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

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
            foreach ($questions as $question){
                $assessment->questions()->attach($question->id);
            }

            return to_route('');

        }catch(\Exception $e){
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    private function generateExamQuestions($subjectId)
    {
        $questions = collect();
        $selectedQuestionIds = [];

        //Fetch the TOS for the subject
        $tableOfSpecification = TableOfSpecification::where('subject_id', $subjectId);

        //Generate the questions based on the TOS
        foreach($tableOfSpecification as $tos){
            $topicId = $tos->topic_id;
            $difficultyDistribution = json_decode($tos->difficulty, true);
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
                if($questionsForDifficulty->count() < $count){
                    $remainingQUestionsNeeded = $count - $questionsForDifficulty->count();

                    //Reset used questions for this difficulty level
                    Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'examination')
                    ->where('difficulty', $difficultyLevel)
                    ->update(['is_used' => false]);

                    //Re-fetch additional questions after reset
                    $additionalQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'examination')
                    ->where('difficulty', $difficultyLevel)
                    ->whereNotIn('id', $selectedQuestionIds)
                    ->inRandomOrder()
                    ->take($remainingQUestionsNeeded)
                    ->get();

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
     * Display the specified resource.
     */
    public function show(Assessment $assessment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Get all the questions related to the assessment
        $questions = $assessment->questions;

        return inertia('Assessment/AssessmentEditForm', [
            'assessment' => $assessment,
            'questions' => $questions,
        ]);
    }

    public function replaceQuestion($questionId, $assessmentId)
    {

        //FInd the old question
        $oldQuestion = Question::findOrFail($questionId);

        if(!$oldQuestion->assessments()->where('assessment_id', $assessmentId)->exists()){
            return back()->withErrors(['message' => 'Question is not part of this assessment']);
        }

        $oldQuestion->update(['is_used' => false]);
        
        //Replace the question
        $replacement = Question::where('topic_id', $oldQuestion->topic_id)
        ->where('difficulty', $oldQuestion->difficulty)
        ->where('purpose_type', 'exam')
        ->where('is_used', false)
        ->inRandomOrder()
        ->first();

        if ($replacement) {
            $oldQuestion->update(['is_used' => true]);
            return back()->withErrors(['message' => 'No replacement found']);
        }

        //Mark the replacement question as used
        $replacement->update(['is_used' => true]);

        $oldQuestion->assessments()->updateExistingPivot($assessmentId, [
            'question_id' => $replacement->id,
            'updated_at'=> now()
        ]);

        return back()->with([
            'message' => 'Question replaced successfully.',
            'replacement' => $replacement,
        ]);
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
        }

        $assessment->questions->map(function ($question) {
            // Ensure correct_answer is accessible and formatted correctly
            $question->correct_answer_text = collect($question->options)->filter(function ($option) use ($question) {
                return in_array($option, $question->correct_answer); // Match correct answers
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
            return response()->json(['message' => 'This assessment has already been approved.']);
        }

        //Approve the assessment
        $assessment->update([
            'approved' => true,
            'approved_by' => Auth::user()->id,
        ]);

        return inertia('Assessment/AssessmentIndex', ['message' => 'Assessment is Approved']);
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
            'approved' => false,
            'approved_by' => Auth::user()->id,
            'rejection_reason' => $validated['rejection_reason']
        ]);

        return inertia('assessment-PH.index', ['message' => 'The assessment was successfully rejected']);
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
    public function inputCode(){
        return inertia('Assessment/StudentInputCode');
    }

    public function joinAssessment(Request $request)
    {
        $code = $request->input('code');
        $assessment = Assessment::where('access_code', $code)->first();

        if (!$assessment) {
            return back()->withErrors(['code' => 'Invalid access code.']);
        }

        // Ensure the assessment is active or ongoing
        if (!in_array($assessment->status, ['active', 'on_going'])) {
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
        $alreadyJoined = $assessment->students()->wherePivot('student_id', $student->id)->exists();

        if (!$alreadyJoined) {
            // Set the status to 'started' for ongoing assessments
            $status = $assessment->status === 'on_going' ? 'started' : 'waiting';

            // Attach the student to the assessment
            $assessment->students()->attach($student->id, ['status' => $status]);
        }

        // Redirect based on assessment status
        if ($assessment->status === 'on_going') {
            return to_route('', $assessment->id);
        }

        return view('student.waiting-list', ['assessment' => $assessment]);
    }

    public function takeAssessment($assessmentId)
    {
        // Retrieve the assessment
        $assessment = Assessment::findOrFail($assessmentId);
    
        // Ensure the assessment is ongoing
        if ($assessment->status !== 'on_going') {
            return back()->with(['message' => 'The assessment is not yet available or has been completed']);
        }
    
        // Cache the shuffled questions and options for a limited time
        $cacheKey = 'assessment_' . $assessmentId . '_shuffled';
        $assessmentData = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($assessmentId) {
            $assessment = Assessment::with([
                'questions' => function ($query) {
                    $query->with('question:id,question_text,options,topic_id,format_type')
                        ->select('id', 'assessment_id', 'question_id', 'student_answer', 'is_correct');
                },
            ])
            ->where('id', $assessmentId)
            ->firstOrFail();
    
            // Shuffle questions
            $shuffledQuestions = $assessment->questions->shuffle();
    
            // Shuffle options for each question
            foreach ($shuffledQuestions as $question) {
                $options = $question->question->options;
                if (!is_array($options)) {
                    $options = json_decode($options, true);
                }
                $question->question->options = collect($options)->shuffle()->toArray();
            }
    
            $assessment->setRelation('questions', $shuffledQuestions);
    
            return $assessment;
        });
    
        return inertia('Assessment/TakeAssessment', [
            'assessment' => $assessmentData,
        ]);
    }

    public function saveAnswer(Request $request, $assessmentId, $questionId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        $validated = $request->validate([
            'selected_option' => 'required|array'
        ]);

        $assessmentQuestion = StudentAssessmentQuestion::where('assessment_id', $assessmentId)
        ->where('question_id', $questionId)
        ->firstOrFail();

        // Check if the assessment is already due
        if ($assessment->time_limit && $assessment->started_at) {
            $dueTime = $assessment->started_at->addMinutes($assessment->time_limit);
            if (now()->greaterThan($dueTime)) {
                return back()->withErrors(['message' => 'The assessment has already ended.']);
            }
        }

        //Check if the selected answer is correct
        $question = $assessment->question;
        $correctAnswer = $question->correct_answer;
        $isCorrect = !array_diff($validated['selected_option'], $correctAnswer);

        $assessmentQuestion->update([
            'student_answer' => $validated['selected_option'],
            'is_correct' => $isCorrect
        ]);

        return back();
    }
    
    public function submitAssessment($assessmentId){
        $assessment = StudentAssessment::with('answers.question')->findOrFail($assessmentId);

        // Check if the assessment is already due
        if ($assessment->time_limit && $assessment->started_at) {
            $dueTime = $assessment->started_at->addMinutes($assessment->time_limit);
            if (now()->greaterThan($dueTime)) {
                $assessment->update([
                    'status' => 'timed_out',
                    'submitted_at' => now(),
                ]);
            }else{
                $assessment->update([
                    'status' => 'completed',
                    'submitted_at' => now(),
                ]);
            }
        }

        $this->gradeAssessment($assessmentId);

        return back()->with([
            'message' => 'Assessment has been submitted successfully'
        ]);
    }

    public function gradeAssessment($assessmentId)
    {
        $assessment = StudentAssessment::findOrFail($assessmentId);

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

        // Save the results to the database
        $assessment->results()->create([
            'student_id' => $assessment->student_id,
            'correct_answers' => $correctAnswers,
            'incorrect_answers' => $incorrectAnswers,
            'score_percentage' => $scorePercentage,
        ]);

        // Update proficiency for each topic
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

            $this->updateTopicProficiency($assessment->student_id, $topicId, $numerator, $denominator);
        }

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
    
        $proficiencyScore = $totalDenominator > 0 ? $totalNumerator / $totalDenominator : 0;
    
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
        $newTotalScore = ($proficiency->average_score * $proficiency->attempts) + ($proficiencyScore * 100);
        $proficiency->attempts += 1; // Increment attempts
        $proficiency->average_score = $proficiency->attempts > 0 ? $newTotalScore / $proficiency->attempts : $proficiencyScore * 100;
        $proficiency->grade = $proficiencyScore * 100; // Current assessment grade
        $proficiency->proficiency_level = match (true) {
            $proficiency->average_score < 60 => 'beginner',
            $proficiency->average_score >= 60 && $proficiency->average_score <= 80 => 'intermediate',
            default => 'advanced',
        };
        $proficiency->save();
    }

    /**
     * Professor View
     */

    public function initializeAssessment($assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        $waitingStudents = $assessment->students()->wherePivot('status', 'waiting')->get();

        return inertia('Assessment/AssessmentWaitingProf', [
            'assessment' => $assessment,
            'waitingStudents' => $waitingStudents,
            'assessmentCode' => $assessment->access_code,
        ]);
    }

    public function startAssessmentNow($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);


        // Ensure the assessment is approved and pending
        if ($assessment->status !== 'pending' || !$assessment->approved) {
            return back()->withErrors(['error' => 'Assessment must be approved and pending to start.']);
        }

        // Update assessment status to on_going and set the start time
        $assessment->update([
            'status' => 'on_going',
            'started_at' => now(),
        ]);

        // Update all waiting students to 'started' status
        $assessment->students()
            ->wherePivot('status', 'waiting')
            ->update(['status' => 'started']);

        // Broadcast an event to notify students (optional)
        //event(new AssessmentStarted($assessment));

        // Redirect to the professor's dashboard or status view
        return redirect()->route('professor.assessment-status', $assessmentId)
            ->with('success', 'Assessment has started.');
    }

    public function endAssessment($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Update assessment status to completed and set the end time
        $assessment->update([
            'status' => 'completed',
            'ended_at' => now(),
        ]);

        // Notify all students (optional)
        //event(new AssessmentEnded($assessment));

        return redirect()->route('professor.assessment-status', $assessmentId)
            ->with('success', 'Assessment has been completed.');
    }

}
