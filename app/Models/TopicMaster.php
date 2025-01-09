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
        'subject_id',
        'created_by'
    ];

    // public function topics(){
    //     return $this->belongsToMany(Topics::class, 'topic_master_topics' )->withPivot('order')->withTimestamps();
    // }

    public function topics()
    {
        return $this->belongsToMany(Topics::class, 'topic_master_topics', 'topic_master_id', 'topics_id')
                    ->withPivot('order')
                    ->withTimestamps();
    }
    
    public function subject(){
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
