<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateAssessmentRequest;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\Question;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Auth;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all the assessments in descending order
        $assessments = Assessment::orderBy('created_at', 'desc')->get();

        return inertia('Assessment/AssessmentIndex', ['assessments' => $assessments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Get all the Subjects for the dropdown
        $subjects = Subject::all();

        // Get the search query and subject ID
        $search = $request->input('search');
        $subjectId = $request->input('subject_id');

    
        // Get all the Topics with search functionality
        $topics = Topics::when($subjectId, function ($query, $subjectId) {
            return $query->where('subject_id', $subjectId);
        })
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->latest() // Orders by created_at in descending order
        ->get(); // Remove pagination

        return inertia('Assessment/AssessmentGenerateForm', [
            'subjects' => $subjects,
            'topics' => $topics,
            'search' => $search,
            'subjectId' => $subjectId,
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

        // Convert time_limit from minutes to HH:MM:SS format
        $timeLimitInSeconds = $validated['time_limit'] * 60;
        $hours = floor($timeLimitInSeconds / 3600);
        $minutes = floor(($timeLimitInSeconds % 3600) / 60);
        $seconds = $timeLimitInSeconds % 60;
        $timeLimitFormatted = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);

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
            'status' => 'active',
            'time_limit' => $timeLimitFormatted
        ]);

        //Attach the questions to the assessment
        foreach ($questions as $question) {
            AssessmentQuestion::create([
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

    private function generateExamQuestions($subjectId)
    {
        $questions = collect(); // Use collection instead of array
        $totalItems = 0;

        // Step 1: Fetch the Table of Specification (ToS) for the subject
        $tableOfSpecifications = TableOfSpecification::where('subject_id', $subjectId)->get();

        if ($tableOfSpecifications->isEmpty()) {
            throw new \Exception('No Table of Specification defined for this subject.');
        }

        // Step 2: Calculate the total items based on ToS
        foreach ($tableOfSpecifications as $tos) {
            $totalItems += $tos->total_items;
        }

        // Step 3: Generate questions for each topic based on ToS difficulty
        foreach ($tableOfSpecifications as $tos) {
            $topicId = $tos->topic_id;
            $questionsForTopic = $tos->total_items;

            // Step 4: Fetch unused questions based on ToS difficulty
            $topicQuestions = Question::where('topic_id', $topicId)
                ->where('purpose_type', 'exam') // Only fetch exam-related questions
                ->where('difficulty', $tos->difficulty) // Use the difficulty from the ToS (Bloom's level)
                ->where('is_used', false)
                ->inRandomOrder()
                ->take($questionsForTopic)
                ->get();

            // Step 5: If all questions are used, reset usage
            if ($topicQuestions->count() < $questionsForTopic) {
                // Reset all used questions for this topic
                Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'exam')
                    ->update(['is_used' => false]);

                // Re-fetch questions after reset
                $remainingQuestionsNeeded = $questionsForTopic - $topicQuestions->count();
                $additionalQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'exam')
                    ->where('difficulty', $tos->difficulty) // Use the same difficulty level
                    ->where('is_used', false)
                    ->inRandomOrder()
                    ->take($remainingQuestionsNeeded)
                    ->get();

                $topicQuestions = $topicQuestions->merge($additionalQuestions);
            }

            // Step 6: Mark fetched questions as used
            foreach ($topicQuestions as $question) {
                $question->update(['is_used' => true, 'updated_at' => now()]);
            }

            // Add the questions to the main list
            $questions = $questions->merge($topicQuestions);
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

        // Get all the Subjects for the dropdown
        $subjects = Subject::all();

        // Get the topics related to the assessment's subject
        $topics = Topics::where('subject_id', $assessment->subject_id)->get();

        // Get all the questions related to the assessment
        $questions = $assessment->questions;

        return inertia('Assessment/AssessmentEditForm', [
            'assessment' => $assessment,
            'subjects' => $subjects,
            'topics' => $topics,
            'questions' => $questions,
        ]);
    }

    public function replaceQuestion($questionId)
    {
        
        $replacement = Question::replaceQuestion($questionId);

        if ($replacement) {
            return response()->json(['message' => 'Question replaced successfully.', 'replacement' => $replacement], 200);
        }

        return response()->json(['message' => 'No replacement question found.'], 404);
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
     * This can be the way for the students to access the 
     */
    public function generateCode($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);
        $code = $assessment->generateCode();

        return response()->json(['message' => 'Code generated successfully.', 'code' => $code], 200);
    }

    /**
     * 
     */
    public function start($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);
        $assessment->generateCode();

        return response()->json(['message' => 'Assessment started successfully.', 'code' => $assessment->code], 200);
    }
}
