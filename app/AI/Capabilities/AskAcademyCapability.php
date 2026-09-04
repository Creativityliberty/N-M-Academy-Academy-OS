<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Context\AcademyContextBuilder;
use App\AI\Contracts\AiProvider;
use App\Models\User;

class AskAcademyCapability implements AcademyAiCapability
{
    public function __construct(private readonly AcademyContextBuilder $context) {}

    public function name(): string { return 'academy.ask'; }
    public function label(): string { return 'Ask Academy'; }
    public function mode(): string { return 'ask'; }
    public function risk(): string { return 'read_only'; }
    public function canApply(): bool { return false; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $context = json_encode($this->context->build($trainer), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $answer = $provider->text(
            'Tu es Academy AI, copilote d’un créateur de formation. Réponds en français, de façon concise, opérationnelle et basée uniquement sur les données d’académie fournies. Si les données ne suffisent pas, dis-le clairement.',
            "Contexte agrégé de l’académie :\n{$context}\n\nQuestion du créateur :\n{$prompt}",
        );

        return ['answer' => $answer];
    }
}
