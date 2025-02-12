<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Imports\QuestionImport;
use App\Models\Subject;
use App\Models\Topics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;
use Maatwebsite\Excel\Facades\Excel;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = Question::with(['subject', 'topic']);

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

        $questions = $query->latest()->paginate(10);

        return inertia('QuestionBank/QuestionIndex', ['questions' => $questions]);
    }

    /**
     * 
     * Question Form Info requirements
     */
    public function questionFormRequirements(Request $request)
    {
        $request->validate(['subject_id' => 'required|exists:subjects,id']);

        //fetch topics
        $topics = Topics::where('subject_id', $request->subject_id)->get();

        return response()->json([
            'topics' => $topics,
        ]);
    }

    public function questionDetails(Request $request){
        $subjects = Subject::all()->toArray();

        return inertia('QuestionBank/QuestionForm', [
            'initialSubjects' => $subjects,
        ]);
        
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
            'subject_id' => 'required|exists:subjects,id',
            'topic_id' => 'required|exists:topics,id',
            'format_type' => 'required|in:multiple_choice,enumeration,true_or_false,fill_in_the_blank',
            'purpose_type' => 'required|in:practice,assessment,examination',
            'difficulty' => 'required|in:remembering,understanding,applying,`analyzing,evaluating,create',
            'question_text' =>'required|string|max:255',
            'options' => 'required_if:question_type,multiple_choice|array|min:2',
            'options.*' => 'string|max:255',
            'correct_answer' => 'required|array|min:1',
            'correct_answer.*' => 'string|max:255',
            'weight' => 'required|integer|min:1',
            'attachment_path' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        if($request->hasFile('attachment_path')){
            $filePath = $request->file('attachment_path')->store('attachment', 'public');
            $validate['attachment_path'] = $filePath;
        }

        $question = Question::create([
            'user_id' => Auth::id(),
            'subject_id' => $validate['subject_id'],
            'topic_id' => $validate['topic_id'],
            'format_type' => $validate['format_type'],
            'purpose_type' => $validate['purpose_type'],
            'difficulty' => $validate['difficulty'],
            'question_text' => $validate['question_text'],
            'options' => $validate['options'],
            'correct_answer' => $validate['correct_answer'],
            'weight' => $validate['weight'],
            'attachment_path' => $validate['attachment_path'],
        ]);

        return redirect()->route('questionIndex')->with('message', 'Question was Created Successfully');
    }

    public function uploadIndex(){
        return inertia('QuestionBank/QuestionUpload');
    }
    
    public function uploadQuestions(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:2048',
        ]);
    
        try {
            $import = new QuestionImport();
            Excel::import($import, $request->file('file'));
    
            // Store duplicates in session to display in the view
            if (!empty($import->duplicates)) {
                return to_route('questionIndex')->with([
                    'message' => 'Some questions were not imported due to duplication.',
                    'duplicates' => $import->duplicates
                ]);
            }
    
            return to_route('questionIndex')->with(['message' => 'Questions were uploaded successfully.']);
        } catch (\Exception $e) {
            return back()->with(['message' => 'An error occurred while importing questions.']);
        }
    }
    
    

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Fetch the question details for editing.
     */
    public function edit(Request $request, $id)
    {
        $question = Question::with(['subject', 'topic'])->findOrFail($id);
        $subjects = Subject::all();
        $topics = Topics::where('subject_id', $question->subject_id)->get();

        return inertia('QuestionBank/QuestionEdit', [
            'question' => $question,
            'subjects' => $subjects,
            'topics' => $topics,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validate = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'topic_id' => 'required|exists:topics,id',
            'format_type' => 'required|in:multiple_choice,enumeration,true_or_false,fill_in_the_blank',
            'purpose_type' => 'required|in:practice,assessment,examination',
            'difficulty' => 'required|in:remembering,understanding,analyzing,evaluating,create',
            'question_text' =>'required|string|max:255',
            'options' => 'required_if:question_type,multiple_choice|array|min:2',
            'options.*' => 'string|max:255',
            'correct_answer' => 'required|array|min:1',
            'correct_answer.*' => 'string|max:255',
            'weight' => 'required|integer|min:1',
            'attachment_path' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'is_used' => 'nullable|boolean',
        ]);

        $question = Question::findOrFail($id);

        //dd($validate);

        if($request->hasFile('attachment_path')){
            $filePath = $request->file('attachment_path')->store('attachment', 'public');
            $validate['attachment_path'] = $filePath;
        }

        $question->update([
            'subject_id' => $validate['subject_id'],
            'topic_id' => $validate['topic_id'],
            'format_type' => $validate['format_type'],
            'purpose_type' => $validate['purpose_type'],
            'difficulty' => $validate['difficulty'],
            'question_text' => $validate['question_text'],
            'options' => $validate['options'],
            'correct_answer' => $validate['correct_answer'],
            'weight' => $validate['weight'],
            'attachment_path' => $validate['attachment_path'] ?? $question->attachment_path,
            'is_used' => $validate['is_used'],
        ]);

        //dd($question);

        return redirect()->route('questionIndex')->with('message', 'Question was Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //if question has attachment, delete it
        if($question->attachment_path){
            Storage::disk('public')->delete($question->attachment_path);
        }

        //Delete the question
        $question->delete();

        return redirect()->route('questionIndex')->with('message', 'Question was Deleted Successfully');
    }
}
