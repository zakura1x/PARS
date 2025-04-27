<?php

namespace App\Http\Controllers\Assessment;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AssessmentApprovalController extends Controller
{
    public function replaceQuestionByProgramHead($questionId, $assessmentId)
    {
        if (Auth::user()->role !== 'program_head') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();

        try {
            $oldQuestion = Question::findOrFail($questionId);

            // Get the current pivot record
            $currentPivot = DB::table('assessment_questions')
                ->where('assessment_id', $assessmentId)
                ->where('question_id', $oldQuestion->id)
                ->first();

            if (!$currentPivot) {
                return back()->withErrors(['message' => 'Question is not part of this assessment']);
            }

            // Determine the original question ID (if it exists, keep it; otherwise, use the old question)
            $originalQuestionId = $currentPivot->original_question_id ?? $oldQuestion->id;

            $oldQuestion->update(['is_used' => false]);

            // Find a replacement question
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

            // Detach the old question
            DB::table('assessment_questions')
                ->where('assessment_id', $assessmentId)
                ->where('question_id', $oldQuestion->id)
                ->delete();

            // Attach the new question with tracking fields
            DB::table('assessment_questions')->insert([
                'assessment_id' => $assessmentId,
                'question_id' => $replacement->id,
                'original_question_id' => $originalQuestionId, // Preserve the original
                'replaced_question_id' => $oldQuestion->id, // Track the immediate replaced question
                'replaced_by_program_head' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return back()->with([
                'message' => 'Question replaced successfully.',
                'replacement' => $replacement,
                'old_question' => $oldQuestion,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Replacement failed: ' . $e->getMessage()]);
        }
    }

    public function approveAssessment(Request $request, $assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Only program head can approve
        if (!Auth::user()->hasAnyRole(['program_head'])) {
            return back()->withErrors(['message' => 'You are not authorized to approve this assessment']);
        }

        // Validate assessment status for approval
        if ($assessment->status !== 'pending') {
            $statusMessage = match($assessment->status) {
                'active' => 'Assessment has already been approved and is active',
                'completed' => 'Assessment has already been completed',
                'draft' => 'Assessment is still in draft status',
                default => 'Assessment is not in a state that can be approved'
            };

            return back()->withErrors(['message' => $statusMessage]);
        }

        // Check if already approved (redundant check since we check status above)
        if ($assessment->approved) {
            return back()->withErrors(['message' => 'Assessment has already been approved']);
        }

        DB::beginTransaction();
        try {
            // Approve the assessment
            $assessment->update([
                'approved' => true,
                'approved_by' => Auth::id(),
                'status' => 'active',
                'comment' => $request->comment ?? null  // Store optional approval comments
            ]);

            DB::commit();

            return to_route('assessment-PH.index')
                ->with([
                    'message' => 'Assessment approved successfully',
                    'assessment' => $assessment->fresh()  // Return refreshed data
                ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'message' => 'Failed to approve assessment. Please try again.'
            ]);
        }
    }

    public function rejectAssessment(Request $request, $assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        // Only program head can reject
        if (!Auth::user()->hasAnyRole(['program_head'])) {
            return back()->withErrors(['message' => 'You are not authorized to reject this assessment']);
        }

        // Validate assessment status for rejection
        if ($assessment->status !== 'pending') {
            $statusMessage = match($assessment->status) {
                'active' => 'Assessment has already been approved and is active',
                'completed' => 'Assessment has already been completed',
                'draft' => 'Assessment is still in draft status',
                default => 'Assessment is not in a state that can be rejected'
            };

            return back()->withErrors(['message' => $statusMessage]);
        }

        DB::beginTransaction();
        try {
            // Reject the assessment
            $assessment->update([
                'approved' => false,
                'approved_by' => null,
                'status' => 'rejected',
                'comment' => $request->comment ?? null  // Store optional rejection comments
            ]);

            DB::commit();

            return to_route('assessment-PH.index')
                ->with([
                    'message' => 'Assessment rejected successfully',
                    'assessment' => $assessment->fresh()  // Return refreshed data
                ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'message' => 'Failed to reject assessment. Please try again.'
            ]);
        }
    }
    
}
