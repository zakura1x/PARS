<?php

namespace App\Http\Controllers;

use App\Models\TopicMaster;
use App\Http\Requests\StoreTopicMasterRequest;
use App\Http\Requests\UpdateTopicMasterRequest;
use App\Models\Subject;

class TopicMasterController extends Controller
{
    /**
     * Display the listing of the topic Master along with its subject
     */
    public function index()
    {
        $topicmasters = TopicMaster::latest()
        ->paginate(10);

        $subjects = Subject::where('status', 1)->get();

        return inertia('TopicManagement/TopicList', ['topics' => $topicmasters, 'subjects' => $subjects]);

        // $subjects = Subject::with('topicMasters')->get();

        // return with Subjects
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //Create a new Topic
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTopicMasterRequest $request)
    {

        //Validate the name
        $validate = $request->validate([
            'name' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'status' => 'required|boolean',
        ]);

        //Create a new Topic Master
        $topic = TopicMaster::create([
            'name' => $validate['name'],
            'subject_id' => $validate['subject_id'],
            'status' =>  $validate['status'],
        ]);

        //Send a message to inertia
        return redirect('topicList')->with('message', 'The Master Topic was Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(TopicMaster $topicMaster)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TopicMaster $topicMaster)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTopicMasterRequest $request, TopicMaster $topicMaster)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TopicMaster $topicMaster)
    {
        //
    }
}
