<?php

namespace App\Jobs;

use App\Models\StudentAssessmentTopicProficiencies;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentTopicProficiency;
use App\Models\StudentTopicScore;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AutoSubmitPracticeAssessment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $assessments = StudentPracticeAssessment::where('status', 'on_going')
            ->with('questions') // Eager load if needed
            ->get();

        foreach ($assessments as $assessment) {
            $timeLimitInSeconds = $assessment->time_limit;
            $elapsedSeconds = now()->diffInSeconds($assessment->started_at);
            
            if ($elapsedSeconds >= $timeLimitInSeconds) {
                $this->submitAssessment($assessment->id);
            }
        }
    }

    protected function submitAssessment($assessmentId)
    {
        $assessment = StudentPracticeAssessment::findOrFail($assessmentId);
        
        // Only submit if still ongoing
        if ($assessment->status !== 'on_going') {
            return;
        }

        $assessment->update([
            'status' => 'timed_out',
            'submitted_at' => now(),
        ]);
        
        // Call grading logic
        $this->gradeAssessment($assessmentId);
    }

    protected function gradeAssessment($practiceAssessmentId)
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
    private function getDifficultyWeight($bloomLevel)
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
            'student_id' => $studentId,
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
        $recentScores = StudentTopicScore::where('student_id', $studentId)
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
}