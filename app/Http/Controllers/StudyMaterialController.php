<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudyMaterialRequest;
use App\Http\Requests\UpdateStudyMaterialRequest;
use App\Models\StudyMaterial;
use App\Models\StudyMaterialAttachment;
use App\Models\Subject;
use App\Models\Topics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudyMaterialController extends Controller
{
    /**
     * View all the Study Materials based on the topic
     * @param mixed $topicId
     * @return \Inertia\Response|\Inertia\ResponseFactory
     */
    public function index($topicId)
    {
        $topic = Topics::with('subject')->findOrFail($topicId);
        $studyMaterials = StudyMaterial::with('attachments')
            ->where('topic_id', $topicId)
            ->get();
            // Removed the map function since the array casting is already handling it
        //dd($studyMaterials);
        return inertia('StudyMaterial/StudyMaterialList', [
            'studyMaterials' => $studyMaterials,
            'topic' => $topic,
            'subject' => $topic->subject,
        ]);
    }

    /**
     * Form for Adding new Material
     * @param mixed $topicId
     * @return \Inertia\Response|\Inertia\ResponseFactory
     */
    public function create($topicId)
    {
        return inertia('StudyMaterial/StudyMaterialForm', ['topicId' => $topicId]);
    }

    /**
     * Store a new Material
     * @param \Illuminate\Http\Client\Request $request
     * @param mixed $topicId
     * @return void
     */
    public function store(Request $request, $topicId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
            'links' => 'nullable|array',
            'links.*' => 'nullable|url',
        ]);

        //dd($validated);

        $studyMaterial = StudyMaterial::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'links' => $validated['links'] ?? [],
            'topic_id' => $topicId,
            'created_by' => Auth::id(),
        ]);

        // Handle file uploads
        if($request->hasFile('attachments')){
            foreach ($request->file('attachments') as $file){
                $path = $file->store('study_materials');

                StudyMaterialAttachment::create([
                    'study_material_id' => $studyMaterial->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        // return back();

        return redirect()->route('topics.study-materials.index', $topicId)
            ->with('success', 'Study material created successfully');
    }

    /**
     * Display the specific material and can also Edit
     * Form for editing
     * @param mixed $studyMaterialId
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function show($studyMaterialId)
    {
        $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);

        // Get the attachments
        $attachments = StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->get();

        return inertia('StudyMaterial/StudyMaterialView', [
            'studyMaterial'=> $studyMaterial,
            'attachments'=> $attachments,
            'links' => $studyMaterial->links
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($studyMaterialId)
    {
        // $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);

        // $attachments = StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->get();

        // return inertia('StudyMaterial/StudyMaterialForm', ['studyMaterial'=> $studyMaterial,'attachments'=> $attachments]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $studyMaterialId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
            'links' => 'nullable|array',
            'links.*' => 'url'
        ]);

        $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);

        // Update the study material
        $studyMaterial->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'links' => $validated['links']
        ]);

        // Handle file uploads
        if ($request->hasFile('attachments')) {
            // Delete old attachments
            StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->delete();

            // Add new attachments
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('study_materials');

                StudyMaterialAttachment::create([
                    'study_material_id' => $studyMaterial->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return response()->json(['message' => 'Study material updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($studyMaterialId)
    {
        $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);
        $topic = $studyMaterial->topic->id;
        $studyMaterials = StudyMaterial::where('topic_id', $topic)->get();

        // Delete attachments
        StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->delete();

        // Delete the study material
        $studyMaterial->delete();

        return inertia('StudyMaterial/StudyMaterialList', ['studyMaterials' => $studyMaterials]);
    }
}
