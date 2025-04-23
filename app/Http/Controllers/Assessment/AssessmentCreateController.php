<?php

namespace App\Http\Controllers\Assessment;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Question;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssessmentCreateController extends Controller
{
    /**
     * 
     */
    public function index()
    {
        //
    }

    /**
     * Form for creating a new Assessment
     */
    public function create()
    {
        $user = auth()->user();
        $subjects = [];

        if ($user->professor) {
            $subjects = $user->load('professor.subjects')->professor->subjects;
        } else if ($user->hasAnyRole(['program_head', 'admin'])) {
            $subjects = Subject::all();
        }

        if (empty($subjects)) {
            return redirect()->back()->with([
                'message' => 'You do not have permission to create assessments',
                'type' => 'error'
            ]);
        }

        return inertia('Assessment/AssessmentGeneratorForm', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer|min:1'
        ]);

        $questions = $this->generateExamQuestions($validatedData['subject_id']);

        if($questions->isEmpty()){
            return back()->with(['message'=> 'No questions available for the selected subject.']);
        }

        //Create the assessment Record
        $assessment = Assessment::create([
            'created_by' => auth()->user()->id,
            'subject_id' => $validatedData['subject_id'],
            'title' => $validatedData['title'],
            'description' => $validatedData['description'] ?? null,
            'status' => 'draft',
            'time_limit' => $validatedData['time_limit'] ?? null
        ]);

        //Attach the questions to the assessment
        $assessment->questions()->attach($questions->pluck('id')->toArray());

