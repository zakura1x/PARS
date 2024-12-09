<?php

namespace App\Http\Controllers;

use App\Models\TopicMaster;
use App\Http\Requests\StoreTopicMasterRequest;
use App\Http\Requests\UpdateTopicMasterRequest;
use App\Models\Subject;

class TopicMasterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        ]);

        //Create a new Topic Master
        $topic = TopicMaster::create([
            'name' => $validate['name'],
            'subject_id' => $validate['subject_id'],
        ]);

        //return

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
