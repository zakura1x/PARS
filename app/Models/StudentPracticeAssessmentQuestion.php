<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPracticeAssessmentQuestion extends Model
{
    /** @use HasFactory<\Database\Factories\StudentPracticeAssessmentQuestionFactory> */
    use HasFactory;


    protected $fillable = [
        'practice_assessment_id',
        'question_id',
        'student_answer',
        'is_correct'
    ];

    protected $casts =[
        'student_answer' => 'array',
    ];

    public function practiceAssessment()
    {
        return $this->belongsTo(StudentPracticeAssessment::class, 'practice_assessment_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
