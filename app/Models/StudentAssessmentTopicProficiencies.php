<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAssessmentTopicProficiencies extends Model
{
    /** @use HasFactory<\Database\Factories\StudentAssessmentTopicProficienciesFactory> */
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'student_id',
        'topic_id',
        'previous_grade',
        'previous_level',
        'grade',
        'current_level'
    ];

    protected $table = 'student_assessment_topic_proficiencies';

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function assessment(){
        return $this->belongsTo(StudentPracticeAssessment::class);
    }

    //declare the table it uses
}
