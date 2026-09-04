<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class RewriteLessonCapability implements AcademyAiCapability
{
    public function name(): string { return 'lesson.rewrite'; }
    public function label(): string { return 'Réécrire une leçon'; }
    public function mode(): string { return 'modify'; }
    public function risk(): string { return 'write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $lesson = Lesson::query()
            ->whereHas('module.course', fn ($query) => $query->where('trainer_id', $trainer->id))
            ->find($input['lesson_id'] ?? 0);

        if (! $lesson) {
            throw new AuthorizationException('Leçon introuvable ou non autorisée.');
        }

        return $provider->structured(
            'Tu es un éditeur pédagogique. Préserve le fond factuel fourni, améliore la clarté et n’invente aucune donnée absente.',
            "Titre actuel : {$lesson->title}\nContenu actuel :\n{$lesson->content}\n\nInstruction de réécriture : {$prompt}",
            'academy_lesson_rewrite',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'content' => ['type' => 'string'],
                'change_summary' => ['type' => 'string'],
            ],
            'required' => ['title', 'content', 'change_summary'],
            'additionalProperties' => false,
        ];
    }
}
