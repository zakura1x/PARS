<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentTopicProficiency extends Model
{
    /** @use HasFactory<\Database\Factories\StudentTopicProficienciesFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'topic_id',
        'average_score',
        'attempts',
        'proficiency_level',
        'grade',
        'is_mastered'
    ];

    public function student() {
        return $this->belongsTo(User::class);
    }

    public function topic(){
        return $this->belongsTo(Topics::class);
    }

    //Methods
    public static function updateProficiency($studentId, $topicId, $newScore){
        $proficiency = self::firstOrNew([
            'student_id' => $studentId,
            'topic_id' => $topicId
        ]);

        $proficiency->average_score = (($proficiency->average_score * $proficiency->attempts) + $newScore);
        $proficiency->attempts += 1;

        $proficiency->proficiency_level = match(true){
            $proficiency->average_score < 60 => 'beginner',
            $proficiency->average_score > 60 && $proficiency->average_score <=80 => 'intermediate',
            default => 'advanced'
        };

        $proficiency->save();
        return $proficiency;
    }


}
