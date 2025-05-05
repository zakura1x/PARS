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

    // Add role constants
    const ROLE_ADMIN = 'admin';
    const ROLE_PROGRAM_HEAD = 'program_head';
    const ROLE_PROFESSOR = 'professor';
    const ROLE_STUDENT = 'student';

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

    /**
     * Check if user has any of the given roles
     *
     * @param array|string $roles
     * @return bool
     */
    public function hasAnyRole($roles): bool
    {
        $roles = is_array($roles) ? $roles : [$roles];
        return in_array($this->role, $roles);
    }

    public function studentAssessments()
    {
        return $this->hasMany(StudentAssessment::class, 'user_id');
    }

    public function results()
    {
        return $this->hasMany(StudentResult::class, 'user_id');
    }

    public function professor()
    {
        return $this->hasOne(Professor::class);
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    // Add to User model
    public function practiceAssessments()
    {
        return $this->hasMany(StudentPracticeAssessment::class, 'student_id');
    }

    public function topicProficiencies()
    {
        return $this->hasManyThrough(
            StudentTopicProficiency::class,
            Student::class,
            'user_id', // Foreign key on students table
            'student_id', // Foreign key on proficiencies table
            'id', // Local key on users table
            'id' // Local key on students table
        );
    }



}
