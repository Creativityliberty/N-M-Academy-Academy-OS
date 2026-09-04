<?php

namespace Database\Factories;

use App\Enums\TrainerApplicationStatus;
use App\Models\TrainerApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TrainerApplication>
 */
class TrainerApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'status' => TrainerApplicationStatus::Pending,
            'motivation' => fake()->paragraphs(2, true),
            'experience' => fake()->paragraph(),
            'specialties' => fake()->randomElements(['Méditation', 'Yoga', 'Pleine conscience', 'Respiration', 'Relaxation']),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => TrainerApplicationStatus::Approved,
            'reviewed_by' => User::factory(),
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => [
            'status' => TrainerApplicationStatus::Rejected,
            'reviewed_by' => User::factory(),
            'reviewed_at' => now(),
            'rejection_reason' => fake()->sentence(),
        ]);
    }
}
