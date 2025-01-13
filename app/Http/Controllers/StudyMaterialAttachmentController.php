<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudyMaterialAttachmentRequest;
use App\Http\Requests\UpdateStudyMaterialAttachmentRequest;
use App\Models\StudyMaterialAttachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
    public function store(StoreStudyMaterialAttachmentRequest $request)
    {
        //
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
    public function destroy(StudyMaterialAttachment $studyMaterialAttachment)
    {
        //
    }
}
