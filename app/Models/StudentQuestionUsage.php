<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentQuestionUsage extends Model
{
    /** @use HasFactory<\Database\Factories\StudentQuestionUsageFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'student_id',
        'question_id',
        'selection_percentage',
        'correct_attempts',
        'wrong_attempts'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
