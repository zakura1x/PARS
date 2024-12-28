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

            // Determine if it's a subtopic or a main topic
        if (is_null($validated['parent_id'])) {
            // Main topic: Calculate the next order value in the pivot table
            $nextOrder = $topicMaster->topics()->max('pivot_order') + 1;

            // Attach the topic to the TopicMaster with the calculated order
            $topicMaster->topics()->attach($topic->id, ['order' => $nextOrder]);
        } else {
            // Subtopic: Attach using the parent's order
            $parentTopic = Topics::findOrFail($validated['parent_id']); // Fetch the parent topic

            // Find the parent's order in the current TopicMaster
            $parentOrder = $topicMaster
                ->topics()
                ->wherePivot('topic_id', $parentTopic->id)
                ->firstOrFail()
                ->pivot->order;

            // Attach the subtopic with the parent's order
            $topicMaster->topics()->attach($topic->id, ['order' => $parentOrder]);
        }

        //return redirect
    }

    /**
     * Update the topic order
    */
    public function reorder(Request $request, $topicMasterId)
    {
        $topicMaster = TopicMaster::findOrFail($topicMasterId);
    
        $validated = $request->validate([
            'topics' => 'required|array',
            'topics.*.id' => 'required|exists:topics,id',
            'topics.*.order' => 'required|integer',
        ]);
    
        foreach ($validated['topics'] as $topic) {
            $topicMaster->topics()->updateExistingPivot($topic['id'], ['order' => $topic['order']]);
        }
    
        return response()->json(['message' => 'Topics reordered successfully']);
    }

    /**
     * Edit/update the topic
     */
    public function edit(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'name' => 'required|string',
        ]);

        //Update the topic name of the topics not the topic master
        $topic = Topics::findOrFail($validated['topic_id']);

        $topic->update([
            'name' => $validated['name'],
        ]);

        return redirect()->back()->with('message', 'Topic was updated successfully');
    }

    /**
     * Delete the topic
    */
    public function delete(Request $request){
        $validated = $request->validate([
            'topic_id' => 'required|exits:topics,id'
        ]);

        $topic = Topics::findOrFail($validated['topic_id']);
        
        //soft delete here
        $topic->delete();
    }
}
