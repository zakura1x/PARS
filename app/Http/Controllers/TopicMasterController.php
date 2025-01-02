<?php

namespace App\Http\Controllers;

use App\Models\TopicMaster;
use App\Http\Requests\StoreTopicMasterRequest;
use App\Http\Requests\UpdateTopicMasterRequest;
use App\Models\Subject;
//use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TopicMasterController extends Controller
{
    /**
     * Display the listing of the topic Master along with its subject
     */
    public function index()
    {
        $topicMasters = TopicMaster::with('subject:id,name', 'creator:id,first_name')
        ->latest()->paginate(perPage: 10);

        
        $subjects = Subject::where('status', true)->get();

        
        return inertia('TopicManagement/TopicList', ['topics' => $topicMasters, 'subjects' => $subjects]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',  // Ensure the subject exists
            'status' => 'required|boolean',
        ]);
    
        // Get the authenticated user's ID
        $userId = Auth::id();  // Authenticated user's ID
    
        // Check if the user is authenticated
        if (!$userId) {
            abort(403, 'User not authenticated');
        }
    
        // Create a new TopicMaster record wi
        $topic = TopicMaster::create([
            'name' => $validated['name'],
            'subject_id' => $validated['subject_id'],
            'status' => $validated['status'],
            'created_by' => $userId,  // Ensure this field is passed to the database
        ]);
    
        // Return a success message and redirect to the topic edit page
        return to_route('topic-masters.edit', $topic->id)
            ->with('message', 'The Master Topic was successfully created');
    }
    
    

    /**
     * Reorder the order of the topicMaster
     */
    public function reorder()
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //Fetch the topicMaster details
        $topicMaster = TopicMaster::with(['subject', 'topics.subtopics'])->findOrFail($id);

        //dd($topicMaster);
        //dd($topicMaster->topics);


        //Return the view
        return Inertia::render('TopicManagement/TopicDetails', [
            'topicMaster' => $topicMaster,
            'topics' => $topicMaster->topics,  // Include topics and their subtopics
            'subject' => $topicMaster->subject,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $topicMaster = TopicMaster::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'active' => 'required|boolean',
        ]);

        $topicMaster->update([
            'name'=> $validated['name'],
            'active'=> $validated['active'],
        ]);

        return redirect()->back()->with('message', 'The Master topic was successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $topicMaster = TopicMaster::findOrFail($id);

        //Detach all the topics associated with the topicMaster
        $topicMaster->topics->detach();

        //delete the topicMaster
        $topicMaster->delete();

        return redirect()->back()->with('message', 'The Master Topic was successfully deleted');
    }
}
