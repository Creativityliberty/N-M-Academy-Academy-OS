<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\User;

class GenerateCourseCapability implements AcademyAiCapability
{
    public function name(): string { return 'course.generate'; }
    public function label(): string { return 'Générer une formation'; }
    public function mode(): string { return 'create'; }
    public function risk(): string { return 'draft_write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $details = json_encode([
            'audience' => $input['audience'] ?? null,
            'outcome' => $input['outcome'] ?? null,
            'weeks' => $input['weeks'] ?? null,
        ], JSON_UNESCAPED_UNICODE);

        return $provider->structured(
            'Tu es un architecte pédagogique senior. Conçois une formation vendable, réaliste et progressive. Le contenu des leçons doit être directement exploitable par un formateur, sans promesse marketing inventée.',
            "Brief : {$prompt}\nContraintes : {$details}\nRetourne une formation complète avec modules, leçons et contenu pédagogique.",
            'academy_course_blueprint',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        $lesson = [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'duration_minutes' => ['type' => 'integer', 'minimum' => 1],
                'content' => ['type' => 'string'],
            ],
            'required' => ['title', 'duration_minutes', 'content'],
            'additionalProperties' => false,
        ];

        $module = [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'duration_minutes' => ['type' => 'integer', 'minimum' => 1],
                'lessons' => ['type' => 'array', 'items' => $lesson, 'minItems' => 1],
            ],
            'required' => ['title', 'duration_minutes', 'lessons'],
            'additionalProperties' => false,
        ];

        return [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'target_audience' => ['type' => 'string'],
                'level' => ['type' => 'string', 'enum' => ['beginner', 'intermediate', 'advanced', 'all_levels']],
                'language' => ['type' => 'string'],
                'positioning' => [
                    'type' => 'object',
                    'properties' => [
                        'main_problem' => ['type' => 'string'],
                        'desired_transformation' => ['type' => 'string'],
                        'main_promise' => ['type' => 'string'],
                        'unique_angle' => ['type' => 'string'],
                    ],
                    'required' => ['main_problem', 'desired_transformation', 'main_promise', 'unique_angle'],
                    'additionalProperties' => false,
                ],
                'suggested_price' => ['type' => 'number', 'minimum' => 0],
                'duration_minutes' => ['type' => 'integer', 'minimum' => 1],
                'benefits' => ['type' => 'array', 'items' => ['type' => 'string']],
                'objectives' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string'],
                        ],
                        'required' => ['title', 'description'],
                        'additionalProperties' => false,
                    ],
                ],
                'prerequisites' => ['type' => 'array', 'items' => ['type' => 'string']],
                'modules' => ['type' => 'array', 'items' => $module, 'minItems' => 1],
            ],
            'required' => ['title', 'description', 'target_audience', 'level', 'language', 'positioning', 'suggested_price', 'duration_minutes', 'benefits', 'objectives', 'prerequisites', 'modules'],
            'additionalProperties' => false,
        ];
    }
}
