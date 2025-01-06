<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPracticeResult extends Model
{
    /** @use HasFactory<\Database\Factories\StudentPracticeResultFactory> */
    use HasFactory;

    protected $fillable = [
        'practice_assessment_id',
        'student_id',
        'correct_answers',
        'incorrect_answers',
        'score_percentage',
    ];

    public function practiceAssessment()
    {
        return $this->belongsTo(StudentPracticeAssessment::class, 'practice_assessment_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
