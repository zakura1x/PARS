<?php

namespace App\Jobs;

use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentTopicProficiencies;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentTopicProficiency;
use App\Models\StudentTopicScore;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class AutoSubmitAssessment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $assessments = Assessment::where('status', 'on_going')
            ->with('questions') // Eager load if needed
            ->get();

        foreach ($assessments as $assessment) {
            $timeLimitInSeconds = $this->timeToSeconds($assessment->time_limit);
            $elapsedSeconds = now()->diffInSeconds($assessment->started_at);
            
            if ($elapsedSeconds >= $timeLimitInSeconds) {
                // Get all student assessments for this assessment
                $studentAssessments = StudentAssessment::where('assessment_id', $assessment->id)
                    ->where('status', 'on_going')
                    ->get();
                
                foreach ($studentAssessments as $studentAssessment) {
                    $this->submitAssessment($assessment->id, $studentAssessment->user_id);
                }
            }
        }
    }

    protected function timeToSeconds($time)
    {
        $parts = explode(':', $time);
        return ($parts[0] * 3600) + ($parts[1] * 60) + $parts[2];
    }

    protected function submitAssessment($assessmentId, $studentId)
    {
        $assessment = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('user_id', $studentId)
            ->firstOrFail();
        
        // Only submit if still ongoing
        if ($assessment->status !== 'on_going') {
            return;
        }

        $assessment->update([
            'status' => 'timed_out',
            'submitted_at' => now(),
        ]);
        
        // Call grading logic
        $this->gradeAssessment($assessmentId, $studentId);
    }

    public function gradeAssessment($assessmentId, $studentId)
    {
        $assessment = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('user_id', $studentId)
            ->firstOrFail();

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

        DB::transaction(function () use ($assessment, $correctAnswers, $incorrectAnswers, $scorePercentage, $questionsByTopic, $studentId) {
            // Re-fetch assessment inside transaction to prevent race conditions
            $assessment->refresh();

            $assessment->result()->updateOrCreate(
                ['student_assessment_id' => $assessment->id],
                [
                    'total_questions' => $correctAnswers + $incorrectAnswers,
                    'correct_answers' => $correctAnswers,
                    'wrong_answers' => $incorrectAnswers,
                    'score' => $scorePercentage,
                ]
            );

            foreach ($questionsByTopic as $topicId => $topicQuestions) {
                $numerator = [];
                $denominator = [];

                foreach ($topicQuestions as $question) {
                    $isCorrect = $question->is_correct;
                    $questionWeight = $question->question->weight ?? 1;
                    $difficultyWeight = $this->getDifficultyWeight($question->question->bloom_level ?? 'remembering');

                    $score = $isCorrect ? 1 : 0;
                    $attemptWeight = 1;

                    $numerator[] = $attemptWeight * $score * $difficultyWeight * $questionWeight;
                    $denominator[] = $difficultyWeight * $questionWeight;
                }

                $this->updateTopicProficiency($studentId, $topicId, $numerator, $denominator);
            }
        });

        return $assessment;
    }

    protected function getDifficultyWeight($bloomLevel)
    {
        return match ($bloomLevel) {
            'remembering' => 0.5,    // Recall facts
            'understanding' => 0.6, // Explain concepts
            'applying' => 0.7,      // Use information in new situations
            'analyzing' => 0.8,     // Distinguish between parts
            'evaluating' => 0.9,    // Justify decisions
            'create' => 1.8,        // Produce new work (highest cognitive skill)
            default => 1.0          // Fallback
        };
    }

    protected function updateTopicProficiency($studentId, $topicId, $numerator, $denominator)
    {
        $totalNumerator = array_sum($numerator);
        $totalDenominator = array_sum($denominator);

        $topicMastery = ($totalDenominator > 0) ? ($totalNumerator / $totalDenominator) * 100 : 0;

        // Save current score attempt to tracking table
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