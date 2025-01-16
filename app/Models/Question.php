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

    public function studentAnswers()
    {
        return $this->hasMany(StudentAssessmentQuestion::class);
    }


    //Methods
    public static function resetIsUsed($topicId){
        return self::where('topic_id', $topicId)->update(['is_used' => false]);
    }

    public static function replaceQuestion($questionId)
    {
        $question = self::findOrFail($questionId);

        // Find a replacement question with the same aspects
        $replacement = self::where('topic_id', $question->topic_id)
            ->where('format_type', $question->format_type)
            ->where('purpose_type', $question->purpose_type)
            ->where('difficulty', $question->difficulty)
            ->where('is_used', false)
            ->inRandomOrder()
            ->first();

        if ($replacement) {
            // Flag the old question as not used
            $question->update(['is_used' => false]);

            // Flag the replacement question as used
            $replacement->update(['is_used' => true]);

            return $replacement;
        }

        return null;
    }
}
