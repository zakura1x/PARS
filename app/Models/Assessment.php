<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assessment extends Model
{
    /** @use HasFactory<\Database\Factories\AssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'created_by',
        'type',
        'subject_id',
        'title',
        'description'
    ];

    public function questions(){
        return $this->hasMany(Question::class, 'assessment_questions');
    }

    public function subject(){
        return $this->belongsTo(Subject::class);
    }

    public function creator(){
        return $this->belongsTo(User::class, 'created_by');
    }

    //Methods
    //public static function generate
}
