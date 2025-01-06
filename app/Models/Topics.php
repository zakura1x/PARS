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
    ];

    public function topicMasters()
    {
        return $this->belongsToMany(TopicMaster::class, 'topic_master_topics', 'topics_id', 'topic_master_id')
                    ->withPivot('order');
    }
    

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


}
