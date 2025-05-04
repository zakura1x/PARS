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
        return $this->hasOneThrough(
            User::class, // Final model (User)
            StudentAssessment::class, // Intermediate model (StudentAssessment)
            'id', // Foreign key on StudentAssessment (links to student_assessment_id in StudentResult)
            'id', // Primary key of User
            'student_assessment_id', // Foreign key in StudentResult (points to StudentAssessment)
            'user_id' // Foreign key in StudentAssessment (points to User)
        );
    }


    public function studentAssessment(){
        return $this->belongsTo(StudentAssessment::class);
    }

    // Get all results for an assessment
}
