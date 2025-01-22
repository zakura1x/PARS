<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TableOfSpecification extends Model
{
    /** @use HasFactory<\Database\Factories\TableOfSpecificationFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'topic_id',
        'subject_id',
        'difficulty',
        'percentage',
        'num_questions',
    ];

    protected $casts = [
        'difficulty' => 'array'
    ];

    public function topic(){
        return $this->belongsTo(Topics::class);
    }

    public function subject(){
        return $this->belongsTo(Subject::class);
    }
}
