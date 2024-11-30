<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subject::all(); // Retrieve all subjects
        return inertia('ProgramHead/Subject/SubjectList', [
            'subjects' => $subjects, // Pass subjects to the view
        ]);
    }

    /**
     * Fetch all subjects as JSON for the API.
     */
    public function getSubjects()
    {
        $subjects = Subject::all(); // Get all subjects from the database
        return response()->json([
            'status' => 'success',
            'data' => $subjects,
        ], Response::HTTP_OK);
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
            'subject_id' => 'required|unique:subjects,subject_id',
            'name' => 'required|string|max:255',
            'active' => 'required|boolean',
        ]);

        $subject = Subject::create([
            'subject_id' => $validated['subject_id'],
            'name' => $validated['name'],
            'created_by' => Auth::id(), // Use the ID of the currently logged-in user
            'active' => $validated['active'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subject created successfully',
            'data' => $subject,
        ], Response::HTTP_CREATED);
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
        // $subject = Subject::find($id);

        // if (!$subject) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Subject not found',
        //     ], Response::HTTP_NOT_FOUND);
        // }

        // $validated = $request->validate([
        //     'name' => 'required|string|max:255',
        //     'active' => 'required|boolean',
        // ]);

        // $subject->update([
        //     'name' => $validated['name'],
        //     'active' => $validated['active'],
        // ]);

        // return response()->json([
        //     'status' => 'success',
        //     'message' => 'Subject updated successfully',
        //     'data' => $subject,
        // ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // $subject = Subject::find($id);

        // if (!$subject) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Subject not found',
        //     ], Response::HTTP_NOT_FOUND);
        // }

        // $subject->delete();

        // return response()->json([
        //     'status' => 'success',
        //     'message' => 'Subject deleted successfully',
        // ], Response::HTTP_OK);
    }
}
