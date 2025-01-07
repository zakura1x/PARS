<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentQuestionUsage extends Model
{
    /** @use HasFactory<\Database\Factories\StudentQuestionUsageFactory> */
    use HasFactory;
    protected $fillable = [
        'student_id',
        'question_id',
        'is_used',
        'is_correct',
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
