<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'name',
        'created_by',
        'status',
    ];

    public function topicMasters(){
        return $this->hasMany(TopicMaster::class, 'subject_id');
    }
}
