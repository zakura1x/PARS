<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subject_id',
        'topic_id',
        'format_type',
        'purpose_type',
        'difficulty',
        'question_text',
        'options',
        'correct_answer',
        'weight',
        'attachment_path',
        'status',
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

    // Helper method to get correct answers
    public function getCorrectOptions()
    {
        return collect($this->options)
            ->filter(fn($option) => in_array($option['text'], $this->correct_answer ?? []));
    }
}
