<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademyTutorSetting extends Model
{
    protected $fillable = [
        'trainer_id',
        'enabled',
        'provider',
        'model',
        'premium_model',
        'personality',
        'outside_content_policy',
        'daily_limit',
        'monthly_budget_cents',
        'allowed_course_ids',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'allowed_course_ids' => 'array',
        ];
    }

    public static function forTrainer(int $trainerId): self
    {
        return static::query()->firstOrCreate(
            ['trainer_id' => $trainerId],
            [
                'enabled' => (bool) config('academy-tutor.enabled', true),
                'provider' => (string) config('academy-tutor.provider', 'inherit'),
                'model' => config('academy-tutor.model'),
                'premium_model' => config('academy-tutor.premium_model'),
                'personality' => (string) config('academy-tutor.personality', 'helpful'),
                'outside_content_policy' => (string) config('academy-tutor.outside_content_policy', 'never'),
                'daily_limit' => (int) config('academy-tutor.daily_limit', 20),
                'monthly_budget_cents' => (int) config('academy-tutor.monthly_budget_cents', 0),
                'allowed_course_ids' => [],
            ],
        );
    }

    public function allowsCourse(int $courseId): bool
    {
        $ids = array_map('intval', $this->allowed_course_ids ?? []);

        return $ids === [] || in_array($courseId, $ids, true);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }
}
