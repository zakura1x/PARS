<?php

namespace App\Http\Controllers\PracticeAssessment;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentPracticeAssessmentQuestion;
use App\Models\StudentTopicProficiency;
use App\Models\Subject;
use App\Models\Topics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GeneratePracticeAssessmentController extends Controller
{
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
        ->latest()
        ->get();

        // Return the inertia view with subjects
        return inertia('PracticeAssessment/PracticeGeneratorForm', [
            'subjects' => $subjects,
            'topics' => $topics,
            'search' => $search,
            'subjectId' => $subjectId,
            'config' => config('assessment.assessment'), // Pass the entire config
        ]);
    }

    public function getRecommendedTopics(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id'
        ]);

        $studentId = Auth::id();
        $subjectId = $request->subject_id;

        $topics = Topics::where('subject_id', $subjectId)
            ->with(['proficiency' => function($query) use ($studentId) {
                $query->where('student_id', $studentId);
            }])
            ->get();

        $scoredTopics = $topics->map(function($topic) {
            $proficiency = $topic->proficiency;
            $score = $proficiency ? (100 - $proficiency->grade) : 80;
            
            return [
                'id' => $topic->id,
                'name' => $topic->name,
                'score' => $score,
                'grade' => $proficiency->grade ?? null,
                'proficiency_level' => $proficiency->proficiency_level ?? 'beginner'
            ];
        });

        $recommendedTopics = $scoredTopics->sortByDesc('score')->take(5)->values();

        return response()->json([
            'recommendedTopics' => $recommendedTopics
        ]);
    }

    // Store the assessment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'topics' => 'required|array',
            'topics.*' => 'exists:topics,id',
            'total_items' => 'required|integer|min:'.config('assessment.assessment.min_items').'|max:'.config('assessment.assessment.max_items'),
            'time_limit' => 'required|integer|min:'.config('assessment.assessment.min_time').'|max:'.config('assessment.assessment.max_time'),
        ]);

        $studentId = Auth::id();
        $subjectId = $validated['subject_id'];
        $topics = $validated['topics'];
        $totalItems = $validated['total_items'];

        // Convert time limit to HH:MM:SS format
        $timeLimitFormatted = sprintf(
            '%02d:%02d:00',
            floor($validated['time_limit'] / 60),
            $validated['time_limit'] % 60
        );

        // Check if questions exist for selected topics
        foreach ($topics as $topicId) {
            if (!Question::where('topic_id', $topicId)->exists()) {
                return back()->withErrors([
                    'topics' => "No questions available for topic ID: $topicId"
                ]);
            }
        }

        // Generate proficiency-based questions
        $questions = $this->generateProficiencyQuestions($studentId, $topics, $totalItems);

        if ($questions->isEmpty()) {
            return back()->withErrors([
                'topics' => 'No questions available for the selected topics'
            ]);
        }

        // Create assessment
        $assessment = StudentPracticeAssessment::create([
            'student_id' => $studentId,
            'subject_id' => $subjectId,
            'total_items' => count($questions),
            'type' => 'proficiency',
            'time_limit' => $timeLimitFormatted,
        ]);

        // Attach questions
        foreach ($questions as $question) {
            StudentPracticeAssessmentQuestion::create([
                'practice_assessment_id' => $assessment->id,
                'question_id' => $question->id,
            ]);
        }

        return redirect()->route('practice-assessment.start', $assessment->id);
    }

    // Generate proficiency-based questions
    private function generateProficiencyQuestions($studentId, $topicIds, $totalItems)
    {
        $questionsPerTopic = ceil($totalItems / count($topicIds));
        $questions = collect();

        foreach ($topicIds as $topicId) {
            $proficiency = StudentTopicProficiency::where('student_id', $studentId)
                ->where('topic_id', $topicId)
                ->first();

            $level = $proficiency->proficiency_level ?? 'beginner';
            
            // Adjust question difficulty based on proficiency
            $difficultyWeights = $this->getDifficultyWeights($level);
            $topicQuestions = $this->selectQuestionsByDifficulty($topicId, $difficultyWeights, $questionsPerTopic);
            
            $questions = $questions->merge($topicQuestions);
        }

        return $questions->shuffle()->take($totalItems);
    }

    // Helper methods
    private function calculateRecommendedItems($topics)
    {
        $baseItems = config('assessment.assessment.base_items_per_topic');
        $total = $topics->sum(function($topic) use ($baseItems) {
            $multiplier = config("assessment.assessment.proficiency_multipliers.{$topic['proficiency_level']}.items", 1.0);
            return $baseItems * $multiplier;
        });
        
        return min(max(round($total), config('assessment.assessment.min_items')), config('assessment.assessment.max_items'));
    }
    private function calculateRecommendedTime($topics)
    {
        $baseTime = config('assessment.assessment.base_minutes_per_item');
        $total = $topics->sum(function($topic) use ($baseTime) {
            $multiplier = config("assessment.assessment.proficiency_multipliers.{$topic['proficiency_level']}.time", 1.0);
            return $baseTime * $multiplier;
        });
        
        $totalTime = $total * $this->calculateRecommendedItems($topics);
        return min(max(round($totalTime), config('assessment.assessment.min_time')), config('assessment.assessment.max_time'));
    }

    private function getDifficultyWeights($proficiencyLevel)
    {
        return match($proficiencyLevel) {
            'beginner' => ['Remembering' => 0.6, 'Understanding' => 0.4],
            'intermediate' => ['Applying' => 0.5, 'Analyzing' => 0.5],
            'advanced' => ['Evaluating' => 0.4, 'Creating' => 0.6],
            default => ['Remembering' => 0.4, 'Understanding' => 0.3, 'Applying' => 0.3]
        };
    }

    private function selectQuestionsByDifficulty($topicId, $difficultyWeights, $count)
    {
        $questions = collect();
        $remaining = $count;
        
        foreach ($difficultyWeights as $difficulty => $weight) {
            $needed = min(ceil($count * $weight), $remaining);
            
            if ($needed > 0) {
                $found = Question::where('topic_id', $topicId)
                    ->where('difficulty', $difficulty)
                    ->inRandomOrder()
                    ->limit($needed)
                    ->get();
                
                $questions = $questions->merge($found);
                $remaining -= $found->count();
            }
        }
        
        // If we didn't get enough, fill with random questions
        if ($remaining > 0) {
            $extra = Question::where('topic_id', $topicId)
                ->whereNotIn('id', $questions->pluck('id'))
                ->inRandomOrder()
                ->limit($remaining)
                ->get();
                
            $questions = $questions->merge($extra);
        }
        
        return $questions;
    }
}
