<?php

namespace App\Http\Controllers;

use App\Models\Professor;
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
        $subjects = Subject::with('professor.user')->latest()->paginate(10);
        $professors = Professor::with('user')->get();

        dd($professors);

        return inertia('ProgramHead/SubjectManagement/SubjectList', ['subjects' => $subjects, 'professors' => $professors]);
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
        // Validate the user data
        $validateSubject = $request->validate([
            'subject_id' => 'required|string|max:255|unique:subjects,subject_id',
            'name' => 'required|string|max:255',
            'professor_id' => 'nullable|exists:professors,id'
        ]);

        // Create a new subject
        Subject::create([
            'subject_id' => $validateSubject['subject_id'],
            'name' => $validateSubject['name'],
            'professor_id' => $validateSubject['professor_id'],
        ]);

        //Send a message to inertia
        return redirect()->back()->with('message', 'The Subject was Created Successfully');
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
    public function edit(Request $request, $id)
    {
        $validated = $request->validate([
            'subject_id' => 'required|string|max:255|unique:subjects,subject_id,' . $id,
            'name' => 'required|string|max:255',
            'professor_id' => 'nullable|exists:professors,id'
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update($validated);

        return redirect('subjectList')->with('message', 'The Subject was Edited Successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
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
