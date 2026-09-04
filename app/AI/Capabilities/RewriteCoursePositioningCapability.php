<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class RewriteCoursePositioningCapability implements AcademyAiCapability
{
    public function name(): string { return 'course.positioning.rewrite'; }
    public function label(): string { return 'Optimiser le positionnement'; }
    public function mode(): string { return 'modify'; }
    public function risk(): string { return 'write'; }
    public function canApply(): bool { return false; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $course = Course::query()->where('trainer_id', $trainer->id)->find((int) ($input['course_id'] ?? 0));
        if (! $course) { throw new AuthorizationException('Formation cible introuvable ou non autorisée.'); }

        $current = [
            'title' => $course->title,
            'description' => $course->description,
            'target_audience' => $course->target_audience,
            'level' => $course->level,
            'language' => $course->language,
            'positioning' => $course->positioning,
        ];

        return $provider->structured(
            'Tu es un stratège pédagogique et positionnement. Améliore seulement le positionnement réel de la formation. Préserve le sujet, évite les promesses irréalistes et n’invente aucune preuve sociale.',
            "Formation actuelle : ".json_encode($current, JSON_UNESCAPED_UNICODE)."\n\nInstruction : {$prompt}",
            'academy_course_positioning_rewrite',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'target_audience' => ['type' => 'string'],
                'level' => ['type' => 'string', 'enum' => ['beginner','intermediate','advanced','all_levels']],
                'language' => ['type' => 'string'],
                'positioning' => [
                    'type' => 'object',
                    'properties' => [
                        'main_problem' => ['type' => 'string'],
                        'desired_transformation' => ['type' => 'string'],
                        'main_promise' => ['type' => 'string'],
                        'unique_angle' => ['type' => 'string'],
                    ],
                    'required' => ['main_problem','desired_transformation','main_promise','unique_angle'],
                    'additionalProperties' => false,
                ],
                'change_summary' => ['type' => 'string'],
            ],
            'required' => ['target_audience','level','language','positioning','change_summary'],
            'additionalProperties' => false,
        ];
    }
}
