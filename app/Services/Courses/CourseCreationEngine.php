<?php

declare(strict_types=1);

namespace App\Services\Courses;

use App\Actions\Trainer\AcademyAi\ApplyAcademyAiRunAction;
use App\AI\AcademyAiRunner;
use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyAiRun;
use App\Models\AcademyPage;
use App\Models\Course;
use App\Models\CourseCreationRun;
use App\Models\CourseOffer;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class CourseCreationEngine
{
    private const STALE_STEP_MINUTES = 2;

    /** @var array<string, int> */
    private const BASE_PROGRESS = [
        'blueprint' => 5,
        'materialize' => 18,
        'assessments' => 22,
        'assignments' => 32,
        'cover' => 44,
        'thumbnail' => 50,
        'narrations' => 60,
        'offer' => 82,
        'landing' => 91,
        'review' => 97,
    ];

    public function __construct(
        private readonly AcademyAiRunner $ai,
        private readonly ApplyAcademyAiRunAction $applyAi,
        private readonly CourseMediaGenerationService $media,
    ) {}

    /** @param array<string,mixed> $input */
    public function start(User $trainer, array $input): CourseCreationRun
    {
        $options = [
            'category_id' => (int) $input['category_id'],
            'audience' => trim((string) ($input['audience'] ?? '')),
            'outcome' => trim((string) ($input['outcome'] ?? '')),
            'weeks' => isset($input['weeks']) ? (int) $input['weeks'] : null,
            'price_major' => isset($input['price_major']) ? (float) $input['price_major'] : null,
            'currency' => strtoupper(trim((string) ($input['currency'] ?? 'EUR'))),
            'generate_assessments' => (bool) ($input['generate_assessments'] ?? true),
            'generate_assignments' => (bool) ($input['generate_assignments'] ?? true),
            'generate_cover' => (bool) ($input['generate_cover'] ?? true),
            'generate_thumbnail' => (bool) ($input['generate_thumbnail'] ?? true),
            'generate_audio' => (bool) ($input['generate_audio'] ?? false),
            'generate_landing' => (bool) ($input['generate_landing'] ?? true),
            'voice' => trim((string) ($input['voice'] ?? '')) ?: null,
        ];

        return CourseCreationRun::create([
            'user_id' => $trainer->id,
            'brief' => trim((string) $input['brief']),
            'options' => $options,
            'state' => [
                'steps' => collect(CourseCreationRun::STEPS)->mapWithKeys(fn (string $step) => [$step => [
                    'status' => 'pending',
                    'detail' => null,
                    'reason' => null,
                ]])->all(),
                'assessments' => ['eligible' => 0, 'generated' => 0, 'generated_module_ids' => [], 'assessment_ids' => []],
                'assignments' => ['eligible' => 0, 'generated' => 0, 'generated_module_ids' => [], 'assignment_ids' => []],
                'narrations' => ['eligible' => 0, 'generated' => 0],
            ],
            'status' => 'running',
            'current_step' => 'blueprint',
            'step_status' => 'pending',
            'progress_percent' => 0,
            'started_at' => now(),
        ]);
    }

    public function resume(User $trainer, CourseCreationRun $run, bool $force = false): CourseCreationRun
    {
        $owned = $this->ownedRun($trainer, $run->id);
        if (! $owned->isFailed() && ! $force && ! ($owned->step_status === 'running' && $owned->step_started_at?->lt(now()->subSeconds(45)))) {
            return $owned;
        }

        $state = (array) $owned->state;
        data_set($state, 'steps.'.$owned->current_step.'.status', 'pending');
        data_set($state, 'steps.'.$owned->current_step.'.detail', 'Relance de l’étape…');
        data_set($state, 'steps.'.$owned->current_step.'.reason', null);
        $owned->update([
            'state' => $state,
            'status' => 'running',
            'step_status' => 'pending',
            'step_started_at' => null,
            'error_message' => null,
        ]);

        return $this->ownedRun($trainer, $run->id);
    }

    public function advance(User $trainer, CourseCreationRun $run): CourseCreationRun
    {
        @ini_set('max_execution_time', '0');
        if (function_exists('set_time_limit')) {
            @set_time_limit(0);
        }

        $run = $this->ownedRun($trainer, $run->id);

        if ($run->isComplete() || $run->isFailed()) {
            return $run;
        }

        $claimed = $this->claimStep($trainer, $run->id);
        if (! $claimed) {
            return $this->ownedRun($trainer, $run->id);
        }

        $step = $claimed->current_step;

        try {
            match ($step) {
                'blueprint' => $this->advanceBlueprint($trainer, $claimed),
                'materialize' => $this->advanceMaterialize($trainer, $claimed),
                'assessments' => $this->advanceAssessments($trainer, $claimed),
                'assignments' => $this->advanceAssignments($trainer, $claimed),
                'cover' => $this->advanceCover($trainer, $claimed),
                'thumbnail' => $this->advanceThumbnail($trainer, $claimed),
                'narrations' => $this->advanceNarrations($trainer, $claimed),
                'offer' => $this->advanceOffer($trainer, $claimed),
                'landing' => $this->advanceLanding($trainer, $claimed),
                'review' => $this->advanceReview($trainer, $claimed),
                default => throw new RuntimeException("Étape One-Brief inconnue : {$step}"),
            };
        } catch (Throwable $error) {
            if ($this->isOptionalStep($step) && ! $error instanceof AuthorizationException) {
                report($error);
                $this->completeStep($claimed, 'skipped', $error->getMessage());
            } else {
                $this->failRun($claimed, $error);
            }
        }

        return $this->ownedRun($trainer, $run->id);
    }

    private function advanceBlueprint(User $trainer, CourseCreationRun $run): void
    {
        if ($run->academy_ai_run_id) {
            $existing = AcademyAiRun::query()->where('user_id', $trainer->id)->find($run->academy_ai_run_id);
            if ($existing?->isSucceeded()) {
                $this->completeStep($run, 'done', 'Blueprint pédagogique généré.');
                return;
            }
        }

        $options = (array) $run->options;
        $aiRun = $this->ai->run($trainer, 'course.generate', $run->brief, [
            'category_id' => (int) $options['category_id'],
            'audience' => $options['audience'] ?: null,
            'outcome' => $options['outcome'] ?: null,
            'weeks' => $options['weeks'] ?: null,
        ]);

        $run->update(['academy_ai_run_id' => $aiRun->id]);
        $this->completeStep($run->fresh(), 'done', 'Blueprint pédagogique généré.');
    }

    private function advanceMaterialize(User $trainer, CourseCreationRun $run): void
    {
        $aiRun = $this->blueprintRun($trainer, $run);
        $courseId = (int) (($aiRun->output ?? [])['materialized_course_id'] ?? 0);

        if ($courseId <= 0) {
            if (! $aiRun->isApplied()) {
                $this->applyAi->handle($trainer, $aiRun);
                $aiRun->refresh();
            }
            $courseId = (int) (($aiRun->output ?? [])['materialized_course_id'] ?? 0);
        }

        $course = Course::query()->where('trainer_id', $trainer->id)->find($courseId);
        if (! $course) {
            throw new RuntimeException('La formation générée n’a pas pu être matérialisée.');
        }

        $run->update(['course_id' => $course->id]);
        $this->completeStep($run->fresh(), 'done', 'Formation créée en brouillon.');
    }

    private function advanceAssessments(User $trainer, CourseCreationRun $run): void
    {
        if (! (bool) data_get($run->options, 'generate_assessments', true)) {
            $this->completeStep($run, 'skipped', 'Quiz automatiques désactivés.');
            return;
        }

        $course = $this->course($trainer, $run)->load('modules.lessons');
        $eligible = $course->modules->values();
        $generatedModuleIds = collect((array) data_get($run->state, 'assessments.generated_module_ids', []))->map(fn ($id) => (int) $id)->all();
        $assessmentIds = collect((array) data_get($run->state, 'assessments.assessment_ids', []))->map(fn ($id) => (int) $id)->all();
        $generated = count($generatedModuleIds);
        $next = $eligible->first(fn ($module) => ! in_array((int) $module->id, $generatedModuleIds, true));

        $this->mergeState($run, ['assessments' => [
            'eligible' => $eligible->count(),
            'generated' => $generated,
            'generated_module_ids' => $generatedModuleIds,
            'assessment_ids' => $assessmentIds,
        ]]);

        if (! $next) {
            $this->completeStep($run->fresh(), 'done', "Quiz générés : {$generated}/{$eligible->count()}.");
            return;
        }

        $aiRun = $this->ai->run($trainer, 'assessment.generate', 'Crée un quiz de validation des acquis de ce module. Utilise uniquement son contenu réel.', [
            'course_id' => $course->id,
            'module_id' => $next->id,
            'kind' => 'quiz',
            'question_count' => 5,
            'passing_score_percent' => 70,
        ]);
        $this->applyAi->handle($trainer, $aiRun);
        $aiRun->refresh();
        $assessmentId = (int) (($aiRun->output ?? [])['materialized_assessment_id'] ?? 0);
        if ($assessmentId <= 0) {
            throw new RuntimeException('Le quiz généré n’a pas pu être matérialisé.');
        }

        $generatedModuleIds[] = (int) $next->id;
        $assessmentIds[] = $assessmentId;
        $generated++;
        $this->mergeState($run, ['assessments' => [
            'eligible' => $eligible->count(),
            'generated' => $generated,
            'generated_module_ids' => array_values(array_unique($generatedModuleIds)),
            'assessment_ids' => array_values(array_unique($assessmentIds)),
        ]]);

        if ($generated >= $eligible->count()) {
            $this->completeStep($run->fresh(), 'done', "Quiz générés : {$generated}/{$eligible->count()}.");
            return;
        }

        $progress = 24 + (int) floor(14 * ($generated / max(1, $eligible->count())));
        $this->markAssessmentsPending($run->fresh(), "Quiz {$generated}/{$eligible->count()}", $progress);
    }

    private function advanceAssignments(User $trainer, CourseCreationRun $run): void
    {
        if (! (bool) data_get($run->options, 'generate_assignments', true)) {
            $this->completeStep($run, 'skipped', 'Assignments automatiques désactivés.');
            return;
        }

        $course = $this->course($trainer, $run)->load('modules.lessons');
        $eligible = $course->modules->values();
        $generatedModuleIds = collect((array) data_get($run->state, 'assignments.generated_module_ids', []))->map(fn ($id) => (int) $id)->all();
        $assignmentIds = collect((array) data_get($run->state, 'assignments.assignment_ids', []))->map(fn ($id) => (int) $id)->all();
        $generated = count($generatedModuleIds);
        $next = $eligible->first(fn ($module) => ! in_array((int) $module->id, $generatedModuleIds, true));

        $this->mergeState($run, ['assignments' => [
            'eligible' => $eligible->count(),
            'generated' => $generated,
            'generated_module_ids' => $generatedModuleIds,
            'assignment_ids' => $assignmentIds,
        ]]);

        if (! $next) {
            $this->completeStep($run->fresh(), 'done', "Assignments générés : {$generated}/{$eligible->count()}.");
            return;
        }

        $aiRun = $this->ai->run($trainer, 'assignment.generate', 'Crée un projet pratique de validation pour ce module. Utilise uniquement son contenu réel.', [
            'course_id' => $course->id,
            'module_id' => $next->id,
            'kind' => 'project',
            'deliverable_type' => 'mixed',
        ]);
        $this->applyAi->handle($trainer, $aiRun);
        $aiRun->refresh();
        $assignmentId = (int) (($aiRun->output ?? [])['materialized_assignment_id'] ?? 0);
        if ($assignmentId <= 0) {
            throw new RuntimeException('L’assignment généré n’a pas pu être matérialisé.');
        }

        $generatedModuleIds[] = (int) $next->id;
        $assignmentIds[] = $assignmentId;
        $generated++;
        $this->mergeState($run, ['assignments' => [
            'eligible' => $eligible->count(),
            'generated' => $generated,
            'generated_module_ids' => array_values(array_unique($generatedModuleIds)),
            'assignment_ids' => array_values(array_unique($assignmentIds)),
        ]]);

        if ($generated >= $eligible->count()) {
            $this->completeStep($run->fresh(), 'done', "Assignments générés : {$generated}/{$eligible->count()}.");
            return;
        }

        $progress = 32 + (int) floor(10 * ($generated / max(1, $eligible->count())));
        $this->markAssignmentsPending($run->fresh(), "Assignment {$generated}/{$eligible->count()}", $progress);
    }

    private function advanceCover(User $trainer, CourseCreationRun $run): void
    {
        if (! (bool) data_get($run->options, 'generate_cover', true)) {
            $this->completeStep($run, 'skipped', 'Cover désactivée dans le brief.');
            return;
        }

        $course = $this->course($trainer, $run);
        if (filled($course->image)) {
            $this->completeStep($run, 'done', 'Cover déjà disponible.');
            return;
        }

        $this->media->generateCourseImage($course, '', 'cover');
        $this->completeStep($run, 'done', 'Cover 16:9 générée.');
    }

    private function advanceThumbnail(User $trainer, CourseCreationRun $run): void
    {
        if (! (bool) data_get($run->options, 'generate_thumbnail', true)) {
            $this->completeStep($run, 'skipped', 'Thumbnail désactivée dans le brief.');
            return;
        }

        $course = $this->course($trainer, $run);
        if (filled($course->thumbnail)) {
            $this->completeStep($run, 'done', 'Thumbnail déjà disponible.');
            return;
        }

        $this->media->generateCourseImage($course, '', 'thumbnail');
        $this->completeStep($run, 'done', 'Thumbnail carrée générée.');
    }

    private function advanceNarrations(User $trainer, CourseCreationRun $run): void
    {
        if (! (bool) data_get($run->options, 'generate_audio', false)) {
            $this->completeStep($run, 'skipped', 'Narration audio désactivée.');
            return;
        }

        $course = $this->course($trainer, $run)->load('modules.lessons');
        $eligible = $course->modules->flatMap->lessons
            ->filter(fn (Lesson $lesson) => filled($lesson->content) || filled($lesson->transcript))
            ->values();
        $generated = $eligible->filter(fn (Lesson $lesson) => filled($lesson->audio_url))->count();
        /** @var Lesson|null $next */
        $next = $eligible->filter(fn (Lesson $lesson) => blank($lesson->audio_url))->first();

        $this->mergeState($run, [
            'narrations' => ['eligible' => $eligible->count(), 'generated' => $generated],
        ]);

        if (! $next) {
            $this->completeStep($run->fresh(), 'done', "Narrations générées : {$generated}/{$eligible->count()}.");
            return;
        }

        $voice = data_get($run->options, 'voice');
        $this->media->generateLessonAudio($next, is_string($voice) ? $voice : null, 'Voix pédagogique claire, naturelle et posée.');

        $generated++;
        $this->mergeState($run, [
            'narrations' => ['eligible' => $eligible->count(), 'generated' => $generated],
        ]);

        if ($generated >= $eligible->count()) {
            $this->completeStep($run->fresh(), 'done', "Narrations générées : {$generated}/{$eligible->count()}.");
            return;
        }

        $progress = 52 + (int) floor(24 * ($generated / max(1, $eligible->count())));
        $this->markStepPending($run->fresh(), "Narration {$generated}/{$eligible->count()}", $progress);
    }

    private function advanceOffer(User $trainer, CourseCreationRun $run): void
    {
        $course = $this->course($trainer, $run);
        $options = (array) $run->options;
        $priceMajor = $options['price_major'] ?? null;
        $major = is_numeric($priceMajor) ? max(0, (float) $priceMajor) : max(0, (float) $course->price);
        $amount = (int) round($major * 100);
        $currency = strtoupper((string) ($options['currency'] ?? 'EUR'));

        $offer = CourseOffer::query()->firstOrCreate(
            ['course_id' => $course->id, 'slug' => 'ai-default'],
            [
                'name' => $amount === 0 ? 'Accès gratuit' : 'Accès complet',
                'billing_type' => $amount === 0 ? 'free' : 'one_time',
                'amount' => $amount,
                'currency' => $currency,
                'interval' => null,
                'access_rank' => 0,
                'trial_days' => 0,
                'is_default' => true,
                'is_active' => true,
            ],
        );

        $course->update(['price' => $major]); // legacy UI mirror; CourseOffer remains the commercial source of truth.

        CourseOffer::query()
            ->where('course_id', $course->id)
            ->where('id', '<>', $offer->id)
            ->update(['is_default' => false]);

        $run->update(['offer_id' => $offer->id]);
        $this->completeStep($run->fresh(), 'done', 'Offre commerciale locale préparée.');
    }

    private function advanceLanding(User $trainer, CourseCreationRun $run): void
    {
        if (! (bool) data_get($run->options, 'generate_landing', true)) {
            $this->completeStep($run, 'skipped', 'Landing page désactivée.');
            return;
        }

        if ($run->page_id && AcademyPage::query()->where('trainer_id', $trainer->id)->whereKey($run->page_id)->exists()) {
            $this->completeStep($run, 'done', 'Landing page déjà disponible.');
            return;
        }

        $course = $this->course($trainer, $run);
        $state = (array) $run->state;
        $pageAiRunId = (int) data_get($state, 'page_ai_run_id', 0);
        $pageRun = $pageAiRunId > 0
            ? AcademyAiRun::query()->where('user_id', $trainer->id)->find($pageAiRunId)
            : null;

        if (! $pageRun) {
            $pageRun = $this->ai->run(
                $trainer,
                'page.generate',
                "Crée la landing page de la formation « {$course->title} ». Utilise uniquement cette formation, son programme réel et ses offres réelles. N’invente aucun témoignage, résultat ou chiffre.",
                ['course_id' => $course->id],
            );
            $this->mergeState($run, ['page_ai_run_id' => $pageRun->id]);
        }

        $pageRun->refresh();
        if (! $pageRun->isApplied()) {
            $output = (array) $pageRun->output;
            $sections = array_map(function (array $section) use ($course): array {
                if (in_array((string) ($section['type'] ?? ''), ['hero','instructor','course','curriculum','pricing'], true)) {
                    $section['course_id'] = $course->id;
                }
                return $section;
            }, (array) ($output['sections'] ?? []));
            $output['sections'] = $sections;
            $pageRun->update(['output' => $output]);
            $this->applyAi->handle($trainer, $pageRun->fresh());
            $pageRun->refresh();
        }

        $pageId = (int) (($pageRun->output ?? [])['materialized_page_id'] ?? 0);
        $page = AcademyPage::query()->where('trainer_id', $trainer->id)->find($pageId);
        if (! $page) {
            throw new RuntimeException('La landing page générée n’a pas pu être matérialisée.');
        }

        $run->update(['page_id' => $page->id]);
        $this->completeStep($run->fresh(), 'done', 'Landing page créée en brouillon.');
    }

    private function advanceReview(User $trainer, CourseCreationRun $run): void
    {
        $course = $this->course($trainer, $run)->load('modules.lessons');
        $eligibleNarrations = $course->modules->flatMap->lessons
            ->filter(fn (Lesson $lesson) => filled($lesson->content) || filled($lesson->transcript));

        $this->mergeState($run, [
            'summary' => [
                'course_title' => $course->title,
                'module_count' => $course->modules->count(),
                'lesson_count' => $course->modules->sum(fn ($module) => $module->lessons->count()),
                'assessment_count' => $course->assessments()->count(),
                'assignment_count' => $course->assignments()->count(),
                'has_cover' => filled($course->image),
                'has_thumbnail' => filled($course->thumbnail),
                'narration_eligible' => $eligibleNarrations->count(),
                'narration_generated' => $eligibleNarrations->filter(fn (Lesson $lesson) => filled($lesson->audio_url))->count(),
                'course_status' => $course->status->value,
                'page_status' => $run->page?->status,
            ],
        ]);

        IndexCourseKnowledge::dispatch($course->id)->afterCommit();

        $state = (array) $run->fresh()->state;
        data_set($state, 'steps.review', [
            'status' => 'done',
            'detail' => 'Formation prête à être revue.',
            'reason' => null,
        ]);
        $run->update([
            'state' => $state,
            'status' => 'completed',
            'step_status' => 'done',
            'progress_percent' => 100,
            'completed_at' => now(),
            'error_message' => null,
        ]);
    }

    private function claimStep(User $trainer, int $runId): ?CourseCreationRun
    {
        return DB::transaction(function () use ($trainer, $runId): ?CourseCreationRun {
            $run = CourseCreationRun::query()->lockForUpdate()->findOrFail($runId);
            if ($run->user_id !== $trainer->id) {
                throw new AuthorizationException('Cette génération de formation ne vous appartient pas.');
            }
            if ($run->isComplete() || $run->isFailed()) {
                return null;
            }
            if ($run->step_status === 'running' && $run->step_started_at?->gt(now()->subMinutes(self::STALE_STEP_MINUTES))) {
                return null;
            }

            $state = (array) $run->state;
            data_set($state, 'steps.'.$run->current_step.'.status', 'running');
            data_set($state, 'steps.'.$run->current_step.'.detail', $this->stepLabel($run->current_step));
            $run->update([
                'state' => $state,
                'status' => 'running',
                'step_status' => 'running',
                'step_started_at' => now(),
                'progress_percent' => max($run->progress_percent, self::BASE_PROGRESS[$run->current_step] ?? 0),
                'error_message' => null,
            ]);

            return $run->fresh();
        });
    }

    private function completeStep(CourseCreationRun $run, string $status, ?string $detail = null): void
    {
        $run->refresh();
        $state = (array) $run->state;
        data_set($state, 'steps.'.$run->current_step, [
            'status' => $status,
            'detail' => $detail,
            'reason' => $status === 'skipped' ? $detail : null,
        ]);

        $next = $this->nextStep($run->current_step);
        $run->update([
            'state' => $state,
            'current_step' => $next ?? 'review',
            'step_status' => $next ? 'pending' : 'done',
            'step_started_at' => null,
            'progress_percent' => $next ? max($run->progress_percent, self::BASE_PROGRESS[$next] ?? $run->progress_percent) : 100,
        ]);
    }

    private function markAssessmentsPending(CourseCreationRun $run, string $detail, int $progress): void
    {
        $run->refresh();
        $state = (array) $run->state;
        data_set($state, 'steps.assessments.status', 'running');
        data_set($state, 'steps.assessments.detail', $detail);
        $run->update([
            'state' => $state,
            'step_status' => 'pending',
            'step_started_at' => null,
            'progress_percent' => max($run->progress_percent, min(38, $progress)),
        ]);
    }

    private function markAssignmentsPending(CourseCreationRun $run, string $detail, int $progress): void
    {
        $run->refresh();
        $state = (array) $run->state;
        data_set($state, 'steps.assignments.status', 'running');
        data_set($state, 'steps.assignments.detail', $detail);
        $run->update([
            'state' => $state,
            'step_status' => 'pending',
            'step_started_at' => null,
            'progress_percent' => max($run->progress_percent, min(42, $progress)),
        ]);
    }

    private function markStepPending(CourseCreationRun $run, string $detail, int $progress): void
    {
        $run->refresh();
        $state = (array) $run->state;
        data_set($state, 'steps.narrations.status', 'running');
        data_set($state, 'steps.narrations.detail', $detail);
        $run->update([
            'state' => $state,
            'step_status' => 'pending',
            'step_started_at' => null,
            'progress_percent' => max($run->progress_percent, min(76, $progress)),
        ]);
    }

    private function failRun(CourseCreationRun $run, Throwable $error): void
    {
        report($error);
        $state = (array) $run->state;
        data_set($state, 'steps.'.$run->current_step, [
            'status' => 'failed',
            'detail' => 'Échec de l’étape.',
            'reason' => mb_substr($error->getMessage(), 0, 1000),
        ]);
        $run->update([
            'state' => $state,
            'status' => 'failed',
            'step_status' => 'failed',
            'error_message' => mb_substr($error->getMessage(), 0, 4000),
            'step_started_at' => null,
        ]);
    }

    private function mergeState(CourseCreationRun $run, array $patch): void
    {
        $state = array_replace_recursive((array) $run->state, $patch);
        $run->update(['state' => $state]);
    }

    private function nextStep(string $current): ?string
    {
        $index = array_search($current, CourseCreationRun::STEPS, true);
        if ($index === false) {
            throw new RuntimeException("Étape One-Brief inconnue : {$current}");
        }
        return CourseCreationRun::STEPS[$index + 1] ?? null;
    }

    private function isOptionalStep(string $step): bool
    {
        return in_array($step, ['assessments','assignments','cover','thumbnail','narrations','landing'], true);
    }

    private function ownedRun(User $trainer, int $runId): CourseCreationRun
    {
        $run = CourseCreationRun::query()->with(['course.modules.lessons','page','offer'])->findOrFail($runId);
        if ($run->user_id !== $trainer->id) {
            throw new AuthorizationException('Cette génération de formation ne vous appartient pas.');
        }
        return $run;
    }

    private function blueprintRun(User $trainer, CourseCreationRun $run): AcademyAiRun
    {
        $aiRun = AcademyAiRun::query()->where('user_id', $trainer->id)->find((int) $run->academy_ai_run_id);
        if (! $aiRun?->isSucceeded()) {
            throw new RuntimeException('Le blueprint Academy AI est introuvable ou incomplet.');
        }
        return $aiRun;
    }

    private function course(User $trainer, CourseCreationRun $run): Course
    {
        $course = Course::query()->where('trainer_id', $trainer->id)->find((int) $run->course_id);
        if (! $course) {
            throw new RuntimeException('La formation générée est introuvable.');
        }
        return $course;
    }

    private function stepLabel(string $step): string
    {
        return match ($step) {
            'blueprint' => 'Conception de la formation…',
            'materialize' => 'Construction du curriculum…',
            'assessments' => 'Création des quiz…',
            'assignments' => 'Création des projets…',
            'cover' => 'Création de la cover…',
            'thumbnail' => 'Création de la thumbnail…',
            'narrations' => 'Génération des narrations…',
            'offer' => 'Préparation de l’offre…',
            'landing' => 'Construction de la landing page…',
            'review' => 'Préparation de la revue…',
            default => 'Création de la formation…',
        };
    }
}
