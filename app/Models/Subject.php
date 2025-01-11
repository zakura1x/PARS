<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory, SoftDeletes ;
    

    protected $fillable = [
        'subject_id',
        'name',
        'created_by',
    ];

    public function topics(){
        return $this->hasMany(Topics::class);
    }

    // public function studyMaterial(){
    //     return $this->hasMany(StudyMaterial::class);
    // }
}
