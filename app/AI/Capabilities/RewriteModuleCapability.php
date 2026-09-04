<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class RewriteModuleCapability implements AcademyAiCapability
{
    public function name(): string { return 'module.rewrite'; }
    public function label(): string { return 'Optimiser un module'; }
    public function mode(): string { return 'modify'; }
    public function risk(): string { return 'write'; }
    public function canApply(): bool { return false; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $module = Module::query()
            ->whereHas('course', fn ($query) => $query->where('trainer_id', $trainer->id))
            ->with('course:id,title')
            ->find((int) ($input['module_id'] ?? 0));
        if (! $module) { throw new AuthorizationException('Module cible introuvable ou non autorisé.'); }

        $current = [
            'course' => $module->course?->title,
            'title' => $module->title,
            'description' => $module->description,
            'objectives' => $module->objectives,
            'duration' => $module->duration,
            'minimum_access_rank' => $module->minimum_access_rank,
        ];

        return $provider->structured(
            'Tu es un architecte pédagogique. Optimise le titre, la description et les objectifs du module sans changer son niveau d’accès, son ordre ou sa durée. N’invente pas de leçons absentes.',
            "Module actuel : ".json_encode($current, JSON_UNESCAPED_UNICODE)."\n\nInstruction : {$prompt}",
            'academy_module_rewrite',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'objectives' => ['type' => 'array', 'items' => ['type' => 'string']],
                'change_summary' => ['type' => 'string'],
            ],
            'required' => ['title','description','objectives','change_summary'],
            'additionalProperties' => false,
        ];
    }
}
