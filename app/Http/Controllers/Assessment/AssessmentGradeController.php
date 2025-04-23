<?php

namespace App\Http\Controllers\Assessment;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\StudentTopicProficiency;
use App\Models\StudentTopicScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssessmentGradeController extends Controller
{
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

        $topicMastery = ($totalDenominator > 0) ? ($totalNumerator / $totalDenominator) * 100 : 0;


        //save current score attempt to tracking table
        StudentTopicScore::create([
            'student_id' => $studentId,
            'topic_id' => $topicId,
            'score' => $topicMastery,
        ]);

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
        $proficiency->attempts += 1;
        $proficiency->average_score = (($proficiency->average_score * ($proficiency->attempts - 1)) + $topicMastery) / $proficiency->attempts;
        $proficiency->grade = $topicMastery;

        // Fetch last 3 topic scores for consistency check
        $recentScores = StudentTopicScore::where('student_id', $studentId)
        ->where('topic_id', $topicId)
        ->latest()
        ->take(3)
        ->pluck('score');

        // Determine level based on consistency
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

        // Assign proficiency category based on score band
        $proficiency->proficiency_category = match (true) {
            $topicMastery >= 90 => $proficiency->proficiency_level . '-high',
            $topicMastery >= 80 => $proficiency->proficiency_level . '-low',
            $topicMastery >= 70 => $proficiency->proficiency_level . '-high',
            $topicMastery >= 60 => $proficiency->proficiency_level . '-low',
            default => 'beginner',
        };

        $proficiency->save();
    }
}
