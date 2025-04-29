<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentTopicScore extends Model
{
    /** @use HasFactory<\Database\Factories\StudentTopicScoreFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'topic_id',
        'score',
    ];

    

    

}
