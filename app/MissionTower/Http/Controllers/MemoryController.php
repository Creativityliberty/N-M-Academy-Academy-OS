<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerMemory;
use App\MissionTower\Services\TowerAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemoryController extends Controller
{
    public function __construct(private readonly TowerAccess $access) {}

    public function index(Request $request): Response
    {
        $query = $this->access->memoryQuery($request->user());
        $status = $request->string('status')->toString();
        $category = $request->string('category')->toString();
        if (in_array($status, ['active', 'superseded', 'forgotten'], true)) $query->where('status', $status);
        if (in_array($category, ['preference', 'decision', 'goal', 'constraint', 'result', 'context'], true)) $query->where('category', $category);

        $memories = $query->orderByDesc('pinned')->orderByDesc('importance')->latest()->paginate(40)->withQueryString()->through(fn (TowerMemory $memory) => [
            'id' => $memory->id,
            'uuid' => $memory->memory_uuid,
            'key' => $memory->memory_key,
            'category' => $memory->category,
            'scope' => $memory->scope,
            'status' => $memory->status,
            'content' => $memory->content,
            'importance' => $memory->importance,
            'pinned' => $memory->pinned,
            'sourceType' => $memory->source_type,
            'accessCount' => $memory->access_count,
            'lastAccessedAt' => $memory->last_accessed_at?->toIso8601String(),
            'expiresAt' => $memory->expires_at?->toIso8601String(),
            'createdAt' => $memory->created_at?->toIso8601String(),
        ]);

        return Inertia::render('mission-tower/memory', [
            'memories' => $memories,
            'filters' => ['status' => $status, 'category' => $category],
        ]);
    }

    public function pin(Request $request, TowerMemory $memory): RedirectResponse
    {
        $this->access->assertMemory($request->user(), $memory);
        if ($memory->status !== 'active') return back()->withErrors(['memory' => 'Seule une mémoire active peut être épinglée.']);
        $nextPinned = ! $memory->pinned;
        $days = $memory->scope === 'thread'
            ? (int) config('mission-tower.memory.thread_retention_days', 30)
            : (int) config('mission-tower.memory.retention_days', 365);
        $memory->update([
            'pinned' => $nextPinned,
            'expires_at' => $nextPinned || $days <= 0 ? null : now()->addDays($days),
        ]);
        return back();
    }

    public function forget(Request $request, TowerMemory $memory): RedirectResponse
    {
        $this->access->assertMemory($request->user(), $memory);
        $memory->update(['status' => 'forgotten', 'pinned' => false]);
        return back();
    }
}
