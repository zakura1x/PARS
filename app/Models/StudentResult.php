<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentResult extends Model
{
    /** @use HasFactory<\Database\Factories\StudentResultFactory> */
    use HasFactory;

    protected $fillable = [
        'student_assessment_id',
        'total_questions',
        'correct_answers',
        'wrong_answers',
        'score',
    ];

    protected $casts = [
        'score' => 'float',
        'correct_answers' => 'integer',
        'total_questions' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function studentAssessment(){
        return $this->belongsTo(StudentAssessment::class);
    }

    // Get all results for an assessment
}
