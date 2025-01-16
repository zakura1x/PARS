<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentResult extends Model
{
    /** @use HasFactory<\Database\Factories\StudentResultFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'assessment_id',
        'total_questions',
        'correct_answers',
        'wrong_answers',
        'score',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
