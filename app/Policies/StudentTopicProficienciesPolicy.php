<?php

namespace App\Policies;

use App\Models\User;
use App\Models\student_topic_proficiencies;
use Illuminate\Auth\Access\Response;

class StudentTopicProficienciesPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, student_topic_proficiencies $studentTopicProficiencies): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, student_topic_proficiencies $studentTopicProficiencies): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, student_topic_proficiencies $studentTopicProficiencies): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, student_topic_proficiencies $studentTopicProficiencies): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, student_topic_proficiencies $studentTopicProficiencies): bool
    {
        return false;
    }
}
