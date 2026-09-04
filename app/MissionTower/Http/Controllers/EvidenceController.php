<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerEvidence;
use App\MissionTower\Services\TowerAccess;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvidenceController extends Controller
{
    public function __construct(private readonly TowerAccess $access) {}

    public function index(Request $request): Response
    {
        $evidence = $this->access->evidenceQuery($request->user())
            ->with(['mission:id,title,owner_id', 'step:id,title,tool'])
            ->latest('recorded_at')
            ->paginate(40)
            ->through(fn (TowerEvidence $item) => [
                'id' => $item->id,
                'uuid' => $item->evidence_uuid,
                'mission' => ['id' => $item->mission->id, 'title' => $item->mission->title],
                'stepTitle' => $item->step?->title,
                'tool' => $item->step?->tool,
                'type' => $item->type,
                'status' => $item->status,
                'source' => $item->source,
                'receiptId' => $item->receipt_id,
                'summary' => $item->summary,
                'recordedAt' => $item->recorded_at?->toIso8601String(),
                'payload' => $item->payload,
            ]);

        return Inertia::render('mission-tower/evidence', ['evidence' => $evidence]);
    }
}
