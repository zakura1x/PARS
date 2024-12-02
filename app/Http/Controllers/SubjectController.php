<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subject::all();

        return Inertia::render('ProgramHead/Subject/SubjectList', [
            'subjects' => $subjects,
            'userId' => Auth::id(), // Passing the user ID
        ]);
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
        $request->validate([
            'subject_id' => 'required|string|max:255|unique:subjects',
            'name' => 'required|string|max:255',
            'active' => 'required|boolean',
        ]);

        // Create a new subject
        Subject::create([
            'subject_id' => $request->subject_id,
            'name' => $request->name,
            'active' => $request->active,
            'created_by' => Auth::id(),
        ]);

        // Return the updated subject list using Inertia
        return redirect()->route('subjects.index');
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
        $request->validate([
            'subject_id' => 'required|string|max:255|unique:subjects,subject_id,' . $id,
            'name' => 'required|string|max:255',
            'active' => 'required|boolean',
        ]);

        $subject = Subject::findOrFail($id);

        $subject->update([
            'subject_id' => $request->subject_id,
            'name' => $request->name,
            'active' => $request->active,
        ]);

        /// Fetch the updated subjects list
        $subjects = Subject::all();

        // Return the updated subjects for Inertia
        return response()->json([
            'subjects' => $subjects,
            'message' => 'Subject updated successfully.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

    }
}
