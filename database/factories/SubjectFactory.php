<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_id' => $this->faker->unique()->regexify('SUB-[0-9]{4}'),
            'name' => $this->faker->words(3, true),
            'created_by' => User::factory(), // Creates a related User instance or use an existing User ID
            'active' => $this->faker->boolean(80), // 80% chance to be true (active)
        ];
    }
}
