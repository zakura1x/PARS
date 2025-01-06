<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TopicGradingCriteria extends Model
{
    /** @use HasFactory<\Database\Factories\TopicGradingCriteriaFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'topic_grading_criteria';

    protected $fillable = [
        'topic_id',
        'difficulty',
        'percentage',
        'min_questions'
    ];

    public function topic(){
        return $this->belongsTo(Topics::class);
    }

    //Methods
    public static function getCriteriaByTopic($topicId){
        return self::where('topic_id', $topicId)->get();
    }
}
