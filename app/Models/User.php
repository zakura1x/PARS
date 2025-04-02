<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable ;
    //SoftDeletes add after migration 

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'idNumber',
        'email',
        'password',
        'role',
        'status',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected $appends = ['full_name'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function avatar(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ($value && !str_starts_with($value, 'data:image')) 
                ? 'data:image/png;base64,' . base64_encode($value) 
                : $value, // If already formatted, return as is
        );
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function studentAssessments()
    {
        return $this->hasMany(StudentAssessment::class, 'student_id');
    }

    public function results()
    {
        return $this->hasMany(StudentResult::class, 'student_id');
    }

    public function assessments()
    {
        return $this->belongsToMany(Assessment::class, 'assessment_student')
            ->withPivot('status') // Include the `status` column from the pivot table
            ->withTimestamps();  // Include timestamps if present in the pivot table
    }


}
