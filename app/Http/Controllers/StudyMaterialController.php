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
use Illuminate\Support\Facades\Storage;

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
            ->get()
            ->map(function ($material) {
                // Add a `public_url` property to each attachment
                $material->attachments = $material->attachments->map(function ($attachment) {
                    $attachment->public_url = Storage::url($attachment->file_path);
                    return $attachment;
                });
                return $material;
            });

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
     *
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

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                // Store the file in the public storage directory
                $path = $file->store('study_materials', 'public');

                // Create a database record for the attachment
                StudyMaterialAttachment::create([
                    'study_material_id' => $studyMaterial->id,
                    'file_path' => $path, // Save the relative path
                    'file_name' => $file->getClientOriginalName(), // Save the original filename
                ]);
            }
        }

        // return back();

        return redirect()->route('study-materials.index', $topicId)
            ->with('message', 'Study material created successfully');
    }

    /**
     * Display the specific material and can also Edit
     * Form for editing
     * @param mixed $studyMaterialId
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function edit($studyMaterialId)
    {
        // Fetch the study material along with its attachments
        $studyMaterial = StudyMaterial::with('attachments')->findOrFail($studyMaterialId);

        return inertia('StudyMaterial/StudyMaterialEditForm', [
            'topicId' => $studyMaterial->topic_id,
            'studyMaterial' => $studyMaterial,
            'attachments' => $studyMaterial->attachments, // Include attachments explicitly
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    // public function edit($studyMaterialId)
    // {
    //     // $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);

    //     // $attachments = StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->get();

    //     // return inertia('StudyMaterial/StudyMaterialForm', ['studyMaterial'=> $studyMaterial,'attachments'=> $attachments]);
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $studyMaterialId)
    {

        //dd($request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'links' => 'nullable|array',
            'links.*' => 'url',
        ]);

        $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);

        // Update the study material
        $studyMaterial->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'links' => $validated['links'] ?? []
        ]);

        //

        return redirect()->route('study-materials.index', $studyMaterial->topic_id)
            ->with('message', 'Study material updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($studyMaterialId)
    {
        $studyMaterial = StudyMaterial::findOrFail($studyMaterialId);
        $topic = $studyMaterial->topic->id;

        // Get all attachments for this study material
        $attachments = StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->get();

        // Delete files from storage
        foreach ($attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        };

        // Delete attachments from database
        StudyMaterialAttachment::where('study_material_id', $studyMaterialId)->delete();

        // Delete the study material
        $studyMaterial->delete();

        return redirect()->route('study-materials.index', $studyMaterial->topic_id)
            ->with('message', 'Topic has been deleted successfully');
    }

    //Student Controller
    public function studentIndex(){
        $subject = Subject::all();

        return inertia('StudyMaterial/Student/StudentStudyMaterial', [
            'subjects' => $subject
        ]);
    }

    public function studentShowTopics($subjectId){

        // Find the subject by ID or return null if not found
        $subject = Subject::find($subjectId);

        // If no subject exists, set topics as an empty collection
        $topics = $subject ? $subject->topics()->with(['parent', 'subTopics'])->get() : collect();

        // Get parent topics (or empty if no topics)
        $parentTopics = $topics->whereNull('parent_id');

        // Get subtopics (or empty if no topics)
        $subTopics = $topics->whereNotNull('parent_id');

        //dd($parentTopics);

        return inertia('StudyMaterial/Student/StudentShowTopics', [
            'topic' => $topics,
            'subTopics' => $subTopics,
            'parentTopics' => $parentTopics,
            'subject' => $subject,
            'subjectName' => $subject?->name,
            'subjectCode' => $subject?->subject_id,
        ]);
    }
    public function studentShowSubTopics($topicId)
    {
        $topic = Topics::with([
            'subject',
            'studyMaterials.attachments',
            'subTopics.studyMaterials.attachments'
        ])->findOrFail($topicId);
    
        // Process materials - ensure consistent data structure
        $processMaterials = function ($materials) {
            return $materials->map(function ($material) {
                // Ensure links is always an array
                $material->links = $material->links ?: [];
                
                // Add public URLs to attachments
                if ($material->attachments) {
                    $material->attachments->transform(function ($attachment) {
                        $attachment->public_url = Storage::url($attachment->file_path);
                        return $attachment;
                    });
                }
                
                return $material;
            });
        };
    
        // Process all materials
        $topic->studyMaterials = $processMaterials($topic->studyMaterials);
        $topic->subTopics->each(function ($subtopic) use ($processMaterials) {
            $subtopic->studyMaterials = $processMaterials($subtopic->studyMaterials);
        });
    
        return inertia('StudyMaterial/Student/StudentShowSubTopics', [
            'currentTopic' => $topic,
            'subject' => $topic->subject,
            'subjectName' => $topic->subject->name,
            'subjectCode' => $topic->subject->subject_id,
            'subjectId' => $topic->subject->id,
        ]);
    }
    public function studentShowStudyMaterial($topicId){
        $topic = Topics::with(relations: 'subject')->findOrFail($topicId);

        $studyMaterials = StudyMaterial::with('attachments')
            ->where('topic_id', $topicId)
            ->get()
            ->map(function ($material){
                $material->attachments = $material->attachments->map(function ($attachment){
                    $attachment->public_url = Storage::url($attachment->file_path);
                    return $attachment;
                });
                $material->links = $material->links ?? [];
                return $material;
            });

        return inertia('StudyMaterial/Student/StudentStudyMaterialList', [
            'studyMaterials' => $studyMaterials,
            'topic' => $topic,
            'subject' => $topic->subject
        ]);
    }
}
