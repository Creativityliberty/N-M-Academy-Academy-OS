<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class GenerateCurriculumCapability implements AcademyAiCapability
{
    public function name(): string { return 'curriculum.generate'; }
    public function label(): string { return 'Générer un curriculum'; }
    public function mode(): string { return 'create'; }
    public function risk(): string { return 'draft_write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $course = Course::query()->where('trainer_id', $trainer->id)->find($input['course_id'] ?? 0);
        if (! $course) {
            throw new AuthorizationException('Formation introuvable ou non autorisée.');
        }

        return $provider->structured(
            'Tu es un architecte pédagogique. Génère uniquement un curriculum complémentaire cohérent, sans dupliquer inutilement ce qui existe déjà.',
            "Formation : {$course->title}\nDescription : {$course->description}\nDemande : {$prompt}",
            'academy_curriculum',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'modules' => [
                    'type' => 'array',
                    'minItems' => 1,
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string'],
                            'duration_minutes' => ['type' => 'integer', 'minimum' => 1],
                            'lessons' => [
                                'type' => 'array',
                                'minItems' => 1,
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'title' => ['type' => 'string'],
                                        'duration_minutes' => ['type' => 'integer', 'minimum' => 1],
                                        'summary' => ['type' => 'string'],
                                    ],
                                    'required' => ['title', 'duration_minutes', 'summary'],
                                    'additionalProperties' => false,
                                ],
                            ],
                        ],
                        'required' => ['title', 'duration_minutes', 'lessons'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            'required' => ['modules'],
            'additionalProperties' => false,
        ];
    }
}
