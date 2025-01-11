<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudyMaterial extends Model
{
    /** @use HasFactory<\Database\Factories\StudyMaterialFactory> */
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'title',
        'content',
        'topic_id',
        'created_by'
    ];

    public function topic(){
        return $this->belongsTo(Topics::class);
    }

    public function createdBy(){
        return $this->belongsTo(User::class);
    }

    public function attachments(){
        return $this->hasMany(StudyMaterialAttachment::class);
    }

    // public function subject(){
    //     return $this->belongsTo(Subject::class);
    // }
}
