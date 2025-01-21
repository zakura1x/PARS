<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTableOfSpecificationRequest;
use App\Http\Requests\UpdateTableOfSpecificationRequest;
use App\Models\Subject;
use App\Models\TableOfSpecification;
use App\Models\Topics;
use Illuminate\Support\Facades\Request;

class TableOfSpecificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get the search query and subject ID
        $search = $request->input('search');
        $subjectId = $request->input('subject_id');

        // Get all the Subjects for the dropdown
        $subjects = Subject::all();

        // Get all the Topics with search functionality
        $topics = Topics::when($subjectId, function ($query, $subjectId) {
            return $query->where('subject_id', $subjectId);
        })
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->latest() // Orders by created_at in descending order
        ->paginate(10);

        // Return Inertia component
        return inertia('TopicGradingCriteria/CriteriaIndex', [
            'subjects' => $subjects,
            'topics' => $topics,
            'search' => $search,
            'subjectId' => $subjectId,
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
    public function store(StoreTableOfSpecificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TableOfSpecification $tableOfSpecification)
    {
        //
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
