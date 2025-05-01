<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Topics extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'parent_id',
        'subject_id',
        'order',
    ];

    public function subject(){
        return $this->belongsTo(Subject::class);
    }

    public function parent()
    {
        return $this->belongsTo(Topics::class, 'parent_id');
    }

    public function subTopics()
    {
        return $this->hasMany(Topics::class, 'parent_id');
    }

    public function studyMaterials()
    {
        return $this->hasMany(StudyMaterial::class);
    }

    public function proficiency()
    {
        return $this->hasOne(StudentTopicProficiency::class, 'topic_id')
            ->where('student_id', auth()->id());
    }
}
