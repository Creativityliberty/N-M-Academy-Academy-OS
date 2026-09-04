<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerRun;
use App\MissionTower\Services\TowerAccess;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RunController extends Controller
{
    public function __construct(private readonly TowerAccess $access) {}

    public function index(Request $request): Response
    {
        $runs = $this->access->runQuery($request->user())
            ->with(['mission:id,title,owner_id', 'trigger:id,name'])
            ->withCount(['approvals', 'evidence'])
            ->latest()
            ->paginate(30)
            ->through(fn (TowerRun $run) => [
                'id' => $run->id,
                'mission' => ['id' => $run->mission->id, 'title' => $run->mission->title],
                'status' => $run->status,
                'attempt' => $run->attempt,
                'triggeredBy' => $run->trigger?->name,
                'approvalsCount' => $run->approvals_count,
                'evidenceCount' => $run->evidence_count,
                'summary' => $run->summary,
                'errorMessage' => $run->error_message,
                'startedAt' => $run->started_at?->toIso8601String(),
                'completedAt' => $run->completed_at?->toIso8601String(),
                'createdAt' => $run->created_at?->toIso8601String(),
            ]);

        return Inertia::render('mission-tower/runs', ['runs' => $runs]);
    }
}
