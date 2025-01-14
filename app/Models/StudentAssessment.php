<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\StudentAssessmentFactory> */
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'student_id',
        'status',
        'started_at',
        'completed_at',
        'score',
    ];

    public function answers()
    {
        return $this->hasMany(StudentAssessmentQuestion::class);
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
    
}
