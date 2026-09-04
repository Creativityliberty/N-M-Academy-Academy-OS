<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerInsight;
use App\MissionTower\Models\TowerObservatorySnapshot;
use App\MissionTower\Services\InsightMissionFactory;
use App\MissionTower\Services\ObservatoryService;
use App\MissionTower\Services\TowerTokenOwnerResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InsightsController extends Controller
{
    public function __construct(
        private readonly TowerTokenOwnerResolver $owners,
        private readonly ObservatoryService $observatory,
        private readonly InsightMissionFactory $missions,
    ) {}

    public function index(Request $request): Response
    {
        $owner = $this->owners->resolve();
        if ($request->user()->id !== $owner->id && ! $request->user()->hasAnyRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $latest = TowerObservatorySnapshot::query()->where('owner_id', $owner->id)->latest('captured_at')->first();
        $insights = TowerInsight::query()->where('owner_id', $owner->id)->latest('last_seen_at')->paginate(30)->through(fn (TowerInsight $insight) => [
            'id' => $insight->id,
            'rule' => $insight->rule,
            'domain' => $insight->domain,
            'severity' => $insight->severity,
            'status' => $insight->status,
            'title' => $insight->title,
            'summary' => $insight->summary,
            'metricKey' => $insight->metric_key,
            'currentValue' => $insight->current_value,
            'baselineValue' => $insight->baseline_value,
            'deltaPercent' => $insight->delta_percent,
            'context' => $insight->context,
            'missionId' => $insight->mission_id,
            'firstSeenAt' => $insight->first_seen_at?->toIso8601String(),
            'lastSeenAt' => $insight->last_seen_at?->toIso8601String(),
        ]);

        return Inertia::render('mission-tower/insights', [
            'snapshot' => $latest ? [
                'id' => $latest->id,
                'status' => $latest->status,
                'metrics' => $latest->metrics,
                'errors' => $latest->errors,
                'capturedAt' => $latest->captured_at?->toIso8601String(),
            ] : null,
            'insights' => $insights,
            'observatory' => [
                'enabled' => (bool) config('mission-tower.observatory.enabled', true),
                'schedule' => '15 min',
            ],
        ]);
    }

    public function observe(Request $request): RedirectResponse
    {
        try {
            $owner = $this->owners->resolve();
            if ($request->user()->id !== $owner->id && ! $request->user()->hasAnyRole(['admin', 'super-admin'])) abort(403);
            $snapshot = $this->observatory->observe($owner);
            return back()->with('success', "Observation #{$snapshot->id} terminée.");
        } catch (Throwable $error) {
            return back()->withErrors(['observatory' => $error->getMessage()]);
        }
    }

    public function mission(Request $request, TowerInsight $insight): RedirectResponse
    {
        $owner = $this->owners->resolve();
        if ($insight->owner_id !== $owner->id || ($request->user()->id !== $owner->id && ! $request->user()->hasAnyRole(['admin', 'super-admin']))) abort(403);
        try {
            $mission = $this->missions->create($insight, $request->user());
            return redirect()->route('tower.missions.show', $mission)->with('success', 'Mission recommandée créée en brouillon.');
        } catch (Throwable $error) {
            return back()->withErrors(['mission' => $error->getMessage()]);
        }
    }
}
