<?php

declare(strict_types=1);

namespace App\Http\Controllers\MissionTower;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerEvidence;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerRun;
use App\MissionTower\Services\TowerAccess;
use App\MissionTower\Services\TowerReadiness;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends Controller
{
    public function __construct(
        private readonly TowerReadiness $readiness,
        private readonly TowerAccess $access,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $missions = $this->access->missionQuery($user);
        $runs = $this->access->runQuery($user);
        $approvals = $this->access->approvalQuery($user);
        $evidence = $this->access->evidenceQuery($user);
        $insights = $this->access->insightQuery($user);
        $snapshots = $this->access->snapshotQuery($user);
        $latestSnapshot = (clone $snapshots)->latest('captured_at')->first();

        return Inertia::render('mission-tower/overview', [
            'readiness' => $this->readiness->snapshot($request->boolean('probe')),
            'observatory' => [
                'openInsights' => (clone $insights)->whereIn('status', ['open', 'mission_created'])->count(),
                'capturedAt' => $latestSnapshot?->captured_at?->toIso8601String(),
                'status' => $latestSnapshot?->status,
                'metrics' => $latestSnapshot?->metrics,
                'topInsights' => (clone $insights)->whereIn('status', ['open', 'mission_created'])->orderByRaw("CASE severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END")->latest('last_seen_at')->limit(4)->get()->map(fn ($insight) => [
                    'id' => $insight->id, 'title' => $insight->title, 'summary' => $insight->summary, 'severity' => $insight->severity, 'domain' => $insight->domain, 'missionId' => $insight->mission_id,
                ]),
            ],
            'operations' => [
                'missions' => (clone $missions)->count(),
                'activeMissions' => (clone $missions)->whereIn('status', ['running', 'awaiting_approval'])->count(),
                'pendingApprovals' => (clone $approvals)->where('status', 'pending')->count(),
                'runs' => (clone $runs)->count(),
                'evidence' => (clone $evidence)->count(),
                'recentMissions' => (clone $missions)->latest()->limit(5)->get(['id', 'title', 'status', 'priority', 'updated_at'])->map(fn (TowerMission $mission) => [
                    'id' => $mission->id,
                    'title' => $mission->title,
                    'status' => $mission->status,
                    'priority' => $mission->priority,
                    'updatedAt' => $mission->updated_at?->toIso8601String(),
                ]),
                'recentEvidence' => (clone $evidence)->latest('recorded_at')->limit(5)->get()->map(fn (TowerEvidence $item) => [
                    'id' => $item->id,
                    'missionId' => $item->mission_id,
                    'type' => $item->type,
                    'status' => $item->status,
                    'summary' => $item->summary,
                    'recordedAt' => $item->recorded_at?->toIso8601String(),
                ]),
            ],
        ]);
    }
}
