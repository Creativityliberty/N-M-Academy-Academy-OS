<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerChatThread;
use Throwable;

class TowerThreadSummarizer
{
    public function __construct(
        private readonly TowerAiProviderResolver $providers,
        private readonly TowerMemoryPolicy $policy,
    ) {}

    public function maybeSummarize(TowerChatThread $thread): void
    {
        if (! (bool) config('mission-tower.chat.enabled', true)) return;
        $trigger = max(8, (int) config('mission-tower.chat.summary_trigger_messages', 16));
        $history = max(2, min(20, (int) config('mission-tower.chat.history_messages', 8)));
        $batchSize = max(4, min(32, (int) config('mission-tower.chat.summary_batch_messages', 16)));
        $afterId = (int) ($thread->summary_message_id ?? 0);
        $pending = $thread->messages()->where('id', '>', $afterId)->orderBy('id')->get();
        if ($pending->count() < $trigger || $pending->count() <= $history) return;

        $summarizeCount = min($batchSize, $pending->count() - $history);
        if ($summarizeCount <= 0) return;
        $batch = $pending->take($summarizeCount);
        $maxLength = max(1000, min(12000, (int) config('mission-tower.chat.max_summary_length', 6000)));

        try {
            $provider = $this->providers->resolve();
            $result = $provider->structured(
                'Summarize durable conversational context for NÜM Mission Tower. Preserve decisions, constraints, goals, unresolved references and established terminology. Omit credentials, secrets, approval requestState, raw student PII and transient chatter. Do not invent facts.',
                "PREVIOUS SUMMARY:\n".$this->policy->redactForMemory((string) $thread->summary)."\n\nMESSAGES:\n".json_encode($batch->map(fn ($m) => [
                    'role' => $m->role,
                    'type' => $m->type,
                    'content' => mb_substr($this->policy->redactForMemory((string) $m->content), 0, 6000),
                ])->values()->all(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'tower_chat_summary',
                [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => ['summary' => ['type' => 'string', 'maxLength' => $maxLength]],
                    'required' => ['summary'],
                ],
            );
            $summary = trim(mb_substr((string) ($result['summary'] ?? ''), 0, $maxLength));
            if ($summary === '') return;
            $thread->update(['summary' => $summary, 'summary_message_id' => $batch->last()->id]);
        } catch (Throwable) {
            // Rolling summary is best-effort; recent raw messages remain available.
        }
    }
}
