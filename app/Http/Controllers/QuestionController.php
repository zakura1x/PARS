<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $questions = Question::all();

        // return inertia('QuestionBank/QuestionIndex', ['questions' => $questions] );

        $query = Question::query();

        //Filters
        if ($request->has('searchQuery') && $request->searchQuery) {
            $query->where('question_text', 'like', '%' . $request->searchQuery . '%');
        }

        if($request->has('category') && $request->category){
            $query->where('purpose_type', $request->category);
        }

        if($request->has('status') && $request->status){
            $query->where('status', $request->status);
        }

        $question = $query->paginate(10);

        return inertia('QuestionBank/QuestionIndex', ['questions' => $question]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'subject_id' => 'required|exists:subjects,subject_id',
            'topic_id' => 'required|exists:topics,topic_id',
            'type' => 'required|string|max'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }
}
