<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\AI\AiProviderManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trainer\StartCourseCreationRequest;
use App\Models\Category;
use App\Models\CourseCreationRun;
use App\Models\User;
use App\Services\Courses\CourseCreationEngine;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseCreationController extends Controller
{
    public function index(Request $request, AiProviderManager $providers): Response
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $runId = (int) $request->integer('run');

        $activeRun = null;
        if ($runId > 0) {
            $activeRun = CourseCreationRun::query()
                ->with(['course.modules.lessons', 'page', 'offer'])
                ->where('user_id', $trainer->id)
                ->findOrFail($runId);
        }

        $recentRuns = CourseCreationRun::query()
            ->where('user_id', $trainer->id)
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (CourseCreationRun $run) => [
                'id' => $run->id,
                'brief' => $run->brief,
                'status' => $run->status,
                'progressPercent' => $run->progress_percent,
                'createdAt' => $run->created_at?->toIso8601String(),
                'url' => route('trainer.course-creation.index', ['run' => $run->id]),
            ])
            ->values();

        return Inertia::render('trainer/academy-ai/course-creation', [
            'provider' => $providers->status(),
            'categories' => Category::query()->orderBy('order')->get(['id', 'name']),
            'activeRun' => $activeRun ? $this->serializeRun($activeRun) : null,
            'recentRuns' => $recentRuns,
        ]);
    }

    public function start(StartCourseCreationRequest $request, CourseCreationEngine $engine): RedirectResponse
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $run = $engine->start($trainer, $request->validated());

        return redirect()->route('trainer.course-creation.index', ['run' => $run->id]);
    }

    public function retry(Request $request, CourseCreationRun $run, CourseCreationEngine $engine): JsonResponse
    {
        @ini_set('max_execution_time', '0');
        if (function_exists('set_time_limit')) {
            @set_time_limit(0);
        }

        /** @var User $trainer */
        $trainer = $request->user();
        if ($run->user_id !== $trainer->id) {
            throw new AuthorizationException('Cette génération de formation ne vous appartient pas.');
        }

        return response()->json(['run' => $this->serializeRun($engine->resume($trainer, $run, true))]);
    }

    public function advance(Request $request, CourseCreationRun $run, CourseCreationEngine $engine): JsonResponse
    {
        @ini_set('max_execution_time', '0');
        if (function_exists('set_time_limit')) {
            @set_time_limit(0);
        }

        /** @var User $trainer */
        $trainer = $request->user();
        if ($run->user_id !== $trainer->id) {
            throw new AuthorizationException('Cette génération de formation ne vous appartient pas.');
        }

        $advanced = $engine->advance($trainer, $run);

        return response()->json(['run' => $this->serializeRun($advanced)]);
    }

    /** @return array<string,mixed> */
    private function serializeRun(CourseCreationRun $run): array
    {
        $run->loadMissing(['course.modules.lessons', 'page', 'offer']);
        $course = $run->course;
        $page = $run->page;
        $offer = $run->offer;

        return [
            'id' => $run->id,
            'brief' => $run->brief,
            'options' => $run->options ?? [],
            'state' => $run->state ?? [],
            'status' => $run->status,
            'currentStep' => $run->current_step,
            'stepStatus' => $run->step_status,
            'progressPercent' => $run->progress_percent,
            'error' => $run->error_message,
            'advanceUrl' => route('trainer.course-creation.advance', $run, false),
            'retryUrl' => route('trainer.course-creation.retry', $run, false),
            'reviewUrl' => route('trainer.course-review.show', $run, false),
            'course' => $course ? [
                'id' => $course->id,
                'title' => $course->title,
                'status' => $course->status->value,
                'image' => $course->image,
                'thumbnail' => $course->thumbnail,
                'moduleCount' => $course->modules->count(),
                'lessonCount' => $course->modules->sum(fn ($module) => $module->lessons->count()),
                'editUrl' => route('trainer.courses.edit', $course),
            ] : null,
            'offer' => $offer ? [
                'id' => $offer->id,
                'name' => $offer->name,
                'amount' => $offer->amount,
                'currency' => $offer->currency,
                'billingType' => $offer->billing_type,
            ] : null,
            'page' => $page ? [
                'id' => $page->id,
                'title' => $page->title,
                'status' => $page->status,
                'editUrl' => route('trainer.pages.edit', $page),
                'previewUrl' => route('trainer.pages.preview', $page),
            ] : null,
            'createdAt' => $run->created_at?->toIso8601String(),
            'completedAt' => $run->completed_at?->toIso8601String(),
        ];
    }
}
