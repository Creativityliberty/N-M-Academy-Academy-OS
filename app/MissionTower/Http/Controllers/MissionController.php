<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Services\MissionRunner;
use App\MissionTower\Services\TowerAccess;
use App\MissionTower\Services\TowerToolCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MissionController extends Controller
{
    public function __construct(
        private readonly TowerAccess $access,
        private readonly TowerToolCatalog $tools,
        private readonly MissionRunner $runner,
    ) {}

    public function index(Request $request): Response
    {
        $missions = $this->access->missionQuery($request->user())
            ->withCount(['steps', 'runs', 'approvals'])
            ->with(['runs' => fn ($query) => $query->limit(1)])
            ->latest()
            ->paginate(20)
            ->through(fn (TowerMission $mission) => $this->missionDto($mission));

        $toolList = [];
        $toolError = null;
        try {
            $toolList = array_values(array_filter($this->tools->keyed(), fn (array $tool): bool => ($tool['scope'] ?? 'academy') === 'academy'));
        } catch (Throwable $error) {
            $toolError = $error->getMessage();
        }

        return Inertia::render('mission-tower/missions/index', [
            'missions' => $missions,
            'tools' => $toolList,
            'toolError' => $toolError,
            'limits' => ['maxSteps' => (int) config('mission-tower.limits.max_mission_steps', 24)],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $maxSteps = max(1, (int) config('mission-tower.limits.max_mission_steps', 24));
        $data = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:180'],
            'objective' => ['required', 'string', 'min:10', 'max:10000'],
            'priority' => ['required', Rule::in(['low', 'normal', 'high'])],
            'steps' => ['required', 'array', 'min:1', 'max:'.$maxSteps],
            'steps.*.tool' => ['required', 'string', 'max:190'],
            'steps.*.arguments' => ['nullable', 'array'],
        ]);

        $catalog = $this->tools->keyed();
        foreach ($data['steps'] as $index => $step) {
            if (! isset($catalog[$step['tool']]) || ($catalog[$step['tool']]['scope'] ?? 'academy') !== 'academy') {
                throw \Illuminate\Validation\ValidationException::withMessages(['steps.'.($index).'.tool' => 'Tool MCP indisponible pour ce token Tower.']);
            }
        }

        $mission = DB::transaction(function () use ($request, $data, $catalog): TowerMission {
            $mission = TowerMission::create([
                'owner_id' => $request->user()->id,
                'title' => $data['title'],
                'objective' => $data['objective'],
                'priority' => $data['priority'],
                'status' => 'draft',
                'source' => 'manual',
                'metadata' => ['created_from' => 'mission_tower'],
            ]);

            foreach ($data['steps'] as $index => $step) {
                $definition = $catalog[$step['tool']];
                $mission->steps()->create([
                    'position' => $index + 1,
                    'title' => $definition['title'],
                    'tool' => $step['tool'],
                    'risk' => $definition['risk'],
                    'arguments' => $step['arguments'] ?? [],
                    'status' => 'pending',
                ]);
            }

            return $mission;
        });

        return redirect()->route('tower.missions.show', $mission)->with('success', 'Mission créée en brouillon.');
    }

    public function show(Request $request, TowerMission $mission): Response
    {
        $this->access->assertMission($request->user(), $mission);
        $mission->load([
            'owner:id,name,email',
            'steps',
            'runs' => fn ($query) => $query->with('trigger:id,name')->limit(20),
            'approvals' => fn ($query) => $query->with('decidedBy:id,name')->limit(20),
            'evidence' => fn ($query) => $query->limit(30),
        ]);

        return Inertia::render('mission-tower/missions/show', [
            'mission' => $this->missionDetailDto($mission),
        ]);
    }

    public function run(Request $request, TowerMission $mission): RedirectResponse
    {
        $this->access->assertMission($request->user(), $mission);
        if ($mission->steps()->doesntExist()) {
            return back()->withErrors(['mission' => 'Cette mission ne contient aucune étape.']);
        }

        try {
            $run = $this->runner->start($mission, $request->user());
        } catch (Throwable $error) {
            return back()->withErrors(['mission' => $error->getMessage()]);
        }

        return redirect()->route('tower.missions.show', $mission)->with('success', match ($run->status) {
            'awaiting_approval' => 'Mission en attente de validation.',
            'completed' => 'Mission terminée.',
            default => 'Mission exécutée.',
        });
    }

    /** @return array<string, mixed> */
    private function missionDto(TowerMission $mission): array
    {
        return [
            'id' => $mission->id,
            'title' => $mission->title,
            'objective' => $mission->objective,
            'status' => $mission->status,
            'priority' => $mission->priority,
            'stepsCount' => $mission->steps_count,
            'runsCount' => $mission->runs_count,
            'approvalsCount' => $mission->approvals_count,
            'latestRun' => $mission->runs->first() ? [
                'id' => $mission->runs->first()->id,
                'status' => $mission->runs->first()->status,
                'createdAt' => $mission->runs->first()->created_at?->toIso8601String(),
            ] : null,
            'createdAt' => $mission->created_at?->toIso8601String(),
        ];
    }

    /** @return array<string, mixed> */
    private function missionDetailDto(TowerMission $mission): array
    {
        return [
            'id' => $mission->id,
            'title' => $mission->title,
            'objective' => $mission->objective,
            'status' => $mission->status,
            'priority' => $mission->priority,
            'source' => $mission->source,
            'owner' => $mission->owner ? ['id' => $mission->owner->id, 'name' => $mission->owner->name] : null,
            'createdAt' => $mission->created_at?->toIso8601String(),
            'startedAt' => $mission->started_at?->toIso8601String(),
            'completedAt' => $mission->completed_at?->toIso8601String(),
            'steps' => $mission->steps->map(fn ($step) => [
                'id' => $step->id,
                'position' => $step->position,
                'title' => $step->title,
                'tool' => $step->tool,
                'risk' => $step->risk,
                'arguments' => $step->arguments ?? [],
                'status' => $step->status,
                'result' => $step->result,
                'errorMessage' => $step->error_message,
            ])->values(),
            'runs' => $mission->runs->map(fn ($run) => [
                'id' => $run->id,
                'status' => $run->status,
                'attempt' => $run->attempt,
                'triggeredBy' => $run->trigger?->name,
                'summary' => $run->summary,
                'errorMessage' => $run->error_message,
                'startedAt' => $run->started_at?->toIso8601String(),
                'completedAt' => $run->completed_at?->toIso8601String(),
            ])->values(),
            'approvals' => $mission->approvals->map(fn ($approval) => [
                'id' => $approval->id,
                'tool' => $approval->tool,
                'risk' => $approval->risk,
                'status' => $approval->status,
                'message' => $approval->message,
                'requiredPhrase' => $approval->required_phrase,
                'receiptId' => $approval->receipt_id,
                'decidedBy' => $approval->decidedBy?->name,
                'expiresAt' => $approval->expires_at?->toIso8601String(),
                'decidedAt' => $approval->decided_at?->toIso8601String(),
            ])->values(),
            'evidence' => $mission->evidence->map(fn ($item) => [
                'id' => $item->id,
                'uuid' => $item->evidence_uuid,
                'type' => $item->type,
                'status' => $item->status,
                'source' => $item->source,
                'receiptId' => $item->receipt_id,
                'summary' => $item->summary,
                'recordedAt' => $item->recorded_at?->toIso8601String(),
            ])->values(),
        ];
    }
}
