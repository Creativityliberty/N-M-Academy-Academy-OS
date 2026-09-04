<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerCompilation;
use App\MissionTower\Services\CompilationApplyService;
use App\MissionTower\Services\MissionCompiler;
use App\MissionTower\Services\TowerAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MissionCompilerController extends Controller
{
    public function __construct(
        private readonly TowerAccess $access,
        private readonly MissionCompiler $compiler,
        private readonly CompilationApplyService $apply,
    ) {}

    public function index(Request $request): Response
    {
        $recent = $this->access->compilationQuery($request->user())
            ->with('mission:id,title,status')
            ->latest()
            ->limit(12)
            ->get()
            ->map(fn (TowerCompilation $item) => $this->dto($item));

        return Inertia::render('mission-tower/compiler', [
            'compilation' => null,
            'recentCompilations' => $recent,
            'maxPromptLength' => 12000,
        ]);
    }

    public function compile(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'prompt' => ['required', 'string', 'min:10', 'max:12000'],
        ]);

        try {
            $compilation = $this->compiler->compile($request->user(), $data['prompt']);
        } catch (Throwable $error) {
            return back()->withErrors(['prompt' => $error->getMessage()]);
        }

        return redirect()->route('tower.compiler.show', $compilation);
    }

    public function show(Request $request, TowerCompilation $compilation): Response
    {
        $this->access->assertCompilation($request->user(), $compilation);
        $compilation->load('mission:id,title,status');

        $recent = $this->access->compilationQuery($request->user())
            ->where('id', '!=', $compilation->id)
            ->with('mission:id,title,status')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (TowerCompilation $item) => $this->dto($item));

        return Inertia::render('mission-tower/compiler', [
            'compilation' => $this->dto($compilation),
            'recentCompilations' => $recent,
            'maxPromptLength' => 12000,
        ]);
    }

    public function apply(Request $request, TowerCompilation $compilation): RedirectResponse
    {
        $this->access->assertCompilation($request->user(), $compilation);

        try {
            $mission = $this->apply->apply($compilation, $request->user());
        } catch (Throwable $error) {
            return back()->withErrors(['compilation' => $error->getMessage()]);
        }

        return redirect()->route('tower.missions.show', $mission)->with('success', 'Proposition compilée en mission brouillon. Vérifiez-la avant exécution.');
    }

    /** @return array<string, mixed> */
    private function dto(TowerCompilation $compilation): array
    {
        return [
            'id' => $compilation->id,
            'status' => $compilation->status,
            'prompt' => $compilation->prompt,
            'provider' => $compilation->provider,
            'model' => $compilation->model,
            'proposal' => $compilation->proposal,
            'warnings' => $compilation->warnings ?? [],
            'errorMessage' => $compilation->error_message,
            'mission' => $compilation->mission ? [
                'id' => $compilation->mission->id,
                'title' => $compilation->mission->title,
                'status' => $compilation->mission->status,
            ] : null,
            'appliedAt' => $compilation->applied_at?->toIso8601String(),
            'createdAt' => $compilation->created_at?->toIso8601String(),
        ];
    }
}
