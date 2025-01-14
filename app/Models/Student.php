<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'birth_date',
        'gender',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    //$professor->full_name; -- TO GET THE FULL NAME
    public function getFullNameAttribute()
    {
        return "{$this->user->first_name} {$this->user->last_name}";
    }

    public function assessments() {
        return $this->belongsToMany(Assessment::class, 'student_assessments');
    }
}
