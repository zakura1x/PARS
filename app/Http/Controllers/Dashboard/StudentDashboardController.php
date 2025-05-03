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
        // Get average score across all assessments
        $examScores = StudentAssessment::where('user_id', $student->id)
            ->whereNotNull('score')
            ->pluck('score')
            ->toArray();
            
        $practiceScores = StudentPracticeAssessment::whereHas('results')
            ->where('student_id', $student->id)
            ->with('results')
            ->get()
            ->pluck('results.score')
            ->toArray();
            
        $allScores = array_merge($examScores, $practiceScores);
        
        $averageScore = count($allScores) > 0 ? array_sum($allScores) / count($allScores) : 0;
        
        // Get proficiency distribution
        $proficiencyDistribution = StudentTopicProficiency::where('student_id', $student->id)
            ->selectRaw('proficiency_level, COUNT(*) as count')
            ->groupBy('proficiency_level')
            ->get()
            ->pluck('count', 'proficiency_level');
            
        // Get assessment completion rate
        $totalAssessments = $student->assessments()->count();
        $completedAssessments = $student->studentAssessments()
            ->whereNotNull('completed_at')
            ->count();
            
        $completionRate = $totalAssessments > 0 
            ? ($completedAssessments / $totalAssessments) * 100 
            : 0;
        
        return [
            'average_score' => round($averageScore, 2),
            'proficiency_distribution' => $proficiencyDistribution,
            'assessment_completion_rate' => round($completionRate, 2),
            'total_assessments_taken' => $completedAssessments,
        ];
    }
}