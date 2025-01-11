<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudyMaterialAttachment extends Model
{
    /** @use HasFactory<\Database\Factories\StudyMaterialAttachmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable =[
        'study_material_id',
        'file_path',
        'file_name'
    ];

    public function studyMaterial(){
        return $this->belongsTo(StudyMaterial::class);
    }
}
