<?php

namespace Database\Factories;

use App\Enums\CourseStatus;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'trainer_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(3),
            'price' => fake()->randomFloat(2, 19, 199),
            'duration' => fake()->numberBetween(60, 600),
            'image' => fake()->imageUrl(800, 600, 'nature'),
            'featured' => false,
            'benefits' => ['Accès à vie', 'Attestation de complétion'],
            'objectives' => null,
            'prerequisites' => null,
            'status' => CourseStatus::Draft->value,
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => CourseStatus::Published->value,
            'published_at' => now(),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['featured' => true]);
    }
}
