<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Assessment extends Model
{
    /** @use HasFactory<\Database\Factories\AssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'created_by',
        'type',
        'subject_id',
        'title',
        'description',
        'status',
        'time_limit',
        'access_code',
        'approved',
        'approved_by',
        'rejection_reason',
        'started_at',
        'ended_at',
    ];

    public function questions(){
        return $this->hasMany(Question::class, 'assessment_questions');
    }

    public function assessmentQuestions()
    {
        return $this->hasMany(StudentAssessmentQuestion::class, 'assessment_id');
    }

    public function subject(){
        return $this->belongsTo(Subject::class);
    }

    public function creator(){
        return $this->belongsTo(User::class, 'created_by');
    }

    public function studentAssessments()
    {
        return $this->hasMany(StudentAssessment::class);
    }

    public function studentResults()
    {
        return $this->hasMany(StudentResult::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'assessment_student')
            ->withPivot('status') // Include the `status` column from the pivot table
            ->withTimestamps();  // Include timestamps if present in the pivot table
    }

    //Methods
    public static function boot()
    {
        parent::boot();

        static::creating(function ($assessment) {
            $assessment->access_code = Str::random(8); // Generate an 8-character unique code
        });
    }


    
    //Methods
}
