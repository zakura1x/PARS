<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Assessment;

class AssessmentQuestion extends Model
{
    /** @use HasFactory<\Database\Factories\AssessmentQuestionFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'assessment_id',
        'question_id'
    ];

    public function assessment(){
        return $this->belongsTo(Assessment::class);
    }

    public function question(){
        return $this->belongsTo(Question::class);
    }
}
