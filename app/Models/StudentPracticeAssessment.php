<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPracticeAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\StudentPracticeAssessmentFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'total_items',
        'type',
        'status',
        'time_limit',       // New column for time limit
        'started_at',       // New column for start time
        'submitted_at',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function questions()
    {
        return $this->hasMany(StudentPracticeAssessmentQuestion::class, 'practice_assessment_id');
    }

    public function results()
    {
        return $this->hasOne(StudentPracticeResult::class, 'practice_assessment_id');
    }
}
