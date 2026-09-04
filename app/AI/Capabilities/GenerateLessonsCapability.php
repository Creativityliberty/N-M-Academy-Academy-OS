<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class GenerateLessonsCapability implements AcademyAiCapability
{
    public function name(): string { return 'lessons.generate'; }
    public function label(): string { return 'Générer des leçons'; }
    public function mode(): string { return 'create'; }
    public function risk(): string { return 'draft_write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $module = Module::query()->whereHas('course', fn ($query) => $query->where('trainer_id', $trainer->id))->with('course')->find($input['module_id'] ?? 0);
        if (! $module) {
            throw new AuthorizationException('Module introuvable ou non autorisé.');
        }

        return $provider->structured(
            'Tu es un concepteur pédagogique. Génère des leçons claires, actionnables et prêtes à être utilisées dans une formation en ligne.',
            "Formation : {$module->course->title}\nModule : {$module->title}\nDemande : {$prompt}",
            'academy_lessons',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'lessons' => [
                    'type' => 'array',
                    'minItems' => 1,
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string'],
                            'duration_minutes' => ['type' => 'integer', 'minimum' => 1],
                            'content' => ['type' => 'string'],
                        ],
                        'required' => ['title', 'duration_minutes', 'content'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            'required' => ['lessons'],
            'additionalProperties' => false,
        ];
    }
}
