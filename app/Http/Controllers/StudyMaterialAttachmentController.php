<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudyMaterialAttachmentRequest;
use App\Http\Requests\UpdateStudyMaterialAttachmentRequest;
use App\Models\StudyMaterialAttachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class StudyMaterialAttachmentController extends Controller
{

    public function downloadAttachment($id)
    {
        //dd("downloadAttachment called with id: {$id}");
        $attachment = StudyMaterialAttachment::findOrFail($id); // Fetch attachment from the database
        $filePath = $attachment->file_path;
        //dd("File path retrieved: {$filePath}");

        if (Storage::exists($filePath)) {
            //dd("File exists in storage: {$filePath}");
            return response()->download(storage_path("app/public/{$filePath}"));
        }

        dd("File not found: {$filePath}");
        return abort(404, 'File not found');
    }
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $studyMaterialId)
    {
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            
            // Store the file in the public storage directory
            $path = $file->store('study_materials', 'public');

            // Create a database record for the attachment
            StudyMaterialAttachment::create([
                'study_material_id' => $studyMaterialId,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
            ]);

            return back()->with('message', 'File uploaded successfully');
        }

        return back()->with('message', 'No file uploaded');
    }

    /**
     * Display the specified resource.
     */
    public function show(StudyMaterialAttachment $studyMaterialAttachment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudyMaterialAttachment $studyMaterialAttachment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudyMaterialAttachmentRequest $request, StudyMaterialAttachment $studyMaterialAttachment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($studyMaterialAttachmentId)
    {
        $studyMaterialAttachment = StudyMaterialAttachment::findOrFail($studyMaterialAttachmentId);
        
        // Get the file path before deleting the record
        $filePath = $studyMaterialAttachment->file_path;
        
        // Delete the database record
        $studyMaterialAttachment->delete();
        
        // Delete the file from storage if it exists
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
        
        return back()->with('message', 'Attachment deleted successfully');
    }
}
