<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerChatMessage;
use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Models\TowerMemory;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerRun;
use App\Models\User;
use App\Tutor\EmbeddingProviderManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class TowerMemoryStore
{
    public function __construct(
        private readonly TowerMemoryPolicy $policy,
        private readonly EmbeddingProviderManager $embeddings,
    ) {}

    /** @param list<array<string,mixed>> $candidates */
    public function rememberCandidates(User $user, TowerChatThread $thread, TowerChatMessage $sourceMessage, array $candidates): void
    {
        if (! (bool) config('mission-tower.memory.enabled', true)) return;

        foreach (array_slice($candidates, 0, 5) as $candidate) {
            $clean = $this->policy->sanitizeCandidate((array) $candidate);
            if ($clean === null) continue;
            try {
                $this->remember($user, $clean, [
                    'thread_id' => $thread->id,
                    'source_message_id' => $sourceMessage->id,
                    'source_type' => 'chat',
                ]);
            } catch (Throwable) {
                // Memory is best-effort and must never make Tower Chat unavailable.
            }
        }
    }

    public function rememberMissionResult(TowerMission $mission, TowerRun $run, TowerChatMessage $message): ?TowerMemory
    {
        if (! (bool) config('mission-tower.memory.enabled', true) || $run->status !== 'completed') return null;
        $owner = $mission->owner()->first();
        if (! $owner) return null;

        $content = 'Mission « '.$mission->title.' » terminée. '.mb_substr($this->policy->redactForMemory($message->content), 0, 3200);
        $clean = $this->policy->sanitizeCandidate([
            'key' => 'mission-result-'.$mission->id,
            'category' => 'result',
            'scope' => 'academy',
            'content' => $content,
            'importance' => 4,
        ]);
        if ($clean === null) return null;

        return $this->remember($owner, $clean, [
            'thread_id' => (int) data_get($mission->metadata, 'chat_thread_id') ?: null,
            'mission_id' => $mission->id,
            'run_id' => $run->id,
            'source_message_id' => $message->id,
            'source_type' => 'mission_result',
            'metadata' => ['run_status' => $run->status],
        ]);
    }

    /** @param array<string,mixed> $memory @param array<string,mixed> $source */
    private function remember(User $user, array $memory, array $source): TowerMemory
    {
        $days = $memory['scope'] === 'thread'
            ? (int) config('mission-tower.memory.thread_retention_days', 30)
            : (int) config('mission-tower.memory.retention_days', 365);

        $created = DB::transaction(function () use ($user, $memory, $source, $days): TowerMemory {
            $query = TowerMemory::query()
                ->where('owner_id', $user->id)
                ->where('scope', $memory['scope'])
                ->where('memory_key', $memory['key'])
                ->where('status', 'active');
            if ($memory['scope'] === 'thread') {
                $query->where('thread_id', $source['thread_id'] ?? null);
            }

            /** @var TowerMemory|null $previous */
            $previous = $query->latest('id')->lockForUpdate()->first();
            if ($previous && $this->normalize($previous->content) === $this->normalize((string) $memory['content'])) {
                $previous->update([
                    'importance' => max($previous->importance, (int) $memory['importance']),
                    'source_message_id' => $source['source_message_id'] ?? $previous->source_message_id,
                    'expires_at' => $previous->pinned || $days <= 0 ? null : now()->addDays($days),
                    'updated_at' => now(),
                ]);
                return $previous;
            }

            $carryPin = (bool) ($previous?->pinned ?? false);
            if ($previous) $previous->update(['status' => 'superseded', 'pinned' => false]);

            return TowerMemory::create([
                'memory_uuid' => (string) Str::uuid(),
                'owner_id' => $user->id,
                'thread_id' => $source['thread_id'] ?? null,
                'mission_id' => $source['mission_id'] ?? null,
                'run_id' => $source['run_id'] ?? null,
                'source_message_id' => $source['source_message_id'] ?? null,
                'supersedes_id' => $previous?->id,
                'memory_key' => $memory['key'],
                'category' => $memory['category'],
                'scope' => $memory['scope'],
                'status' => 'active',
                'content' => $memory['content'],
                'importance' => $memory['importance'],
                'pinned' => $carryPin,
                'source_type' => $source['source_type'] ?? 'chat',
                'metadata' => $source['metadata'] ?? null,
                'expires_at' => $carryPin || $days <= 0 ? null : now()->addDays($days),
            ]);
        });

        $this->attachEmbedding($created);
        return $created->fresh();
    }

    private function attachEmbedding(TowerMemory $memory): void
    {
        if (! (bool) config('mission-tower.memory.semantic', true)) return;
        try {
            $provider = $this->embeddings->provider();
            if (! $provider->configured()) return;
            $vector = $provider->embed($memory->content);
            if ($vector === []) return;
            $encoded = json_encode(array_values($vector), JSON_PRESERVE_ZERO_FRACTION | JSON_THROW_ON_ERROR);
            if (DB::connection()->getDriverName() === 'pgsql') {
                DB::statement('UPDATE tower_memories SET embedding = ?::vector WHERE id = ?', [$encoded, $memory->id]);
            } else {
                TowerMemory::query()->whereKey($memory->id)->update(['embedding' => $encoded]);
            }
        } catch (Throwable) {
            // Lexical retrieval remains available if embeddings fail.
        }
    }

    private function normalize(string $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', mb_strtolower($value)) ?? mb_strtolower($value));
    }
}