        return to_route('assessment-edit.form', $assessment->id);
    }

    private function generateExamQuestions($subjectId)
    {
        DB::beginTransaction();
    
        try {
            $questions = collect();
            $selectedQuestionIds = [];
    
            $tableOfSpecification = TableOfSpecification::where('subject_id', $subjectId)->get();
    
            if ($tableOfSpecification->isEmpty()) {
                throw new \Exception("No Table of Specification found for the selected subject.");
            }
    
            foreach ($tableOfSpecification as $tos) {
                $topicId = $tos->topic_id;
                $difficultyDistribution = $tos->difficulty;
                $totalQuestionsForTopic = $tos->num_questions;
    
                foreach ($difficultyDistribution as $difficultyLevel => $count) {
                    if ($count <= 0) {
                        continue;
                    }
    
                    $questionsForDifficulty = Question::where('topic_id', $topicId)
                        ->where('purpose_type', 'examination')
                        ->where('difficulty', $difficultyLevel)
                        ->where('is_used', false)
                        ->whereNotIn('id', $selectedQuestionIds)
                        ->inRandomOrder()
                        ->take($count)
                        ->get();
    
                    if ($questionsForDifficulty->count() < $count) {
                        throw new \Exception("Insufficient questions available for topic ID: {$topicId} and difficulty: {$difficultyLevel}.");
                    }
    
                    foreach ($questionsForDifficulty as $question) {
                        $question->update(['is_used' => true, 'updated_at' => now()]);
                        $selectedQuestionIds[] = $question->id;
                    }
    
                    $questions = $questions->merge($questionsForDifficulty);
                }
            }

            dd("Found {$questionsForDifficulty->count()} of {$count} for topic {$topicId} difficulty {$difficultyLevel}");

    
            DB::commit();

            return $questions;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Edit the Assessment
     * 
     */
    public function edit($assessmentId)
    {
        $assessment = Assessment::with('questions.topic')->findOrFail($assessmentId);

        if($assessment->status !== 'draft' && $assessment->status !== 'rejected'){
            return back()->withErrors(['message' => 'Assessment cannot be edited anymore']);
        }

        //dd($assessment->questions->toArray());

        // Get all the questions related to the assessment
        //$questions = $assessment->questions;

        //dd($assessment->questions);

        return inertia('Assessment/AssessmentEditForm', [
            'assessment' => $assessment,
            'questions' => $assessment->questions
        ]);
    }


    /**
     * Preview of the Assessment
     * @param int $assessmentId
     * Note: No front-end integration yet
     */
    public function preview($assessmentId)
    {
        $assessment = Assessment::with('questions.topic')->findOrFail($assessmentId);

        return inertia('Assessment/AssessmentPreview',[
            'assessment' => $assessment,
            'questions' => $assessment->questions,
        ]);
    }

    /**
     * Replace a question in the assessment
     */
    public function replaceQuestion($questionId, $assessmentId)
    {
        DB::beginTransaction();

        // Find the old question
        $oldQuestion = Question::findOrFail($questionId);

        // Check if the question is part of the assessment
        if (!$oldQuestion->assessments()->where('assessment_id', $assessmentId)->exists()) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Question is not part of this assessment']);
        }

        // Mark the old question as unused
        $oldQuestion->update(['is_used' => false]);

        // Find a replacement question
        $replacement = Question::where('topic_id', $oldQuestion->topic_id)
            ->where('difficulty', $oldQuestion->difficulty)
            ->where('purpose_type', 'examination')
            ->where('is_used', false)
            ->inRandomOrder()
            ->first();

        // If no replacement is found, revert the old question's status and return an error
        if (!$replacement) {
            $oldQuestion->update(['is_used' => true]);
            DB::rollBack();
            return back()->withErrors(['message' => 'No replacement found']);
        }

        // Mark the replacement question as used
        $replacement->update(['is_used' => true]);

        // Update the pivot table
        $oldQuestion->assessments()->updateExistingPivot($assessmentId, [
            'question_id' => $replacement->id,
            'updated_at' => now(),
        ]);

        DB::commit();

        return back()->with([
            'message' => 'Question replaced successfully.',
            'replacement' => $replacement,
        ]);
    }

    /**
     * Delete the Assessment
     */
    public function deleteAssessment($assessmentId)
    {
        DB::beginTransaction();
        try{
            //Find the assessment
            $assessment= Assessment::findOrFail($assessmentId);

            //Check if the assessment is in draft
            if($assessment->status !== 'draft'){
                return back()->with([
                    'message' => 'Assessment cannot be deleted',
                    'type' => 'error'
                ]);
            }

            //Get the questions
            $questions = $assessment->questions()->get();

            //Detach the questions from the assessment
            $assessment->questions()->detach();

            //Update the is_used status of all questions
            foreach($questions as $question){
                $question->update(['is_used' => false]);
            }

            //Soft-delete the assessment
            $assessment->delete();

            DB::commit();

            return back()->with([
                'message' => 'Assessment deleted successfully'
            ]);
            
        }catch(\Exception $e){
            DB::rollBack();
            return back()->with([
                'message' => 'Error deleting assessment'
            ]);
        }
    }

    /**
     * Fork the deleted assessment
     * Note: needs a return route
     */
    public function forkAssessment($assessmentId)
    {
        DB::beginTransaction();
        try{

            $originalAssessment = Assessment::withTrashed()->findOrFail($assessmentId);

            //Check if the assessment is deleted
            if(!$originalAssessment->trashed()){
                return back()->with([
                    'message' => 'Only deleted assessments can be forked'
                ]);
            }

            //Check if the assessment was already forked
            if($originalAssessment->is_forked){
                return back()->with([
                    'message' => 'This assessment was already forked'
                ]);
            }

            //Create a new assessment
            $newAssessment = Assessment::create([
                'created_by' => auth()->user()->id,
                'subject_id' => $originalAssessment->subject_id,
                'title' => $originalAssessment->title,
                'description' => $originalAssessment->description,
                'status' => 'draft',
                'time_limit' => $originalAssessment->time_limit,
            ]);

            //Attach the questions to the new assessment
            $newAssessment->questions()->attach($originalAssessment->questions()->pluck('id'));
            //Update the is_used status of all questions
            foreach($newAssessment->questions as $question){
                $question->update(['is_used' => true]);
            }

            //Mark the original assessment as forked
            $originalAssessment->update(['is_forked' => true]);

            DB::commit();

            //return 


            
        }catch(\Exception $e){
            DB::rollBack();
            return back()->with([
                'message' => 'Error forking the assessment'
            ]);
        }

        
    }


}
