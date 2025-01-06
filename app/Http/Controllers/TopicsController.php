<?php

namespace App\Http\Controllers;

use App\Models\Topics;
use App\Http\Requests\UpdateTopicsRequest;
use App\Models\TopicMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TopicsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('TopicManagement/TopicDetails');
    }

    /*
     * View for editing topic
     */
    public function editView($id, $topicMasterId){
        //Fetch the topic and its subtopics
        $topics = Topics::with(['subTopics' , 'subject', 'parent'])->findOrFail($id);
        $topicMaster = TopicMaster::findOrFail($topicMasterId);
        //debugging
        //dd($topicMaster);
        //dd($topics);

        return Inertia::render('TopicManagement/TopicEdit', [
            'topic' => $topics,
            'subTopics' => $topics->subTopics,
            'parent' => $topics->parent,
            'subject' => $topics->subject,
            'topicMaster' => $topicMaster
        ]);
    }

    public function store(Request $request, string $id)
    {
        $topicMaster = TopicMaster::findOrFail($id);

        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string',
            'parent_id' => 'nullable|integer|exists:topics,id',
            'subject_id' => 'required|integer|exists:subjects,id',
        ]);

        //dd($validated);

        // // Ensure parent topic belongs to the same topic master
        // if ($validated['parent_id'] && !$topicMaster->topics()->where('id', $validated['parent_id'])->exists()) {
        //     return response()->json(['error' => 'Invalid parent topic'], 422);
        // }

        // Create the topic
        $topic = Topics::create([
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'] ?? null, // Use null if parent_id is not present
            'subject_id' => $validated['subject_id'],
        ]);

        if (!array_key_exists('parent_id', $validated) || is_null($validated['parent_id'])) {
            // Main topic: Calculate the next order value
            $nextOrder = $topicMaster->topics()->max('topic_master_topics.order') + 1;

            // Attach the topic to the TopicMaster
            $topicMaster->topics()->attach($topic->id, ['order' => $nextOrder]);
        } else {
            // Subtopic: Attach using the parent's order
            $parentTopic = Topics::findOrFail($validated['parent_id']);
            $parentOrder = $topicMaster
                ->topics()
                ->wherePivot('topics_id', $parentTopic->id)
                ->firstOrFail()
                ->pivot->order;

            // Attach the subtopic with the parent's order
            $topicMaster->topics()->attach($topic->id, ['order' => $parentOrder]);
        }

        // Fetch the updated topicMaster with its topics and subject
        $updatedTopicMaster = TopicMaster::with(['subject', 'topics'])->findOrFail($id);

        return response()->json([
            'message' => 'Subtopic added successfully',
            'topicMaster' => $updatedTopicMaster,
        ]);
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
            'topics.*.order' => 'required|integer|min:1',
        ]);
    
        DB::transaction(function () use ($topicMaster, $validated) {
            foreach ($validated['topics'] as $topic) {
                $topicMaster->topics()->updateExistingPivot($topic['id'], ['order' => $topic['order']]);
            }
        });
    
        return response()->json([
            'message' => 'Topics reordered successfully',
            'topics' => $topicMaster->topics()->orderBy('pivot_order')->get(),
        ]);
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
