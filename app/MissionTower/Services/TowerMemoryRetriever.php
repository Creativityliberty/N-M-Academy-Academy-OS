<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Models\TowerMemory;
use App\Models\User;
use App\Tutor\EmbeddingProviderManager;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class TowerMemoryRetriever
{
    public function __construct(private readonly EmbeddingProviderManager $embeddings) {}

    /** @return list<array<string,mixed>> */
    public function retrieve(User $user, string $query, ?TowerChatThread $thread = null): array
    {
        if (! (bool) config('mission-tower.memory.enabled', true)) return [];
        $limit = max(1, min(20, (int) config('mission-tower.memory.max_context', 8)));
        $base = TowerMemory::query()
            ->where('owner_id', $user->id)
            ->where('status', 'active')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->where(function ($q) use ($thread): void {
                $q->where('scope', 'academy');
                if ($thread) $q->orWhere(fn ($inner) => $inner->where('scope', 'thread')->where('thread_id', $thread->id));
            });
        if (! (clone $base)->exists()) return [];

        $ranked = collect();
        $pinned = (clone $base)->where('pinned', true)->orderByDesc('importance')->latest()->limit(min(3, $limit))->get();
        foreach ($pinned as $item) $ranked->put($item->id, ['memory' => $item, 'score' => 10.0, 'method' => 'pinned']);

        foreach ($this->vectorMatches($user, $query, $thread, $limit) as $match) {
            $existing = $ranked->get($match['memory']->id);
            if (! $existing || $match['score'] > $existing['score']) $ranked->put($match['memory']->id, $match);
        }

        foreach ($this->lexicalMatches((clone $base)->limit(180)->get(), $query, $limit) as $match) {
            $existing = $ranked->get($match['memory']->id);
            if (! $existing || $match['score'] > $existing['score']) $ranked->put($match['memory']->id, $match);
        }

        $selected = $ranked->sortByDesc('score')->take($limit);
        $ids = $selected->keys()->values()->all();
        if ($ids !== []) {
            DB::table('tower_memories')->whereIn('id', $ids)->update(['last_accessed_at' => now()]);
            DB::table('tower_memories')->whereIn('id', $ids)->increment('access_count');
        }

        return $selected->map(fn (array $match): array => [
            'id' => $match['memory']->id,
            'key' => $match['memory']->memory_key,
            'category' => $match['memory']->category,
            'scope' => $match['memory']->scope,
            'content' => $match['memory']->content,
            'importance' => $match['memory']->importance,
            'pinned' => $match['memory']->pinned,
            'source_type' => $match['memory']->source_type,
            'retrieval' => $match['method'],
        ])->values()->all();
    }

    /** @return list<array{memory:TowerMemory,score:float,method:string}> */
    private function vectorMatches(User $user, string $query, ?TowerChatThread $thread, int $limit): array
    {
        if (! (bool) config('mission-tower.memory.semantic', true) || DB::connection()->getDriverName() !== 'pgsql') return [];
        try {
            $provider = $this->embeddings->provider();
            if (! $provider->configured()) return [];
            $vector = json_encode($provider->embed($query), JSON_PRESERVE_ZERO_FRACTION | JSON_THROW_ON_ERROR);
            $threadSql = $thread ? ' OR (scope = \'thread\' AND thread_id = ?)' : '';
            $sql = "SELECT id, (1 - (embedding <=> ?::vector)) AS score FROM tower_memories WHERE owner_id = ? AND status = 'active' AND embedding IS NOT NULL AND (expires_at IS NULL OR expires_at > NOW()) AND (scope = 'academy'{$threadSql}) ORDER BY embedding <=> ?::vector LIMIT ?";
            $bindings = [$vector, $user->id];
            if ($thread) $bindings[] = $thread->id;
            $bindings[] = $vector;
            $bindings[] = max($limit, 6);
            $rows = DB::select($sql, $bindings);
            $memories = TowerMemory::query()->whereIn('id', array_map(fn ($row) => $row->id, $rows))->get()->keyBy('id');
            return array_values(array_filter(array_map(function ($row) use ($memories): ?array {
                $memory = $memories->get($row->id);
                if (! $memory) return null;
                return ['memory' => $memory, 'score' => max(0.0, (float) $row->score) * 4.0 + ($memory->importance * 0.08), 'method' => 'vector'];
            }, $rows)));
        } catch (Throwable) {
            return [];
        }
    }

    /** @param Collection<int,TowerMemory> $memories @return list<array{memory:TowerMemory,score:float,method:string}> */
    private function lexicalMatches(Collection $memories, string $query, int $limit): array
    {
        $queryTokens = $this->tokens($query);
        $now = now();
        return $memories->map(function (TowerMemory $memory) use ($queryTokens, $now): array {
            $tokens = $this->tokens($memory->memory_key.' '.$memory->content);
            $overlap = count(array_intersect($queryTokens, $tokens));
            $coverage = $queryTokens === [] ? 0.0 : $overlap / max(1, count($queryTokens));
            $recency = max(0.0, 1.0 - min(365, $memory->updated_at?->diffInDays($now) ?? 365) / 365);
            $score = ($coverage * 3.0) + ($memory->importance * 0.12) + ($recency * 0.25) + ($memory->pinned ? 2.0 : 0.0);
            return ['memory' => $memory, 'score' => $score, 'method' => 'lexical'];
        })->filter(fn (array $match) => $match['score'] > 0.35)->sortByDesc('score')->take(max($limit, 8))->values()->all();
    }

    /** @return list<string> */
    private function tokens(string $value): array
    {
        $parts = preg_split('/[^\pL\pN]+/u', mb_strtolower($value), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        return array_values(array_unique(array_filter($parts, fn (string $part) => mb_strlen($part) >= 3)));
    }
}
