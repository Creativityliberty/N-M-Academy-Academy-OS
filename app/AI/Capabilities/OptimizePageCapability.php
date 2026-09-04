<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\AcademyPage;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class OptimizePageCapability implements AcademyAiCapability
{
    public function name(): string { return 'page.optimize'; }
    public function label(): string { return 'Optimiser une page'; }
    public function mode(): string { return 'modify'; }
    public function risk(): string { return 'write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $page = AcademyPage::query()->where('trainer_id', $trainer->id)->with('sections')->find((int) ($input['page_id'] ?? 0));
        if (! $page) { throw new AuthorizationException('Page cible introuvable ou non autorisée.'); }
        $current = ['title' => $page->title, 'slug' => $page->slug, 'sections' => $page->sections->map(fn ($s) => ['type'=>$s->type,'variant'=>$s->variant,'settings'=>$s->settings])->values()];
        return $provider->structured(
            'Tu es un directeur de conversion et UX. Réorganise uniquement des blocs structurés autorisés. N’écris jamais de HTML, JavaScript, CSS ou code. N’invente ni témoignage, ni résultat client, ni prix. Les sections Pricing doivent rester reliées aux données commerce de l’Academy.',
            "Demande : {$prompt}\nPage actuelle : ".json_encode($current, JSON_UNESCAPED_UNICODE),
            'academy_page_optimization',
            PageBlueprintSchema::schema(),
        );
    }
}
