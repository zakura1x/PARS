<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\StudentAssessment;
use App\Models\StudentPracticeAssessment;
use App\Models\StudentTopicProficiency;
use App\Models\Subject; // Add this import
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller
{
    /**
     * Display the student dashboard
     */
    public function index(Request $request)
    {
        $student = Auth::user();
        
        // Get all subjects for the dropdown
        $subjects = Subject::all();
        $selectedSubject = $request->input('subject');
        
        // Get recent assessments
        $recentAssessments = $this->getRecentAssessments($student);
        
        // Get student proficiency data
        $proficiencyData = $this->getProficiencyData($student, $selectedSubject);
        
        // Get performance metrics
        $performanceMetrics = $this->getPerformanceMetrics($student);

        dd($performanceMetrics);
        
        return inertia('Dashboard/StudentDashboard', [
            'student' => $student,
            'recentAssessments' => $recentAssessments,
            'proficiencyData' => $proficiencyData,
            'performanceMetrics' => $performanceMetrics,
            'subjects' => $subjects,
            'selectedSubject' => $selectedSubject,
        ]);
    }
    
    /**
     * Get recent assessments (both practice and examination)
     */
    protected function getRecentAssessments(User $student)
    {
        // Get recent examination assessments (limit to 5 most recent)
        $examinationAssessments = StudentAssessment::with(['assessment', 'result'])
            ->where('user_id', $student->id)
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get recent practice assessments (limit to 5 most recent)
        $practiceAssessments = StudentPracticeAssessment::with(['subject', 'results'])
            ->where('student_id', $student->id)
            ->orderBy('submitted_at', 'desc')
            ->limit(5)
            ->get();
        
        return [
            'examinations' => $examinationAssessments,
            'practices' => $practiceAssessments,
        ];
    }
    
    /**
     * Get student proficiency data for a specific subject
     */
    protected function getProficiencyData(User $student, $subjectId = null)
    {
        $query = StudentTopicProficiency::with(['topic' => function($query) {
                $query->with('subject'); // Eager load the subject relationship
            }])
            ->where('student_id', $student->id);
        
        // Filter by subject if one is selected
        if ($subjectId) {
            $query->whereHas('topic', function($q) use ($subjectId) {
                $q->where('subject_id', $subjectId);
            });
        }
        
        return $query->orderBy('proficiency_level', 'desc')
            ->get();
    }
    
    /**
     * Get performance metrics
     */
    protected function getPerformanceMetrics(User $student)
    {
        // 1. Calculate weighted scores for REGULAR assessments
        $regularAssessments = StudentAssessment::with('result')
        ->where('user_id', $student->id)
        ->whereNotNull('completed_at')
        ->get();

        $regularTotalScore = 0;
        $regularTotalQuestions = 0;

        foreach ($regularAssessments as $assessment) {
            if ($assessment->result) {
                $regularTotalScore += $assessment->result->correct_answers;
                $regularTotalQuestions += $assessment->result->total_questions;
            }
        }

        // 2. Calculate weighted scores for PRACTICE assessments
        $practiceAssessments = StudentPracticeAssessment::with('results')
            ->where('student_id', $student->id)
            ->whereNotNull('submitted_at')
            ->get();

        $practiceTotalScore = 0;
        $practiceTotalQuestions = 0;

        foreach ($practiceAssessments as $assessment) {
            if ($assessment->results) {
                $practiceTotalScore += $assessment->results->correct_answers;
                $practiceTotalQuestions += ($assessment->results->correct_answers + $assessment->results->incorrect_answers);
            }
        }

        // 3. Combine totals
        $combinedTotalScore = $regularTotalScore + $practiceTotalScore;
        $combinedTotalQuestions = $regularTotalQuestions + $practiceTotalQuestions;

        // 4. Calculate true average percentage
        $averageScore = $combinedTotalQuestions > 0 
        ? ($combinedTotalScore / $combinedTotalQuestions) * 100 
        : 0;
        
        // Get proficiency distribution
        $proficiencyDistribution = StudentTopicProficiency::where('student_id', $student->id)
            ->selectRaw('proficiency_level, COUNT(*) as count')
            ->groupBy('proficiency_level')
            ->get()
            ->pluck('count', 'proficiency_level');
            
        // Get assessment completion rate - UPDATED TO USE user_id INSTEAD OF student_id
        //FIXED: Get assessment completion rate
        $totalRegularAssessments = $student->studentAssessments()->count();
        $completedRegularAssessments = $student->studentAssessments()
            ->whereNotNull('completed_at')
            ->count();
            
        $totalPracticeAssessments = StudentPracticeAssessment::where('student_id', $student->id)->count();
        $completedPracticeAssessments = StudentPracticeAssessment::where('student_id', $student->id)
            ->whereNotNull('submitted_at')
            ->count();
            
        $totalAssessments = $totalRegularAssessments + $totalPracticeAssessments;
        $completedAssessments = $completedRegularAssessments + $completedPracticeAssessments;
        
        $completionRate = $totalAssessments > 0 
            ? ($completedAssessments / $totalAssessments) * 100 
            : 0;
        
        return [
            'average_score' => round($averageScore, 2),
            'proficiency_distribution' => $proficiencyDistribution,
            'assessment_completion_rate' => round($completionRate, 2),
            'total_assessments_taken' => $completedAssessments,
            'breakdown' => [
                'regular_completed' => $completedRegularAssessments,
                'practice_completed' => $completedPracticeAssessments,
                'regular_total' => $totalRegularAssessments,
                'practice_total' => $totalPracticeAssessments,
            ]
        ];
    }
}
