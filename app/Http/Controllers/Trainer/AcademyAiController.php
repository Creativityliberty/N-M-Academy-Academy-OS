<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Actions\Trainer\AcademyAi\ApplyAcademyAiRunAction;
use App\AI\AcademyAiCapabilityRegistry;
use App\AI\AcademyAiRunner;
use App\AI\AiProviderManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trainer\AcademyAiRunRequest;
use App\Models\AcademyAiRun;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class AcademyAiController extends Controller
{
    public function index(
        Request $request,
        AiProviderManager $providers,
        AcademyAiCapabilityRegistry $registry,
    ): Response {
        /** @var User $trainer */
        $trainer = $request->user();

        $courses = $trainer->courses()
            ->with('modules.lessons:id,module_id,title,content')
            ->orderBy('title')
            ->get(['id', 'title', 'status'])
            ->map(fn ($course) => [
                'id' => $course->id,
                'title' => $course->title,
                'status' => $course->status->value,
                'modules' => $course->modules->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'lessons' => $module->lessons->map(fn ($lesson) => [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'hasContent' => filled($lesson->content),
                    ])->values(),
                ])->values(),
            ])->values();

        $recentRuns = AcademyAiRun::query()
            ->where('user_id', $trainer->id)
            ->latest()
            ->limit(12)
            ->get()
            ->map(fn (AcademyAiRun $run) => $this->serializeRun($run));

        return Inertia::render('trainer/academy-ai/index', [
            'provider' => $providers->status(),
            'capabilities' => $registry->metadata(),
            'categories' => Category::query()->orderBy('order')->get(['id', 'name']),
            'courses' => $courses,
            'pages' => $trainer->academyPages()->orderBy('title')->get(['id','title','status'])->map(fn ($page) => ['id'=>$page->id,'title'=>$page->title,'status'=>$page->status])->values(),
            'recentRuns' => $recentRuns,
        ]);
    }

    public function run(AcademyAiRunRequest $request, AcademyAiRunner $runner): RedirectResponse
    {
        try {
            $runner->run(
                $request->user(),
                (string) $request->validated('capability'),
                (string) $request->validated('prompt'),
                (array) ($request->validated('input') ?? []),
            );

            return back()->with('success', 'Academy AI a terminé cette mission.');
        } catch (Throwable $error) {
            report($error);

            return back()->with('error', $error->getMessage());
        }
    }

    public function apply(
        Request $request,
        AcademyAiRun $run,
        ApplyAcademyAiRunAction $apply,
    ): RedirectResponse {
        try {
            $apply->handle($request->user(), $run);

            return back()->with('success', 'La proposition Academy AI a été appliquée.');
        } catch (Throwable $error) {
            report($error);

            return back()->with('error', $error->getMessage());
        }
    }

    /** @return array<string, mixed> */
    private function serializeRun(AcademyAiRun $run): array
    {
        return [
            'id' => $run->id,
            'capability' => $run->capability,
            'mode' => $run->mode,
            'prompt' => $run->prompt,
            'input' => $run->input ?? [],
            'output' => $run->output,
            'provider' => $run->provider,
            'model' => $run->model,
            'status' => $run->status,
            'error' => $run->error_message,
            'appliedAt' => $run->applied_at?->toIso8601String(),
            'createdAt' => $run->created_at?->toIso8601String(),
        ];
    }
}
