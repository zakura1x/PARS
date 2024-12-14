<?php

namespace App\Http\Controllers;

use App\Models\Topics;
use App\Http\Requests\UpdateTopicsRequest;
use App\Models\TopicMaster;
use Illuminate\Http\Request;

class TopicsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('TopicManagement/TopicDetails');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a Topic Parent
     */
    public function store(Request $request, string $id)
    {
        $topicMaster  = TopicMaster::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'parent_id' => 'integer|nullable|exists:topics,id',
            'subject_id' => 'integer|exists:subjects,id',
        ]);

        // Create the topic
        $topic = Topics::create([
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'] ?? null, // Use null if no parent_id is provided
            'subject_id' => $validated['subject_id'],
        ]);

        // Check if it's a main topic (no parent_id)
        if (is_null($validated['parent_id'])) {
            // Calculate the next order value (+1 from the current count of topics in the TopicMaster)
            $nextOrder = $topicMaster->topics()->count() + 1;

            // Attach the topic to the TopicMaster with the calculated order
            $topicMaster->topics()->attach($topic->id, ['order' => $nextOrder]);
        }
        
        //return redirect
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Topics $topics)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Topics $topics)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTopicsRequest $request, Topics $topics)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Topics $topics)
    {
        //
    }
}
