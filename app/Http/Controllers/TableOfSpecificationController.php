<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTableOfSpecificationRequest;
use App\Http\Requests\UpdateTableOfSpecificationRequest;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\Topics;
use Illuminate\Http\Request;

class TableOfSpecificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all subjects
        $subjects = Subject::all();

        // Pass the subjects to the frontend
        return inertia('TableOfSpecification/TOSIndex', [
            'subjects' => $subjects,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function createOrEditForm(Request $request, $subjectId)
    {
        // Fetch all topics for the given subject
        $topics = Topics::where('subject_id', $subjectId)->get();

        // Fetch existing TOS records for the subject
        $tosRecords = TableOfSpecification::where('subject_id', $subjectId)
            ->with('topic') // Include the topic relationship
            ->get();

        return inertia('TableOfSpecification/TOSForm', [
            'topics' => $topics,
            'tosRecords' => $tosRecords, // Pass existing TOS records
            'subjectId' => $subjectId,
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'items' => 'required|array',
            'items.*.topic_id' => 'required|exists:topics,id',
            'items.*.difficulty' => 'required|array',
            'items.*.difficulty.*' => 'integer|min:0'
        ]);

        $totalItems = array_reduce($validatedData['items'], function ($carry, $item){
            return $carry + array_sum($item['difficulty']);
        }, 0);

        foreach ($validatedData['items'] as $item){
            $topicTotalItems = array_sum($item['difficulty']);
            $percentage = $totalItems > 0 ? ($topicTotalItems/$totalItems) * 100:0;

            TableOfSpecification::updateOrCreate(
                [
                    'topic_id' => $item['topic_id'],
                    'subject_id' => $validatedData['subject_id']
                ],
                [
                    'difficulty' => $item['difficulty'],
                    'percentage' => $percentage,
                    'num_questions' => $topicTotalItems
                ]
            
            );
        }

        return to_route('tos.index')->with(['message' => 'Table of Specification saved successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show($subjectId)
    {
        // Fetch all topics for the given subject
        $topics = Topics::where('subject_id', $subjectId)->get();

        // Fetch all TOS records for the given subject and include the associated topics
        $tosRecords = TableOfSpecification::where('subject_id', $subjectId)
            ->with('topic')
            ->get();

        // Return to the view with the necessary data
        return inertia('TableOfSpecification/TOSView', [
            'topics' => $topics,
            'tosRecords' => $tosRecords,
            'subjectId' => $subjectId,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TableOfSpecification $tableOfSpecification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTableOfSpecificationRequest $request, TableOfSpecification $tableOfSpecification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TableOfSpecification $tableOfSpecification)
    {
        //
    }
}
