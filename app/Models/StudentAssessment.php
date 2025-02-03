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
        'user_id',
        'status',
        'shuffled_questions',
        'shuffled_options',
        'started_at',
        'completed_at',
        'score',
    ];

    protected $casts =[
        'shuffled_questions' => 'array',
        'shuffled_options' => 'array',
    ];

    public function questions()
    {
        return $this->hasMany(StudentAssessmentQuestion::class, 'student_assessment_id');
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function result()
    {
        return $this->hasOne(StudentResult::class);
    }
    
}
