<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TopicMaster extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'subject_id'
    ];

    public function topics(){
        return $this->hasMany(Topics::class, 'topic_master_topics')->withTimeStamps();
    }

    public function subject(){
        return $this->belongsTo(Subject::class);
    }
}
