<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Assessment;
use App\Models\StudentPracticeAssessment;
use App\Models\TopicGradingCriteria;
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller{

    public function index(){
        // $studentId = Auth::id();

        // // Get the 5 latest assessments
        // $latestAssessments = Assessment::orderBy('created_at', 'desc')->take(value: 5)->get();

        // // Get the 5 latest practice assessments with their results
        // $latestPracticeAssessments = StudentPracticeAssessment::where('student_id', $studentId)
        //     ->with('results')
        //     ->orderBy('created_at', 'desc')
        //     ->take(5)
        //     ->get();

        // // Get all topic grading criteria ordered by grade
        // $topicGradingCriteria = TopicGradingCriteria::orderBy('percentage', 'desc')->get();

        // // Calculate the overall grade based on topic grading criteria
        // $overallGrade = $this->calculateOverallGrade($topicGradingCriteria);

        return Inertia::render('Dashboard/StudentDashboard', [
            // 'latestAssessments' => $latestAssessments,
            // 'latestPracticeAssessments' => $latestPracticeAssessments,
            // 'topicGradingCriteria' => $topicGradingCriteria,
            // 'overallGrade' => $overallGrade,
        ]);
    }

    private function calculateOverallGrade($topicGradingCriteria) {
        $totalPercentage = 0;
        $totalWeight = 0;

        foreach ($topicGradingCriteria as $criteria) {
            $totalPercentage += $criteria->percentage;
            $totalWeight += 1;
        }

        return $totalWeight > 0 ? $totalPercentage / $totalWeight : 0;
    }

}