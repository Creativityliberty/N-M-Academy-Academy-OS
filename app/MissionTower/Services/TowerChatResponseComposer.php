<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerRun;
use Throwable;

class TowerChatResponseComposer
{
    public function __construct(private readonly TowerAiProviderResolver $providers) {}

    public function compose(TowerMission $mission, TowerRun $run): string
    {
        $run->refresh();
        $mission->load(['steps:id,mission_id,position,title,tool,risk,status,result,error_message', 'evidence:id,mission_id,run_id,type,status,summary,receipt_id,recorded_at']);

        if ($run->status === 'failed') {
            return 'La mission a échoué : '.($run->error_message ?: 'une étape n’a pas pu être exécutée. Consulte Runs / Evidence pour le détail.');
        }
        if ($run->status === 'cancelled') {
            return 'La mission a été arrêtée après le refus d’une action. Aucune étape suivante n’a été exécutée.';
        }
        if ($run->status !== 'completed') {
            return 'La mission est toujours en cours.';
        }

        $grounding = [
            'mission' => ['title' => $mission->title, 'objective' => $mission->objective],
            'steps' => $mission->steps->map(fn ($step): array => [
                'tool' => $step->tool,
                'risk' => $step->risk,
                'status' => $step->status,
                'result' => $step->result,
            ])->all(),
            'evidence' => $mission->evidence->where('run_id', $run->id)->map(fn ($item): array => [
                'type' => $item->type,
                'status' => $item->status,
                'summary' => $item->summary,
                'receipt_id' => $item->receipt_id,
            ])->values()->all(),
        ];

        try {
            return trim($this->providers->resolve()->text(
                <<<'PROMPT'
You are NÜM Mission Tower. Answer the user after a governed mission has completed.
Use ONLY the supplied mission results/evidence. Never invent a number, entity, action or outcome.
Be concise and useful. Mention important caveats. Do not expose internal requestState, secrets or raw authorization tokens.
Langue par défaut : français. Réponds en français sauf si l'objectif de la mission demande explicitement une autre langue.
Format the answer as clean Markdown when structure helps: short headings, **bold** emphasis, bullet lists and tables when they improve clarity.
Do not output raw JSON unless the user explicitly asks for it. Do not wrap the whole answer in a code block.
PROMPT,
                json_encode($this->sanitizeForProvider($grounding), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ));
        } catch (Throwable) {
            $succeeded = $mission->steps->where('status', 'succeeded')->count();
            return "Mission terminée avec succès. {$succeeded} étape(s) exécutée(s). Les receipts sont disponibles dans Evidence.";
        }
    }
    /** @return mixed */
    private function sanitizeForProvider(mixed $value, ?string $key = null): mixed
    {
        $sensitiveKeys = ['password', 'secret', 'token', 'request_state', 'requeststate', 'api_key', 'apikey', 'authorization', 'stripe_secret', 'client_secret'];
        if ($key !== null && in_array(strtolower($key), $sensitiveKeys, true)) {
            return '[REDACTED]';
        }
        if (! is_array($value)) {
            return $value;
        }

        $sanitized = [];
        foreach ($value as $childKey => $child) {
            $sanitized[$childKey] = $this->sanitizeForProvider($child, is_string($childKey) ? $childKey : null);
        }

        return $sanitized;
    }
}
