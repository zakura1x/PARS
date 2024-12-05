<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subject::latest() // Orders by created_at in descending order
        ->paginate(10);

        return inertia('ProgramHead/Subject/SubjectList', ['subjects' => $subjects]);
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
    public function store(Request $request)
    {
        // Validate the user data
        $validateSubject = $request->validate([
            'subject_id' => 'required|string|max:255|unique:subjects,subject_id',
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
        ]);

        // Create a new subject
        Subject::create([
            'subject_id' => $validateSubject['subject_id'],
            'name' => $validateSubject['name'],
            'created_by' => Auth::id(),
            'status' =>  $validateSubject['status'],
        ]);

        //Send a message to inertia
        return redirect('/subjectList')->with('message', 'The Subject was Created');
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
    public function edit(Request $request, string $id)
    {
        $subject = Subject::findOrFail($id);

        $validateSubject = $request->validate([
            'subject_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $subject->update([
            'subject_id' => $validateSubject['subject_id'],
            'name' => $validateSubject['name'],
            'status' => $validateSubject['status'],
        ]);

        return redirect('/subjectList')->with('message', 'The Subject was Edited Successfully');
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
