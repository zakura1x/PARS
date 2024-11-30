<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia(component: 'ProgramHead/Subject/SubjectList');
    }

    /**
     * Fetch all subjects as JSON for the API.
     */
    public function getSubjects()
    {
        $subjects = Subject::all(); // Get all subjects from the database
        return response()->json($subjects); // Return as JSON
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
       $validated = $request->validate([
            'subject_id' => 'required|unique:subjects',
            'name' => 'required|string|max:255',
        ]);

        Subject::create([
            'subject_id' => $validated['subject_id'],
            'name' => $validated['name'],
        ]);

        // return inertia('Programhead/Subject/SubjectList');
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
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], Response::HTTP_NOT_FOUND);
        }

        // Delete the subject
        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully'], Response::HTTP_OK);
    }
}
