<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Context\StudentAnalysisContextBuilder;
use App\AI\Contracts\AiProvider;
use App\Models\User;

class AnalyzeStudentsCapability implements AcademyAiCapability
{
    public function __construct(private readonly StudentAnalysisContextBuilder $context) {}

    public function name(): string { return 'students.analyze'; }
    public function label(): string { return 'Analyser les étudiants'; }
    public function mode(): string { return 'analyze'; }
    public function risk(): string { return 'read_only'; }
    public function canApply(): bool { return false; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $context = $this->context->build($trainer, isset($input['course_id']) ? (int) $input['course_id'] : null);
        $contextJson = json_encode($context, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        return $provider->structured(
            'Tu es un analyste learning-business. Analyse uniquement les métriques agrégées fournies. N’invente aucun comportement individuel et propose des actions concrètes pour améliorer activation, progression et complétion.',
            "Métriques agrégées :\n{$contextJson}\n\nQuestion ou angle d’analyse : {$prompt}",
            'academy_student_analysis',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'summary' => ['type' => 'string'],
                'strengths' => ['type' => 'array', 'items' => ['type' => 'string']],
                'risks' => ['type' => 'array', 'items' => ['type' => 'string']],
                'actions' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'priority' => ['type' => 'string', 'enum' => ['high', 'medium', 'low']],
                            'action' => ['type' => 'string'],
                            'why' => ['type' => 'string'],
                        ],
                        'required' => ['priority', 'action', 'why'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            'required' => ['summary', 'strengths', 'risks', 'actions'],
            'additionalProperties' => false,
        ];
    }
}
