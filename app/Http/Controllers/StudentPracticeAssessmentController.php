<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentPracticeAssessmentRequest;
use App\Http\Requests\UpdateStudentPracticeAssessmentRequest;
use App\Models\StudentPracticeAssessment;
use Illuminate\Support\Facades\Auth;

class StudentPracticeAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Get the authenticated user's ID
        $userId = Auth::id();
        $assessments = StudentPracticeAssessment::where('student_id', $userId);

        return inertia('PracticeAssessment/PracticeIndex', ['assessments' => $assessments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentPracticeAssessmentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentPracticeAssessment $studentPracticeAssessment)
    {
        //
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
