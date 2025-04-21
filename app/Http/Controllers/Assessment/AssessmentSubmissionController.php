<?php

namespace App\Http\Controllers\Assessment;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AssessmentSubmissionController extends Controller
{
    /**
     * Button process
     * Submission of the assessment
     */
    public function submitForApproval($assessmentId)
    {
        //Find the assessment
        $assessment = Assessment::findOrFail($assessmentId);
        
        // Check if the assessment has already been approved
        if ($assessment->approved) {
            return back()->withErrors(['message' => 'This assessment has already been approved.']);
        }

        // Update the status to 'pending' and set the updated_at timestamp
        $assessment->update([
            'status' => 'pending',
            'updated_at' => now(),
        ]);

        return back()->with([
            'message' => 'Assessment status updated to pending.',
        ]);
    }

    /**
     * Approval Form
     */
    public function assessmentApprovalForm($assessmentId)
    {
        $assessment = Assessment::with('questions')->findOrFail($assessmentId);

        // Check if the assessment is already approved
        if ($assessment->approved) {
            return back()->withErrors(['message' => 'This assessment has already been approved.']);
        }else if($assessment->status === 'draft'){
            return back()->withErrors(['message'=> 'Submit the assessment for approval first']);
        }

        $assessment->questions->map(function ($question) {
            // Decode correct_answer if it's JSON string
            $correctAnswers = is_string($question->correct_answer)
            ? json_decode($question->correct_answer, true)
            : $question->correct_answer;

            // Ensure correct_answer is an array
            $correctAnswers = is_array($correctAnswers) ? $correctAnswers : [];

            $question->correct_answer_text = collect($question->options)->filter(function ($option) use ($correctAnswers) {
                return in_array($option, $correctAnswers);
            });

            return $question;
        });

        // Show the approval form if the assessment is not approved yet
        return inertia('Assessment/AssessmentApprovalForm', [
            'assessment' => $assessment,
        ]);
    }

    /**
     * Approval of the assessment
     * Button Approve
     */
    public function approveAssessment(Request $request, $assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        //Only program head can approve or disapprove
        if(Auth::user()->role !== 'program_head'){
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        //Check if the assessment is already approved
        if($assessment->approved){
            return back()->withErrors(['message' => 'Assessment is not yet ready for approval']);
        }elseif($assessment->status !== 'pending'){
            return back()->withErrors(['message' => 'Assessment is not yet ready for approval']);
        }

        //Approve the assessment
        $assessment->update([
            'approved' => true,
            'approved_by' => Auth::user()->id,
            'status' => 'active'
        ]);

        return to_route('assessment-PH.index')->with(['message' => 'Assessment approved successfully']);
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function rejectAssessment(Request $request, $assessmentId){
        $assessment = Assessment::findOrFail($assessmentId);

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:255'
        ]);

        if(Auth::user()->role !== 'program_head'){
            return back()->with(['message' => 'Unauthorized']);
        }

        //Check if the assessment is already approved
        if($assessment->approved){
            return back()->withErrors(['message' => 'Assessment is not yet ready for rejection']);
        }

        $assessment->update([
            'status' => 'rejected',
            'approved' => false,
            'approved_by' => Auth::user()->id,
            'rejection_reason' => $validated['rejection_reason']
        ]);

        return to_route('assessment-PH.index')->with(['message' => 'Assessment was successfully rejected']);
    }

    /**
     * Replace the specific question on the assessment by the program head
     */
    public function replaceQuestionByProgramHead($questionId, $assessmentId)
    {
        if (Auth::user()->role !== 'program_head') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();

        try {
            $oldQuestion = Question::findOrFail($questionId);
            $oldQuestion->update(['is_used' => false]);

            $replacement = Question::where('topic_id', $oldQuestion->topic_id)
                ->where('difficulty', $oldQuestion->difficulty)
                ->where('purpose_type', 'examination')
                ->where('is_used', false)
                ->inRandomOrder()
                ->first();

            if (!$replacement) {
                $oldQuestion->update(['is_used' => true]);
                return back()->withErrors(['message' => 'No replacement found']);
            }

            $replacement->update(['is_used' => true]);

            // Instead of detaching, update the existing record
            DB::table('assessment_question')
                ->where('assessment_id', $assessmentId)
                ->where('question_id', $questionId)
                ->update([
                    'question_id' => $replacement->id,
                    'replaced_question_id' => $questionId,
                    'replaced_by_program_head' => true,
                    'updated_at' => now()
                ]);

            DB::commit();
            return back()->with(['message' => 'Question replaced successfully.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'An error occurred while replacing the question.']);
        }
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
