<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAssessmentQuestion extends Model
{
    /** @use HasFactory<\Database\Factories\StudentAssessmentQuestionFactory> */
    use HasFactory;

    protected $fillable = [
        'student_assessment_id',
        'question_id',
        'student_answer',
        'is_correct'
    ];

    protected $casts = [
        'student_answer' => 'array',
    ];

    public function studentAssessment()
    {
        return $this->belongsTo(StudentAssessment::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
