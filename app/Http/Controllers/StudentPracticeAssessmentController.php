<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\StudentAssessmentTopicProficiencies;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentPracticeAssessmentQuestion;
use App\Models\StudentQuestionUsage;
use App\Models\StudentTopicProficiency;
use App\Models\StudentTopicScore;
use Illuminate\Support\Facades\Auth;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

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
            ->paginate(10); // Implement pagination with 10 items per page

        // Pass the collection as an array to Inertia
        return inertia('PracticeAssessment/PracticeIndex', [
            'assessments' => $assessments,
        ]);
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
            'total_items' => 'required|integer|min:10',
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
        // if ($type === 'criteria') {
        //     foreach ($topics as $topicId) {
        //         $criteria = TopicGradingCriteria::where('topic_id', $topicId)->exists();
        //         if (!$criteria) {
        //             return response()->json(['message' => 'Assessment cannot be created because TopicGradingCriteria is not yet set by the faculty for topic ID: ' . $topicId], 422);
        //         }
        //     }
        // }
        // // Check if TableOfSpecification is available for the selected subject
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
        //Log::info('Generated Questions:', $questions->toArray());

        // Check if questions are empty
        if (empty($questions) || $questions->isEmpty()) {
            return back()->with(['message' => 'No questions available for this assessment.'], 422);
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

        // return inertia('PracticeAssessment/PracticeStart', ['practiceAssessmentId' => $assessment]);
        return to_route('practice-assessment.start', $assessment->id);

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
        $questions = collect(); // Use collection for easy merging

        // Determine questions per topic
        $questionsPerTopic = (int) ceil($totalItems / count($topicIds));

        foreach ($topicIds as $topicId) {
            // Step 1: Get the student's proficiency for the topic
            $proficiency = StudentTopicProficiency::where('student_id', $studentId)
                ->where('topic_id', $topicId)
                ->first();

            // If no record, estimate proficiency based on past performance
            if (!$proficiency) {
                $averageScore = StudentAssessmentTopicProficiencies::where('student_id', $studentId)
                    ->where('topic_id', $topicId)
                    ->avg('grade') ?? 0;

                $proficiencyLevel = $this->determineProficiencyLevel($averageScore);
            } else {
                $proficiencyLevel = $proficiency->proficiency_level;
            }

            // Bloom levels weighting based on proficiency
            $proficiencyWeighting = [
                'beginner' => ['Remembering' => 0.7, 'Understanding' => 0.3],
                'intermediate' => ['Applying' => 0.4, 'Analyzing' => 0.4, 'Remembering' => 0.2],
                'advanced' => ['Evaluating' => 0.3, 'Creating' => 0.3, 'Analyzing' => 0.2, 'Applying' => 0.2],
            ];

            $bloomWeights = $proficiencyWeighting[$proficiencyLevel] ?? $proficiencyWeighting['beginner'];

            // Distribute questions per Bloom level while ensuring total matches questionsPerTopic
            $totalWeight = array_sum($bloomWeights);
            $remainingQuestions = $questionsPerTopic;
            $lastLevel = array_key_last($bloomWeights);
            $questionsPerLevel = [];

            foreach ($bloomWeights as $level => $weight) {
                $questionsPerLevel[$level] = ($level === $lastLevel)
                    ? $remainingQuestions // Assign remaining to last level
                    : (int) floor(($weight / $totalWeight) * $questionsPerTopic);
                $remainingQuestions -= $questionsPerLevel[$level];
            }

            // Retrieve and select questions per Bloom level
            $topicQuestions = collect();

            foreach ($bloomWeights as $level => $weight) {
                $levelQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'practice')
                    ->where('difficulty', $level)
                    ->with(['studentQuestionUsages' => function ($query) use ($studentId) {
                        $query->where('student_id', $studentId);
                    }])
                    ->get();

                // Weight selection based on prior attempts
                $weightedQuestions = $levelQuestions->map(function ($question) {
                    $usage = $question->studentQuestionUsages->first();
                    return [
                        'question' => $question,
                        'weight' => $usage?->selection_percentage ?? 100,
                    ];
                });

                // Normalize weights
                $totalWeight = $weightedQuestions->sum('weight');
                $normalizedQuestions = $weightedQuestions->map(function ($item) use ($totalWeight) {
                    return [
                        'question' => $item['question'],
                        'normalizedWeight' => $totalWeight > 0 ? $item['weight'] / $totalWeight : 0,
                    ];
                });

                // Random selection based on normalized weights
                $selected = collect();
                $needed = $questionsPerLevel[$level];
                for ($i = 0; $i < $needed; $i++) {
                    $random = mt_rand() / mt_getrandmax();
                    $cumulativeWeight = 0;

                    foreach ($normalizedQuestions as $item) {
                        $cumulativeWeight += $item['normalizedWeight'];
                        if ($random <= $cumulativeWeight) {
                            if (!$selected->contains('id', $item['question']->id)) {
                                $selected->push($item['question']);
                            }
                            break;
                        }
                    }
                }

                $topicQuestions = $topicQuestions->merge($selected);
            }

            // Handle insufficient questions by redistributing proportionally
            $actualCount = $topicQuestions->count();
            $shortfall = $questionsPerTopic - $actualCount;

            if ($shortfall > 0) {
                foreach ($questionsPerLevel as $level => &$count) {
                    $count += (int) round(($count / $questionsPerTopic) * $shortfall);
                }
            }

            // Final fallback: Add remaining random questions if still insufficient
            if ($topicQuestions->count() < $questionsPerTopic) {
                $remaining = $questionsPerTopic - $topicQuestions->count();
                $additionalQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'practice')
                    ->whereNotIn('id', $topicQuestions->pluck('id'))
                    ->inRandomOrder()
                    ->take($remaining)
                    ->get();
                $topicQuestions = $topicQuestions->merge($additionalQuestions);
            }

            // Update question selection percentage based on mastery
            foreach ($topicQuestions as $question) {
                $studentUsage = StudentQuestionUsage::updateOrCreate(
                    ['student_id' => $studentId, 'question_id' => $question->id],
                    ['updated_at' => now()]
                );

                if ($studentUsage->correct_attempts >= 3) {
                    $studentUsage->selection_percentage = max(10, $studentUsage->selection_percentage - 20);
                }

                $studentUsage->save();
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
            //Log::info("Criteria for topic $topicId:", ['criteria' => $criteria]);

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
                   // Log::info("Retrieved questions for topic $topicId and level $level:", ['questions' => $levelQuestions]);

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
                    //Log::info("Additional questions for topic $topicId:", ['questions' => $additionalQuestions]);

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
                    //Log::info("Random questions for topic $topicId:", ['questions' => $randomQuestions]);

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
        //Log::info("Table of Specification for subject $subjectId:", ['tableOfSpecifications' => $tableOfSpecifications]);

        // Step 2: Calculate the total items based on ToS
        foreach ($tableOfSpecifications as $tos) {
            $totalItems += $tos->num_questions;
        }

        // Step 3: Generate questions for each topic based on ToS difficulty
        foreach ($tableOfSpecifications as $tos) {
            $topicId = $tos->topic_id;
            $questionsForTopic = $tos->total_items;

            // Step 4: Fetch unused questions based on ToS difficulty
            $topicQuestions = Question::where('topic_id', $topicId)
                ->where('purpose_type', 'practice') // Only fetch exam-related questions
                ->where('difficulty', $tos->difficulty) // Use the difficulty from the ToS (Bloom's level)
                ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                    $query->where('student_id', $studentId)
                          ->where('is_used', true);
                }) 
                ->inRandomOrder()
                ->take($questionsForTopic)
                ->get();

            // Log retrieved questions
            //Log::info("Retrieved questions for topic $topicId and difficulty {$tos->difficulty}:", ['questions' => $topicQuestions]);

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
                    ->whereNotIn('id', $topicQuestions->pluck('id')) // Ensure no duplication
                    ->inRandomOrder()
                    ->take($remainingQuestionsNeeded)
                    ->get();

                // Log additional questions
                //Log::info("Additional questions for topic $topicId after reset:", ['questions' => $additionalQuestions]);

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
    public function startIndex($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);

        // Get the time limit of the assessment
        $timeLimit = $assessment->time_limit;
        //dd($timeLimit);

        return inertia('PracticeAssessment/PracticeStart', [
            'practiceAssessmentId' => $practiceAssessmentId,
            'timeLimit' => $timeLimit,
        ]);
    }

    public function startAssessment($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::with(['questions.question:id,question_text,options,topic_id,format_type'])
            ->where('id', $practiceAssessmentId)
            ->where('student_id', Auth::id())
            ->firstOrFail();

        // Ensure the assessment is active
        if ($assessment->status !== 'active') {
            return to_route('practice-assessment-generator.index', ['message' => 'The assessment was already done']);
        }

        // Shuffle questions
        $shuffledQuestions = $assessment->questions->shuffle();

        foreach ($shuffledQuestions as $question) {
            $options = $question->question->options;

            // Decode options if they are stored as JSON
            if (!is_array($options)) {
                $options = json_decode($options, true);
            }

            // Shuffle the options
            $shuffledOptions = collect($options)->shuffle()->toArray();
            $question->question->options = $shuffledOptions;
        }

        // Save shuffled question IDs in the session
        Session::put('shuffled_questions_' . $practiceAssessmentId, $shuffledQuestions->pluck('id')->toArray());

        // Update assessment status
        $assessment->update([
            'status' => 'on_going',
            'started_at' => now(),
        ]);

        return to_route('practice-assessment.take', $practiceAssessmentId);
    }



    public function takePracticeAssessment($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);

        // Ensure the assessment is ongoing
        if ($assessment->status !== 'on_going') {
            return to_route('practice-assessment-generator.index', ['message' => 'The assessment was already done.']);
        }

        // Set the cache key
        $cacheKey = 'practice_assessment_' . $practiceAssessmentId . '_shuffled';

        // Check if shuffled questions are already cached
        $practiceAssessment = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($practiceAssessmentId, $assessment) {
            $shuffledQuestionIds = Session::get('shuffled_questions_' . $practiceAssessmentId);

            // If no shuffled question IDs are found in the session, shuffle and store them
            if (!$shuffledQuestionIds) {
                abort(500, 'Shuffled questions not found. Please restart the assessment.');
            }

            // Load questions with the `question` relationship, including student answers
            $assessment = StudentPracticeAssessment::with([
                'questions' => function ($query) use ($shuffledQuestionIds) {
                    $query->with('question:id,question_text,options,topic_id,format_type') // Load related `question`
                        ->whereIn('id', $shuffledQuestionIds)
                        ->select('id', 'practice_assessment_id', 'question_id', 'student_answer');
                },
            ])
            ->where('id', $practiceAssessmentId)
            ->where('student_id', Auth::id())
            ->firstOrFail();

            // Ensure questions are shuffled once based on the session state
            $shuffledQuestions = $assessment->questions->sortBy(function ($question) use ($shuffledQuestionIds) {
                return array_search($question->id, $shuffledQuestionIds);
            });

            // Only shuffle options once per session
            foreach ($shuffledQuestions as $question) {
                $options = $question->question->options;

                // If the options haven't been shuffled already, shuffle them
                if (!Session::has('shuffled_options_' . $question->id)) {
                    //$options = json_decode($options, true);
                    $question->question->options = collect($options)->shuffle()->toArray();
                    Session::put('shuffled_options_' . $question->id, true); // Mark this question as shuffled
                }
            }

            $assessment->setRelation('questions', $shuffledQuestions);

            return $assessment;
        });

        // Pass the practice assessment to the front-end
        return inertia('PracticeAssessment/PracticeTakeAssessment', [
            'practiceAssessment' => $practiceAssessment,
        ]);
    }

    public function saveAnswer(Request $request, $practiceAssessmentId, $questionId){
        $practiceAssessmentQuestion = StudentPracticeAssessmentQuestion::where('practice_assessment_id', $practiceAssessmentId)
        ->where('question_id', $questionId)
        ->firstOrFail();

        //dd($request->all());

        $validated = $request->validate([
            'selected_option' => 'required|array'
        ]);

        //dd($validated['selected_option']);

        // Check if the assessment is still within the time limit
        // $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);
        // $elapsedTime = now()->diffInSeconds($assessment->started_at);
        // $timeLimit = strtotime($assessment->time_limit) - strtotime('TODAY');

        // if ($elapsedTime > $timeLimit) {
        //     return response()->json(['message' => 'Time limit exceeded. Answer cannot be saved. Please submit your work'], 422);
        // }

        // Check if the selected option is correct
        $question = $practiceAssessmentQuestion->question;
        $correctAnswers = $question->correct_answer;
        $isCorrect = !array_diff($validated['selected_option'], $correctAnswers);

        // Update the Student's answer
        $practiceAssessmentQuestion->update([
            'student_answer' => $validated['selected_option'],
            'is_correct' => $isCorrect
        ]);

        $cacheKey = 'practice_assessment_' . $practiceAssessmentId . '_shuffled';
        Cache::forget($cacheKey); // Clear the cache to reload fresh data

        return back();

    }

    public function submitAssessment($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::with('questions.question')->findOrFail($practiceAssessmentId);

        // Calculate elapsed time
        $elapsedTime = now()->diffInSeconds($assessment->started_at);
        $timeLimit = strtotime($assessment->time_limit) - strtotime('TODAY');

        //Update assessment status based on time limit
        $assessment->update([
            'status' => ($elapsedTime > $timeLimit) ? 'timed_out' : 'completed',
            'submitted_at' => now()
        ]);

        //Mastery Thresholds
        $masteryThresholds = [
            'remembering' => [3, 5],
            'understanding' => [3, 5],
            'applying' => [2, 3],
            'analyzing' => [3, 4],
            'evaluating' => [4, 5],
            'creating' => [4, 5],
        ];

        //Process the question_usage of the questions on the assessment
        foreach($assessment->questions as $assessmentQuestion){
            $question = $assessmentQuestion->question;

            //Checker if the student answered the question correctly
            $isCorrect = $assessmentQuestion->is_correct;

            //Update the StudentQuestionUsage
            $studentUsage = StudentQuestionUsage::firstOrNew([
                'student_id' => $assessment->student_id, 
                'question_id' => $assessmentQuestion->question_id
            ]);

            //Attempt counts
            $studentUsage->correct_attempts = ($studentUsage->correct_attempts ?? 0) + ($isCorrect ? 1 : 0);
            $studentUsage->wrong_attempts = ($studentUsage->wrong_attempts ?? 0) + (!$isCorrect ? 1 : 0);

            //Update selection probability
            if($isCorrect){
                $studentUsage->selection_percentage = max(5, ($studentUsage->selection_percentage ?? 100) * 0.8);
            }

            //Store recent attempts
            $recentAttempts = json_decode($studentUsage->recent_attempts ?? '[]', true);
            array_push($recentAttempts, $isCorrect);
            if(count($recentAttempts) > 7){
                array_shift($recentAttempts);
            }
            $studentUsage->recent_attempts = json_encode($recentAttempts);

            //Determine the mastery
            $difficulty = $question->difficulty;
            $threshold = $masteryThresholds[$difficulty] ?? [3, 5];

            $isMastered = $studentUsage->correct_attempts >= $threshold[0];

            //Check declining errors for mastery
            if($isMastered && $studentUsage->wrong_attempts >= 5){
                if($this->hasDecliningErrors($recentAttempts)){
                    $isMastered = true;
                }
            }

            //update mastery status
            $studentUsage->is_mastered = $isMastered;
            $studentUsage->save();
        }

        // Grade the assessment (regardless of whether time expired or student submitted manually)
        $this->gradeAssessment( $practiceAssessmentId);

        // Return the Inertia component with the assessment report
        return to_route('practice-assessment.view-result', $assessment->id);
    }

    private function hasDecliningErrors($recentAttempts)
    {
        $errors = array_map(fn($v) => !$v, $recentAttempts); // Convert correct (true) to false and vice versa
        $sortedErrors = $errors;
        sort($sortedErrors);
    
        return count($errors) >= 5 && array_reverse($errors) === $sortedErrors;
    }
    

    public function gradeAssessment($practiceAssessmentId)
    {
        $assessment = StudentPracticeAssessment::findOrFail($practiceAssessmentId);
        $questions = $assessment->questions()->with('question')->get();
    
        // Initialize grading variables
        $correctAnswers = 0;
        $incorrectAnswers = 0;
        $totalWeightedScore = 0;
        $earnedWeightedScore = 0;
    
        // Group questions by topic
        $questionsByTopic = $questions->groupBy(fn($q) => $q->question->topic_id);
    
        foreach ($questions as $question) {
            $isCorrect = $question->is_correct;
            $questionWeight = $question->question->weight ?? 1; 
    
            if ($isCorrect) {
                $correctAnswers++;
                $earnedWeightedScore += $questionWeight;
            } else {
                $incorrectAnswers++;
            }
    
            $totalWeightedScore += $questionWeight;
        }
    
        // Calculate final score percentage
        $scorePercentage = ($totalWeightedScore > 0) ? ($earnedWeightedScore / $totalWeightedScore) * 100 : 0;
    
        // Save assessment results
        $assessment->results()->create([
            'student_id' => $assessment->student_id,
            'correct_answers' => $correctAnswers,
            'incorrect_answers' => $incorrectAnswers,
            'score_percentage' => $scorePercentage,
        ]);
    
        // Update topic proficiency
        foreach ($questionsByTopic as $topicId => $topicQuestions) {
            $numerator = [];
            $denominator = [];
    
            foreach ($topicQuestions as $question) {
                $isCorrect = $question->is_correct;
                $questionWeight = $question->question->weight ?? 1;
                $difficultyWeight = $this->getDifficultyWeight($question->question->difficulty);
    
                $score = $isCorrect ? 1 : 0;
    
                $numerator[] = $score * $difficultyWeight * $questionWeight;
                $denominator[] = $difficultyWeight * $questionWeight;
            }
    
            $this->updateTopicProficiency($assessment->student_id, $topicId, $numerator, $denominator, $assessment->id);
        }
    
        return $assessment;
    }
    


    /**
     * Get Difficulty Weight for a Question
     */
    private function getDifficultyWeight($difficulty)
    {
        return match ($difficulty) {
            'remembering' => 0.5,
            'understanding' => 0.6,
            'applying' => 0.7,
            'analyzing' => 0.8,
            'evaluating' => 0.9,
            'create' => 1.8,
            default => 1.0
        };
    }

    private function determineProficiencyLevel($percentage)
    {
        return match (true){
            $percentage >= 80 => 'advanced',
            $percentage >= 60 => 'intermediate',
            default => 'beginner',
        };
    }


    /**
     * Update Topic Proficiency
     */
    private function updateTopicProficiency($studentId, $topicId, $numerator, $denominator, $assessmentId)
    {
        $totalNumerator = array_sum($numerator);
        $totalDenominator = array_sum($denominator);

        $topicMastery = ($totalDenominator > 0) ? ($totalNumerator / $totalDenominator) * 100 : 0;

        StudentTopicScore::create([
            'user_id' => $studentId,
            'topic_id' => $topicId,
            'score' => $topicMastery
        ]);
    
        // Fetch student's proficiency record for the topic
        $proficiency = StudentTopicProficiency::firstOrNew(
            [
                'student_id' => $studentId,
                'topic_id' => $topicId,
            ],
            [
                'proficiency_level' => 'beginner', // Default level
                'grade' => 0.00,
                'average_score' => 0.00,
                'attempts' => 0,
            ]
        );

        $proficiency->attempts += 1;

        // Update running average
        $proficiency->average_score = (($proficiency->average_score * ($proficiency->attempts - 1)) + $topicMastery) / $proficiency->attempts;
        $proficiency->grade = $topicMastery;

        // Get recent 3 attempts for the topic
        $recentScores = StudentTopicScore::where('user_id', $studentId)
        ->where('topic_id', $topicId)
        ->orderByDesc('created_at')
        ->take(3)
        ->pluck('score');

        if ($recentScores->count() >= 3) {
            $min = $recentScores->min();
            $max = $recentScores->max();
    
            if ($min >= 80 && ($max - $min) <= 5) {
                $proficiency->proficiency_level = 'advanced';
            } elseif ($min >= 60 && ($max - $min) <= 10) {
                $proficiency->proficiency_level = 'intermediate';
            } else {
                $proficiency->proficiency_level = 'beginner';
            }
        }

        // Assign proficiency category based on current topicMastery
        $proficiency->proficiency_category = match (true) {
            $topicMastery >= 90 => $proficiency->proficiency_level . '-high',
            $topicMastery >= 80 => $proficiency->proficiency_level . '-low',
            $topicMastery >= 70 => $proficiency->proficiency_level . '-high',
            $topicMastery >= 60 => $proficiency->proficiency_level . '-low',
            default => 'beginner',
        };

        $proficiency->save();
    
        StudentAssessmentTopicProficiencies::create([
            'assessment_id' => $assessmentId,
            'student_id' => $studentId,
            'topic_id' => $topicId,
            'previous_grade' => $proficiency->grade, // old
            'previous_level' => $proficiency->proficiency_level, // old
            'grade' => $topicMastery, // new
            'current_level' => $proficiency->proficiency_level, // new
        ]);
    
    }
    

    public function viewAssessmentReport($practiceAssessmentId){
        $assessment = StudentPracticeAssessment::with('results', 'questions.question')
        ->findOrFail($practiceAssessmentId);

        //Get historical topic proficiency for the assessment
        $topicProficiencies = StudentAssessmentTopicProficiencies::where('assessment_id', $practiceAssessmentId)
        ->with('topic')
        ->get();

        return inertia('PracticeAssessment/PracticeReport', [
            'assessment' => $assessment,
            'result' => $assessment->results,
            'questions' => $assessment->questions->map(function ($question){
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
            'topicProficiencies' => $topicProficiencies->map(function ($proficiency){
                return [
                    'topic_name' => $proficiency->topic->name,
                    'previous_grade' => $proficiency->previous_grade,
                    'previous_level' => $proficiency->previous_level,
                    'grade' => $proficiency->grade,
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

}
