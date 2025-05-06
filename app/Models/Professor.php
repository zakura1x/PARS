<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
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

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    //$professor->full_name; -- TO GET THE FULL NAME
    public function getFullNameAttribute()
    {
        return "{$this->user->first_name} {$this->user->last_name}";
    }

    public function scopeWithProfessorUser($query)
    {
        return $query->with(['user' => function($query) {
            $query->where('role', User::ROLE_PROFESSOR);
        }]);
    }
}
