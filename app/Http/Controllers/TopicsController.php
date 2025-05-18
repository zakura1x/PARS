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

        //dd($subTopics);
    
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
            'parentTopics' => $topics->parent,
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
            'message' => 'Topic added successfully',
            'subject' => $subject,
            'parentTopics' => $parentTopics,
            'subTopics' => $subTopics,
            //'parentTopic' => $topic, // Add the newly created topic to the response
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
    public function edit(Request $request, $topicId)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        //Update the topic name of the topics not the topic master
        $topic = Topics::findOrFail($topicId);

        $topic->update([
            'name' => $validated['name'],
        ]);

        return redirect()->back()->with('message', 'Topic was updated successfully');
    }

    /**
     * Delete the topic or a specific subtopic
     */
    public function delete($topicId)
    {
        $topic = Topics::with('subTopics', 'studyMaterials.attachments')->findOrFail($topicId);

        if ($topic->parent_id) {
            // Delete a specific subtopic
            // Delete related study materials and their attachments
            foreach ($topic->studyMaterials as $studyMaterial) {
                foreach ($studyMaterial->attachments as $attachment) {
                    $attachment->delete();
                }
                $studyMaterial->delete();
            }

            // Delete the subtopic itself
            $topic->delete();

            return redirect()->back()->with('message', 'Subtopic and its related data were deleted successfully');
        } else {
            // Delete the main topic and its subtopics
            // Delete related study materials and their attachments
            foreach ($topic->studyMaterials as $studyMaterial) {
                foreach ($studyMaterial->attachments as $attachment) {
                    $attachment->delete();
                }
                $studyMaterial->delete();
            }

            // Recursively delete subtopics and their study materials
            $this->deleteSubTopics($topic->subTopics);

            // Delete the topic itself
            $topic->delete();

            // For Inertia, we need to return a proper response
            return redirect()->back()->with([
                'message' => 'Topic and its related data were deleted successfully',
                'parentTopics' => Topics::where('subject_id', $topic->subject_id)
                    ->whereNull('parent_id')
                    ->orderBy('order')
                    ->get(),
                'subTopics' => Topics::where('subject_id', $topic->subject_id)
                    ->whereNotNull('parent_id')
                    ->orderBy('order')
                    ->get(),
            ]);
        }
    }

    /**
     * Recursive function to delete subtopics and their related data
     */
    private function deleteSubTopics($subTopics)
    {
        foreach ($subTopics as $subTopic) {
            // Delete related study materials and their attachments
            foreach ($subTopic->studyMaterials as $studyMaterial) {
                foreach ($studyMaterial->attachments as $attachment) {
                    $attachment->delete();
                }
                $studyMaterial->delete();
            }

            // Recursively delete subtopics
            $this->deleteSubTopics($subTopic->subTopics);

            // Delete the subtopic itself
            $subTopic->delete();
        }
    }
}
