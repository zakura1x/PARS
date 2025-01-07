<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentPracticeAssessmentRequest;
use App\Http\Requests\UpdateStudentPracticeAssessmentRequest;
use App\Models\Question;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentPracticeAssessmentQuestion;
use App\Models\StudentQuestionUsage;
use App\Models\StudentTopicProficiency;
use Illuminate\Support\Facades\Auth;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use Illuminate\Http\Request;

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
        ->paginate(10);

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
            'topics' => 'nullable|array',
            'topics.*' => 'exists:topics,id',
            'total_items' => 'required|integer|min:1'
        ]);

        $studentId = Auth::id();
        $type = $validated['type'];
        $subjectId = $validated['subject_id'];
        $topics = $validated['topics'] ?: Subject::find($subjectId)->topics->pluck('id')->toArray();
        $totalItems = $validated['total_items'];

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

            // Step 2: Determine Bloom's levels based on proficiency
            $bloomLevels = match ($proficiency?->proficiency_level) {
                'beginner' => ['Remembering', 'Understanding'],
                'intermediate' => ['Applying', 'Analyzing'],
                'advanced' => ['Evaluating', 'Creating'],
                default => ['Remembering', 'Understanding'], // Default for no proficiency
            };

            // Step 3: Check unused questions
            $topicQuestions = Question::where('topic_id', $topicId)
                ->where('purpose_type', 'practice')
                ->whereIn('difficulty', $bloomLevels)
                ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                    $query->where('student_id', $studentId)
                        ->where('is_used', true);
                })
                ->inRandomOrder()
                ->take($questionsPerTopic)
                ->get();

            // Step 4: If all questions are used, reset usage for this student
            if ($topicQuestions->isEmpty()) {
                StudentQuestionUsage::where('student_id', $studentId)
                    ->whereIn('question_id', Question::where('topic_id', $topicId)->pluck('id'))
                    ->update(['is_used' => false]);

                // Re-fetch questions after reset
                $topicQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'practice')
                    ->whereIn('difficulty', $bloomLevels)
                    ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                        $query->where('student_id', $studentId)
                            ->where('is_used', true);
                    })
                    ->inRandomOrder()
                    ->take($questionsPerTopic)
                    ->get();
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

            foreach ($criteria as $criterion) {
                // Step 2: Calculate the number of questions based on the percentage
                $questionsForCriterion = (int) floor(($criterion->percentage / 100) * $totalItems);

                // Ensure the minimum number of questions is met
                $questionsForCriterion = max($questionsForCriterion, $criterion->min_questions);

                // Map difficulty to Bloom's levels
                $bloomLevels = match ($criterion->difficulty) {
                    'easy' => ['Remembering', 'Understanding'],
                    'medium' => ['Applying', 'Analyzing'],
                    'hard' => ['Evaluating', 'Creating'],
                    default => ['Remembering'], // Fallback for undefined difficulty
                };

                // Step 3: Check unused questions
                $criterionQuestions = Question::where('topic_id', $topicId)
                    ->where('purpose_type', 'practice')
                    ->whereIn('difficulty', $bloomLevels)
                    ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                        $query->where('student_id', $studentId)
                            ->where('is_used', true);
                    })
                    ->inRandomOrder()
                    ->take($questionsForCriterion)
                    ->get();

                // Step 4: If all questions are used, reset usage for this student
                if ($criterionQuestions->isEmpty()) {
                    StudentQuestionUsage::where('student_id', $studentId)
                        ->whereIn('question_id', Question::where('topic_id', $topicId)->pluck('id'))
                        ->update(['is_used' => false]);

                    // Re-fetch questions after reset
                    $criterionQuestions = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'practice')
                        ->whereIn('difficulty', $bloomLevels)
                        ->whereDoesntHave('studentQuestionUsages', function ($query) use ($studentId) {
                            $query->where('student_id', $studentId)
                                ->where('is_used', true);
                        })
                        ->inRandomOrder()
                        ->take($questionsForCriterion)
                        ->get();
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
     * Display the specified resource.
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

    /**
     * Test the store method.
     */
    public function testStore()
    {
        $request = new Request([
            'type' => 'proficiency',
            
            'subject_id' => 1,
            'topics' => 1,
            'total_items' => 10
        ]);

        $response = $this->store($request);

        return $response;
    }
}
