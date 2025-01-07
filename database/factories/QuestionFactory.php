<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 2,
            'subject_id' => 1,
            'topic_id' => 1,
            'format_type' => $this->faker->randomElement(['multiple_choice']),
            'purpose_type' => $this->faker->randomElement(['practice']),
            'difficulty' => $this->faker->randomElement(['remembering', 'understanding', 'analyzing', 'evaluating', 'create']),
            'question_text' => $this->faker->sentence,
            'options' => [
                ['text' => $this->faker->word, 'is_correct' => false],
                ['text' => $this->faker->word, 'is_correct' => true],
                ['text' => $this->faker->word, 'is_correct' => false],
                ['text' => $this->faker->word, 'is_correct' => false],
            ],
            'correct_answer' => [$this->faker->word],
            'weight' => $this->faker->numberBetween(1, 10),
            'attachment_path' => null,
            'solution' => $this->faker->sentence,
            'status' => 'active',
            'is_used' => false,
        ];
    }
}
