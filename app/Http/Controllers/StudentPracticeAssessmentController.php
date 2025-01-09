<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentPracticeAssessmentRequest;
use App\Http\Requests\UpdateStudentPracticeAssessmentRequest;
use App\Models\Question;
use App\Models\StudentAssessmentTopicProficiencies;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentPracticeAssessmentQuestion;
use App\Models\StudentPracticeResult;
use App\Models\StudentQuestionUsage;
use App\Models\StudentTopicProficiency;
use Illuminate\Support\Facades\Auth;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class StudentPracticeAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get the authenticated user's ID
        $userId = Auth::id();
    
        $assessments = StudentPracticeAssessment::where('student_id', $userId)
            ->with('subject') // Eager load the 'subject' relationship
            ->get();

        //dd($assessments);
    
        // Pass the collection as an array to Inertia
        return inertia('PracticeAssessment/PracticeIndex', ['assessments' => $assessments]);
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

        // Return the inertia view with subjects
        return inertia('PracticeAssessment/PracticeGeneratorForm', [
            'subjects' => $subjects,
            'topics' => $topics,
            'search' => $search,
            'subjectId' => $subjectId,
        ]);
    }


    /**
     * Summary of searchTopics
     * @param \Illuminate\Http\Request $request
     * @return mixed
     * 
     */
    // public function searchTopics(Request $request, $selectedSubject){
    //     // Get the search query and subject ID from the request
    //     $search = $request->input('search');
        
    //     // Fetch the topics based on the subject and search query
    //     $topics = Topics::when($selectedSubject, function ($query, $selectedSubject) {
    //         return $query->where('subject_id', $selectedSubject);
    //     })
    //     ->when($search, function ($query, $search) {
    //         return $query->where('name', 'like', "%{$search}%");
    //     })
    //     ->get();

    //     // Return the topics as json
    //     return response()->json(['topics' => $topics]);
    // }


    /**
     * Summary of store
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:proficiency,criteria,exam',
            'subject_id' => 'required|exists:subjects,id',
            'topics' => 'required|array',
            'topics.*' => 'exists:topics,id',
            'total_items' => 'required|integer|min:1',
            'time_limit' => 'required|integer',
        ]);

        $studentId = Auth::id();
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
        if ($type === 'criteria') {
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

        // Generate question based on the type
        $questions = [];
        if ($type === 'proficiency') {
            $questions = $this->generateProficiencyQuestions($studentId, $topics, $totalItems);
        } elseif ($type === 'criteria') {
            $questions = $this->generateCriteriaQuestions($studentId, $topics, $totalItems);
        } elseif ($type === 'exam') {
            $questions = $this->generateExamQuestions($studentId, $subjectId);
        }

        // Debugging: Log the generated questions
        Log::info('Generated Questions:', $questions->toArray());

        // Check if questions are empty
        if (empty($questions) || $questions->isEmpty()) {
            return response()->json(['message' => 'No questions available for this assessment.'], 422);
        }

        // Create the assessment
        $assessment = StudentPracticeAssessment::create([
            'student_id' => $studentId,
            'subject_id' => $subjectId,
            'total_items' => count($questions),
            'type' => $type,
            'time_limit' => $timeLimitFormatted,
        ]);


        //Attach the questions to the assessment
        foreach ($questions as $question) {
            StudentPracticeAssessmentQuestion::create([
                'practice_assessment_id' => $assessment->id,
                'question_id' => $question->id,
            ]);
        }

        return to_route('practice-assessment-generator.index')->with('message', 'Assessment was Created Successfully');


        //Generate the questions based on the type
        //if the type is proficiency, generate question based on the StudentTopicProficiency
        //if the type isi criteria, generate question based on the StudentTopicCriteria
        //if the topic is exam, it should generate question based on the Table of Specification. It should simulate a board exam where it generates the assessment based on the Table of Specification
    }


    /**
     * Summary of generateProficiencyQuestions
     * @param mixed $studentId
     * @param mixed $topicIds
     * @param mixed $totalItems
     * @return mixed
     */
    private function generateProficiencyQuestions($studentId, $topicIds, $totalItems)
    {
        $questions = collect(); // Use collection instead of array

        // Determine questions per topic
        $questionsPerTopic = (int) ceil($totalItems / count($topicIds));

        foreach ($topicIds as $topicId) {
            // Step 1: Get the student's proficiency for the topic
            $proficiency = StudentTopicProficiency::where('student_id', $studentId)
                ->where('topic_id', $topicId)
                ->first();

            // Log proficiency
            Log::info("Proficiency for student $studentId and topic $topicId:", ['proficiency' => $proficiency]);

            // Bloom levels weighting based on proficiency
            $proficiencyWeighting = [
                'beginner' => ['Remembering' => 0.7, 'Understanding' => 0.3],
                'intermediate' => ['Applying' => 0.4, 'Analyzing' => 0.4, 'Remembering' => 0.2],
                'advanced' => ['Evaluating' => 0.3, 'Creating' => 0.3, 'Analyzing' => 0.2, 'Applying' => 0.2],
            ];

            $bloomWeights = $proficiencyWeighting[$proficiency?->proficiency_level] ?? $proficiencyWeighting['beginner'];

            // Calculate number of questions per Bloom level
            $questionsPerLevel = [];
            $totalWeight = array_sum($bloomWeights);
            foreach ($bloomWeights as $level => $weight) {
                $questionsPerLevel[$level] = (int) ceil(($weight / $totalWeight) * $questionsPerTopic);
            }

            // Log questions per level
            Log::info("Questions per level for topic $topicId:", ['questionsPerLevel' => $questionsPerLevel]);

            // Retrieve questions per Bloom level
            $topicQuestions = collect();
            foreach ($bloomWeights as $level => $weight) {
                $levelQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'practice')
                    ->where('difficulty', $level)
                    ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                        $query->where('student_id', $studentId)
                            ->where('is_used', true);
                    })
                    ->inRandomOrder()
                    ->take($questionsPerLevel[$level])
                    ->get();

                // Log retrieved questions
                Log::info("Retrieved questions for topic $topicId and level $level:", ['questions' => $levelQuestions]);

                $topicQuestions = $topicQuestions->merge($levelQuestions);
            }

             // Handle fallback if questions are insufficient
            if ($topicQuestions->count() < $questionsPerTopic) {
                $remaining = $questionsPerTopic - $topicQuestions->count();
                $additionalQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'practice')
                    ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                        $query->where('student_id', $studentId)
                            ->where('is_used', true);
                    })
                    ->inRandomOrder()
                    ->take($remaining)
                    ->get();
                
                // Log additional questions
                Log::info("Additional questions for topic $topicId:", ['questions' => $additionalQuestions]);

                $topicQuestions = $topicQuestions->merge($additionalQuestions);
                }
                // Step 6: If still not enough questions, get random questions regardless of difficulty
                if ($topicQuestions->count() < $questionsPerTopic) {
                    $remaining = $questionsPerTopic - $topicQuestions->count();
                    $randomQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'practice')
                        ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                            $query->where('student_id', $studentId)
                                ->where('is_used', true);
                        })
                        ->inRandomOrder()
                        ->take($remaining)
                        ->get();

                    // Log random questions
                    Log::info("Random questions for topic $topicId:", ['questions' => $randomQuestions]);

                    $topicQuestions = $topicQuestions->merge($randomQuestions);
                }

            // Step 5: Mark fetched questions as used
            foreach ($topicQuestions as $question) {
                StudentQuestionUsage::updateOrCreate(
                    ['student_id' => $studentId, 'question_id' => $question->id],
                    ['is_used' => true, 'updated_at' => now()]
                );
            }

            $questions = $questions->merge($topicQuestions);
        }

        return $questions;
    }

    /**
     * Summary of generateCriteriaQuestions
     * @param mixed $studentId
     * @param mixed $topicIds
     * @param mixed $totalItems
     * @return mixed
     */
    private function generateCriteriaQuestions($studentId, $topicIds, $totalItems)
    {
        $questions = collect(); // Use collection instead of array

        foreach ($topicIds as $topicId) {
            // Step 1: Get the grading criteria for the topic
            $criteria = TopicGradingCriteria::getCriteriaByTopic($topicId);

            // Log criteria
            Log::info("Criteria for topic $topicId:", ['criteria' => $criteria]);

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
                        ->where('purpose_type', 'practice')
                        ->where('difficulty', $level)
                        ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                            $query->where('student_id', $studentId)
                                ->where('is_used', true);
                        })
                        ->inRandomOrder()
                        ->take($questionsForCriterion)
                        ->get();

                    // Log retrieved questions
                    Log::info("Retrieved questions for topic $topicId and level $level:", ['questions' => $levelQuestions]);

                    $criterionQuestions = $criterionQuestions->merge($levelQuestions);
                }

                // Step 5: If not enough questions, fallback to other difficulty levels
                if ($criterionQuestions->count() < $questionsForCriterion) {
                    $remaining = $questionsForCriterion - $criterionQuestions->count();

                    // Fetch additional questions from different difficulty levels
                    $additionalQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'practice')
                        ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                            $query->where('student_id', $studentId)
                                ->where('is_used', true);
                        })
                        ->whereNotIn('difficulty', $bloomLevels) // Exclude selected Bloom levels
                        ->inRandomOrder()
                        ->take($remaining)
                        ->get();

                    // Log additional questions
                    Log::info("Additional questions for topic $topicId:", ['questions' => $additionalQuestions]);

                    // Merge additional questions into the result
                    $criterionQuestions = $criterionQuestions->merge($additionalQuestions);
                }

                // Step 6: If still not enough questions, get random questions regardless of difficulty
                if ($criterionQuestions->count() < $questionsForCriterion) {
                    $remaining = $questionsForCriterion - $criterionQuestions->count();
                    $randomQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'practice')
                        ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                            $query->where('student_id', $studentId)
                                ->where('is_used', true);
                        })
                        ->inRandomOrder()
                        ->take($remaining)
                        ->get();

                    // Log random questions
                    Log::info("Random questions for topic $topicId:", ['questions' => $randomQuestions]);

                    $criterionQuestions = $criterionQuestions->merge($randomQuestions);
                }

                // Step 5: Mark fetched questions as used
                foreach ($criterionQuestions as $question) {
                    StudentQuestionUsage::updateOrCreate(
                        ['student_id' => $studentId, 'question_id' => $question->id],
                        ['is_used' => true, 'updated_at' => now()]
                    );
                }

                $questions = $questions->merge($criterionQuestions);
            }
        }

        return $questions;
    }

    /**
     * Summary of generateExamQuestions
     * @param mixed $studentId
     * @param mixed $subjectId
     * @throws \Exception
     * @return mixed
     */
    private function generateExamQuestions($studentId, $subjectId)
    {
        $questions = collect(); // Use collection instead of array
        $totalItems = 0;

        // Step 1: Fetch the Table of Specification (ToS) for the subject
        $tableOfSpecifications = TableOfSpecification::where('subject_id', $subjectId)->get();

        if ($tableOfSpecifications->isEmpty()) {
            throw new \Exception('No Table of Specification defined for this subject.');
        }

        // Log Table of Specification
        Log::info("Table of Specification for subject $subjectId:", ['tableOfSpecifications' => $tableOfSpecifications]);

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
                ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                    $query->where('student_id', $studentId)
                          ->where('is_used', true);
                })
                ->inRandomOrder()
                ->take($questionsForTopic)
                ->get();

            // Log retrieved questions
            Log::info("Retrieved questions for topic $topicId and difficulty {$tos->difficulty}:", ['questions' => $topicQuestions]);

            // Step 5: If all questions are used, reset usage
            if ($topicQuestions->count() < $questionsForTopic) {
                // Reset all used questions for this topic
                StudentQuestionUsage::where('student_id', $studentId)
                    ->whereIn('question_id', Question::where('topic_id', $topicId)->pluck('id'))
                    ->update(['is_used' => false]);

                // Re-fetch questions after reset
                $remainingQuestionsNeeded = $questionsForTopic - $topicQuestions->count();
                $additionalQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'exam')
                    ->where('difficulty', $tos->difficulty) // Use the same difficulty level
                    ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                        $query->where('student_id', $studentId)
                              ->where('is_used', true);
                    })
                    ->inRandomOrder()
                    ->take($remainingQuestionsNeeded)
                    ->get();

                // Log additional questions
                Log::info("Additional questions for topic $topicId after reset:", ['questions' => $additionalQuestions]);

                $topicQuestions = $topicQuestions->merge($additionalQuestions);
            }

            // Step 6: Mark fetched questions as used
            foreach ($topicQuestions as $question) {
                StudentQuestionUsage::updateOrCreate(
                    ['student_id' => $studentId, 'question_id' => $question->id],
                    ['is_used' => true, 'updated_at' => now()]
                );
            }

            // Add the questions to the main list
            $questions = $questions->merge($topicQuestions);
        }

        return $questions;
    }

    /**
     * Taking the Practice assessment
     */
    public function startIndex($practiceAssessmentId){
        return inertia('PracticeAssessment/PracticeStart', ['practiceAssessmentId' => $practiceAssessmentId]);
    }

    public function startAssessment($practiceAssessmentId){
        $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);

        if($assessment->status !== 'active'){
            return back()->withErrors(['message' => 'This assessment has already started']);
        } 

        $assessment->update([
            'status' => 'on_going',
            'started_at' => now()
        ]);

        return redirect()->route('practice-assessment.take', $practiceAssessmentId);
    }

    public function takePracticeAssessment($practiceAssessmentId){
        $cacheKey = 'practice_assessment_' . $practiceAssessmentId . '_shuffled';
        $practiceAssessment = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($practiceAssessmentId) {
            $assessment = StudentPracticeAssessment::with([
                'questions' => function ($query) {
                    $query->with('question:id,question_text,correct_answer,options,topic_id,difficulty')
                        ->select('id', 'practice_assessment_id', 'question_id', 'answered', 'is_correct');
                },
            ])
            ->where('id', $practiceAssessmentId)
            ->where('student_id', Auth::id())
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

        return inertia('PracticeAssessment/TakeAssessment', [
            'practiceAssessment' => $practiceAssessment,
        ]);
    }

    public function saveAnswer(Request $request, $practiceAssessmentId, $questionId){
        $practiceAssessmentQuestion = StudentPracticeAssessmentQuestion::where('practice_assessment_id', $practiceAssessmentId)
        ->where('question_id', $questionId)
        ->firstOrFail();

        $validated = $request->validate([
            'selected_option' => 'required|string'
        ]);

        // Check if the assessment is still within the time limit
        $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);
        $elapsedTime = now()->diffInSeconds($assessment->started_at);
        $timeLimit = strtotime($assessment->time_limit) - strtotime('TODAY');

        if ($elapsedTime > $timeLimit) {
            return response()->json(['message' => 'Time limit exceeded. Answer cannot be saved.'], 422);
        }

        //Check if the selected option is correct
        $question = $practiceAssessmentQuestion->question;
        $isCorrect = $question->correct_answer === $validated['selected_option'];
        
        //Update the Student's answer
        $practiceAssessmentQuestion->update([
            'answered' => true,
            'is_correct' => $isCorrect
        ]);

        return back();

    }

    public function submitAssessment($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::with('questions.question')->findOrFail($practiceAssessmentId);

        // Calculate elapsed time
        $elapsedTime = now()->diffInSeconds($assessment->started_at);
        $timeLimit = strtotime($assessment->time_limit) - strtotime('TODAY');

        // Check if the time limit has been exceeded
        if ($elapsedTime > $timeLimit) {
            $assessment->update([
                'status' => 'timed_out',
                'submitted_at' => now(),
            ]);
        } else {
            $assessment->update([
                'status' => 'completed',
                'submitted_at' => now(),
            ]);
        }

        // Grade the assessment (regardless of whether time expired or student submitted manually)
        return $this->gradeAssessment($practiceAssessmentId);
    }

    public function gradeAssessment($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);

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

            $this->updateTopicProficiency($assessment->student_id, $topicId, $numerator, $denominator, $assessment->id);
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
            'applying', 'analyzing' => 2,        // Moderate
            'evaluating', 'create' => 3,       // Advanced
            default => 1,                        // Default to easy
        };
    }

    /**
     * Update Topic Proficiency
     */
    private function updateTopicProficiency($studentId, $topicId, $numerator, $denominator, $assessmentId)
    {
        $totalNumerator = array_sum($numerator);
        $totalDenominator = array_sum($denominator);

        $proficiencyScore = $totalDenominator > 0 ? $totalNumerator / $totalDenominator : 0;

        // Fetch the current proficiency record (if it exists)
        $proficiency = StudentTopicProficiency::firstOrCreate(
            [
                'student_id' => $studentId,
                'topic_id' => $topicId,
            ],
            [
                'proficiency_level' => 'beginner',
                'grade' => 0.00,
            ]
        );

        // Save the current proficiency to the historical table
        StudentAssessmentTopicProficiencies::create([
            'assessment_id' => $assessmentId,
            'student_id' => $studentId,
            'topic_id' => $topicId,
            'grade' => $proficiency->grade, // Save the grade before updating it
            'proficiency_level' => $proficiency->proficiency_level, // Save the level before updating it
        ]);

        // Update the current proficiency record
        $proficiency->grade = $proficiencyScore * 100; // Convert to percentage
        $proficiency->proficiency_level = $this->determineProficiencyLevel($proficiencyScore);
        $proficiency->save();
    }

    public function viewAssessmentReport($practiceAssessmentId){
        $assessment = StudentPracticeAssessment::with('results', 'questions.question')
        ->findOrFail($practiceAssessmentId);

        //Get historical topic proficiency for the assessment
        $topicProficiencies = StudentAssessmentTopicProficiencies::where('assessment_id', $practiceAssessmentId)
        ->with('topic')
        ->get();

        return inertia('PracticeAssessment/AssessmentReport', [
            'assessment' => $assessment,
            'result' => $assessment->results,
            'questions' => $assessment->questions->map(function ($question){
                return [
                    'question_text' => $question->question->text,
                    'question_options' => $question->question->options,
                    'correct_answer' => $question->question->correct_answer,
                    'student_answer' => $question->answered,
                    'is_correct' => $question->is_correct,
                    'score' => $question->question->weight,
                ];
            }),
            'topicProficiencies' => $topicProficiencies->map(function ($proficiency){
                return [
                    'topic_name' => $proficiency->topic->name,
                    'previous_grade' => $proficiency->previous_grade,
                    'previous_level' => $proficiency->previous_level,
                    'current_grade' => $proficiency->current_grade,
                    'current_level' => $proficiency->current_level,
                ];
            })
        ]);
        
    }
    
    


    /**
     * Display the specified resource.
     * To be remove/ change
     */
    public function show($id)
    {
        $assessment = StudentPracticeAssessment::with([
            'questions' => function ($query) {
                $query->select('id', 'practice_assessment_id', 'question_id'); // Load only necessary fields
            },
            'questions.question' => function ($query) {
                $query->select('id', 'question_text', 'difficulty'); // Load only necessary fields
            },
            'subject'
        ])->findOrFail($id);
        
        //dd($assessment->toArray());
        return inertia('PracticeAssessment/PracticeQuestionList', ['assessment' => $assessment]);
    }

 

    /**
     * Determine proficiency level based on score
     */
    private function determineProficiencyLevel($score)
    {
        if ($score >= 0.85) {
            return 'advanced';
        } elseif ($score >= 0.70) {
            return 'intermediate';
        } else {
            return 'beginner';
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentPracticeAssessment $studentPracticeAssessment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentPracticeAssessmentRequest $request, StudentPracticeAssessment $studentPracticeAssessment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentPracticeAssessment $studentPracticeAssessment)
    {
        //
    }
}
