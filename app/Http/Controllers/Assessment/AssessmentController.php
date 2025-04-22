<?php

namespace App\Http\Controllers\Assessment;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    /**
     * Display the listing of the resource
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user->hasAnyRole([User::ROLE_PROGRAM_HEAD, User::ROLE_PROFESSOR])) {
            return Inertia::render('Error/Unauthorized', [
                'message' => 'You are not authorized to view assessments'
            ])->toResponse(request())->setStatusCode(403);
        }

        if ($user->hasAnyRole(User::ROLE_PROGRAM_HEAD)) {
            $assessments = Assessment::where(function($query) use ($user) {
                $query->where('status', '!=', 'draft')
                      ->orWhere('created_by', $user->id);
            })
            ->with(['creator', 'subject'])
            ->latest()
            ->paginate(10);
        } 
        else {
            $professorSubjects = $user->professor->subjects->pluck('id');
            $assessments = Assessment::whereIn('subject_id', $professorSubjects)
                ->with(['creator', 'subject'])
                ->latest()
                ->paginate(10);
        }

        return Inertia::render('Assessment/Index', [
            'assessments' => $assessments,
            'filters' => request()->all(['search', 'status']),
        ]);
    }

    /**
     * View Assessment
     */
    public function viewAssessment($assessmentId)
    {
        //if the assessment status is rejected, show the assessment with questions and comment
            
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
