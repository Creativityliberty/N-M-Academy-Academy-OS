<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lesson>
 */
class LessonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'module_id' => Module::factory(),
            'title' => fake()->sentence(4),
            'duration' => fake()->numberBetween(5, 60),
            'is_free' => false,
            'order' => fake()->numberBetween(1, 20),
        ];
    }

    public function free(): static
    {
        return $this->state(fn () => ['is_free' => true]);
    }
}
