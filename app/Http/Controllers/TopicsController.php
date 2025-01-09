<?php

namespace App\Http\Controllers;

use App\Models\Topics;
use App\Http\Requests\UpdateTopicsRequest;
use App\Models\Subject;
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
        //Get all the subjects
        $subjects = Subject::all();

        return inertia('TopicManagement/TopicList', [
            'subjects' => $subjects
        ]);
    }

    public function viewDetails($subjectId)
    {
        // Find the subject by ID or return null if not found
        $subject = Subject::find($subjectId);
    
        // If no subject exists, set topics as an empty collection
        $topics = $subject ? $subject->topics()->with(['parent', 'subTopics'])->get() : collect();
    
        // Get parent topics (or empty if no topics)
        $parentTopics = $topics->whereNull('parent_id');
    
        // Get subtopics (or empty if no topics)
        $subTopics = $topics->whereNotNull('parent_id');
    
        return Inertia::render('TopicManagement/TopicDetails', [
            'subject' => $subject,
            'topics' => $topics,
            'parentTopics' => $parentTopics,
            'subTopics' => $subTopics,
        ]);
    }
    

    /*
     * View for editing topic
     */
    public function editView($id){
        //Fetch the topic and its subtopics
        $topics = Topics::with(['subTopics' , 'subject', 'parent'])->findOrFail($id);
        //$subject = Subject::findOrFail($subjectId);

        return Inertia::render('TopicManagement/TopicEdit', [
            'topic' => $topics,
            'subTopics' => $topics->subTopics,
            'parent' => $topics->parent,
            'subject' => $topics->subject,
        ]);
    }

    public function store(Request $request, string $subjectId)
    {
        $subject = Subject::findOrFail($subjectId);

        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string',
            'parent_id' => 'nullable|integer|exists:topics,id',
            'subject_id' => 'required|integer|exists:subjects,id',
        ]);

        // Create the topic
        $topic = Topics::create([
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'] ?? null, // Use null if parent_id is not present
            'subject_id' => $validated['subject_id'],
        ]);

        // Find the subject by ID or return null if not found
        $subject = Subject::find($subjectId);
    
        // If no subject exists, set topics as an empty collection
        $topics = $subject ? $subject->topics()->with(['parent', 'subTopics'])->get() : collect();
    
        // Get parent topics (or empty if no topics)
        $parentTopics = $topics->whereNull('parent_id');
    
        // Get subtopics (or empty if no topics)
        $subTopics = $topics->whereNotNull('parent_id');

        return redirect()->back()->with([
            'message' => 'Subtopic added successfully',
            'subject' => $subject,
            'parentTopics' => $parentTopics,
            'subTopics' => $subTopics,
        ]);
    }

    /**
     * Update the topic order
    */
    public function reorderTopics(Request $request, $id)
    {
        $validated = $request->validate([
            'topics' => 'required|array', // Array of topics to reorder
            'topics.*.id' => 'required|exists:topics,id',
            'topics.*.order' => 'required|integer|min:1',
        ]);
    
        DB::transaction(function () use ($validated) {
            foreach ($validated['topics'] as $index => $topic) {
                Topics::where('id', $topic['id'])->update(['order' => $index + 1]);
            }
        });

        // Fetch parent and subtopics separately
        $topics = Topics::with(['subTopics' , 'subject', 'parent'])->findOrFail($id);
    
        // Return an Inertia response with the updated topics
        return redirect()->back()->with([
            'message' => 'Topics reordered successfully.',
            'subTopics' => $topics->subTopics,
            'parent' => $topics->parent,
            'topics' => Topics::orderBy('order')->get(),]
        );
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
