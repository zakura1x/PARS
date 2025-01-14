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
        'description',
        'status',
        'time_limit',
        'code',
        'started_at',
        'ended_at',
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
    public function generateCode()
    {
        do {
            // Generate a random 6-character alphanumeric code
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
            
            // Check if code already exists
            $exists = static::where('code', $code)->exists();
        } while ($exists);

        $this->code = $code;
        $this->save();
        
        return $code;
    }

    //Methods
}
