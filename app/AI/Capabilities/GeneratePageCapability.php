<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\User;

class GeneratePageCapability implements AcademyAiCapability
{
    public function name(): string { return 'page.generate'; }
    public function label(): string { return 'Générer une page'; }
    public function mode(): string { return 'create'; }
    public function risk(): string { return 'draft_write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $courses = $trainer->courses()->with(['offers' => fn ($q) => $q->where('is_active', true)])->get()->map(fn ($course) => [
            'id' => $course->id, 'title' => $course->title, 'description' => $course->description,
            'offers' => $course->offers->map(fn ($offer) => ['id' => $offer->id, 'name' => $offer->name, 'billing_type' => $offer->billing_type, 'amount' => $offer->amount, 'currency' => $offer->currency])->values(),
        ])->values()->all();

        return $provider->structured(
            'Tu es un directeur créatif SaaS/LMS. Compose une page premium avec uniquement les blocs structurés autorisés. N’écris jamais de HTML, JavaScript, CSS ou code. Utilise les IDs de formations fournis quand une section doit être reliée au commerce réel. Évite les promesses, témoignages ou chiffres inventés : laisse les items vides si aucune preuve n’est fournie.',
            "Brief : {$prompt}\nCatalogue Academy : ".json_encode($courses, JSON_UNESCAPED_UNICODE),
            'academy_page_blueprint',
            PageBlueprintSchema::schema(),
        );
    }
}
