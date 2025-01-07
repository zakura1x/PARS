<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'subject_id',
        'topic_id',
        //Content
        'format_type',
        'purpose_type',
        'difficulty',
        'question_text',
        'options',
        'correct_answer',
        'weight',
        'attachment_path',
        'correct_answer',
        'solution',
        'status',
        'is_used',
    ];

    protected $casts =[
        'options' => 'array',
        'correct_answer' => 'array',
    ];

    public function subject(){
        return $this->belongsTo(Subject::class);
    }

    public function topic(){
        return $this->belongsTo(Topics::class);
    }

    public function createdBy(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function studentQuestionUsages(){
        return $this->hasMany(StudentQuestionUsage::class);
    }

    //Methods
    public static function resetIsUsed($topicId){
        return self::where('topic_id', $topicId)->update(['is_used' => false]);
    }

    //Purpose: Retrieves unused questions from a specific topic
    // Parameters:

    // $topicId: Required - the topic to fetch questions from
    // $difficulty: Optional - filter by difficulty level
    // $limit: Optional - limit the number of questions returned
    public static function fetchUnusedQuestion($topicId, $difficulty = null, $limit = null){
        $query = self::where('topic_id', $topicId)->where('is_used', false);

        if($difficulty){
            $query->where('difficulty', $difficulty);
        }

        if($limit){
            $query->limit($limit);
        }

        return $query->get();
    }

    // Helper method to get correct answers
    public function getCorrectOptions()
    {
        return collect($this->options)
            ->filter(fn($option) => in_array($option['text'], $this->correct_answer ?? []));
    }
}
