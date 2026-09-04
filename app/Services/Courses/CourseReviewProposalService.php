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
use App\Models\CourseMediaGeneration;
use App\Models\CourseReviewProposal;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CourseReviewProposalService
{
    private const TARGETS = ['course_positioning','module','lesson','cover','thumbnail','landing','audio'];

    public function __construct(
        private readonly AcademyAiRunner $ai,
        private readonly ApplyAcademyAiRunAction $applyAi,
        private readonly CourseMediaGenerationService $media,
    ) {}

    public function propose(User $trainer, CourseCreationRun $run, string $targetType, ?int $targetId, string $instruction): CourseReviewProposal
    {
        $run = $this->ownedRun($trainer, $run);
        if (! in_array($targetType, self::TARGETS, true)) {
            throw new RuntimeException('Type de proposition Review non supporté.');
        }
        if (! in_array($run->status, ['completed','running'], true)) {
            throw new RuntimeException('La formation doit avoir atteint la phase de revue avant une régénération ciblée.');
        }

        $placeholder = DB::transaction(function () use ($trainer, $run, $targetType, $targetId, $instruction): CourseReviewProposal {
            $exists = CourseReviewProposal::query()
                ->where('course_creation_run_id', $run->id)
                ->where('target_type', $targetType)
                ->where('target_id', $targetId)
                ->whereIn('status', ['generating', 'pending'])
                ->lockForUpdate()
                ->exists();
            if ($exists) {
                throw new RuntimeException('Une proposition est déjà en attente pour cet élément.');
            }

            return CourseReviewProposal::create([
                'course_creation_run_id' => $run->id,
                'user_id' => $trainer->id,
                'course_id' => $run->course->id,
                'target_type' => $targetType,
                'target_id' => $targetId,
                'instruction' => trim($instruction) ?: null,
                'before_payload' => [],
                'after_payload' => [],
                'status' => 'generating',
            ]);
        });

        try {
            $course = $run->course;
            $before = [];
            $after = [];
            $aiRun = null;
            $mediaGeneration = null;

            match ($targetType) {
                'course_positioning' => [$before, $after, $aiRun] = $this->positioningProposal($trainer, $course, $instruction),
                'module' => [$before, $after, $aiRun] = $this->moduleProposal($trainer, $course, $targetId, $instruction),
                'lesson' => [$before, $after, $aiRun] = $this->lessonProposal($trainer, $course, $targetId, $instruction),
                'cover', 'thumbnail' => [$before, $after, $mediaGeneration] = $this->imageProposal($trainer, $course, $targetType, $instruction),
                'landing' => [$before, $after, $aiRun] = $this->landingProposal($trainer, $run, $instruction),
                'audio' => [$before, $after, $mediaGeneration] = $this->audioProposal($trainer, $course, $targetId, $instruction),
            };

            $placeholder->update([
                'academy_ai_run_id' => $aiRun?->id,
                'media_generation_id' => $mediaGeneration?->id,
                'before_payload' => $before,
                'after_payload' => $after,
                'status' => 'pending',
            ]);

            return $placeholder->fresh(['academyAiRun', 'mediaGeneration']);
        } catch (\Throwable $error) {
            $placeholder->delete();
            throw $error;
        }
    }

    public function accept(User $trainer, CourseReviewProposal $proposal): CourseReviewProposal
    {
        return DB::transaction(function () use ($trainer, $proposal): CourseReviewProposal {
            /** @var CourseReviewProposal $locked */
            $locked = CourseReviewProposal::query()->lockForUpdate()->findOrFail($proposal->id);
            $this->authorizeProposal($trainer, $locked);
            if (! $locked->isPending()) { throw new RuntimeException('Cette proposition a déjà été traitée.'); }

            $course = Course::query()->where('trainer_id', $trainer->id)->findOrFail($locked->course_id);
            $after = (array) $locked->after_payload;
            $reindex = false;

            switch ($locked->target_type) {
                case 'course_positioning':
                    $course->update([
                        'target_audience' => mb_substr(trim((string) ($after['target_audience'] ?? $course->target_audience)), 0, 12000),
                        'level' => $this->normalizeLevel($after['level'] ?? $course->level),
                        'language' => $this->normalizeLanguage($after['language'] ?? $course->language),
                        'positioning' => $this->normalizePositioning((array) ($after['positioning'] ?? $course->positioning ?? [])),
                    ]);
                    $reindex = true;
                    break;

                case 'module':
                    $module = Module::query()->where('course_id', $course->id)->findOrFail((int) $locked->target_id);
                    $module->update([
                        'title' => mb_substr(trim((string) ($after['title'] ?? $module->title)), 0, 255),
                        'description' => mb_substr(trim((string) ($after['description'] ?? $module->description)), 0, 30000),
                        'objectives' => array_values((array) ($after['objectives'] ?? $module->objectives ?? [])),
                    ]);
                    $reindex = true;
                    break;

                case 'lesson':
                    $lesson = Lesson::query()->whereHas('module', fn ($q) => $q->where('course_id', $course->id))->findOrFail((int) $locked->target_id);
                    $lesson->update([
                        'title' => mb_substr(trim((string) ($after['title'] ?? $lesson->title)), 0, 255),
                        'content' => mb_substr(trim((string) ($after['content'] ?? $lesson->content)), 0, 60000),
                    ]);
                    $reindex = true;
                    break;

                case 'cover':
                    $this->applyMedia($course, $locked, 'image');
                    break;

                case 'thumbnail':
                    $this->applyMedia($course, $locked, 'thumbnail');
                    break;

                case 'audio':
                    $lesson = Lesson::query()->whereHas('module', fn ($q) => $q->where('course_id', $course->id))->findOrFail((int) $locked->target_id);
                    $generation = $this->generation($locked);
                    $lesson->update(['audio_url' => $generation->asset_url]);
                    $generation->update(['status' => 'applied', 'applied_at' => now(), 'rejected_at' => null]);
                    break;

                case 'landing':
                    $aiRun = AcademyAiRun::query()->where('user_id', $trainer->id)->findOrFail((int) $locked->academy_ai_run_id);
                    if (! $aiRun->isApplied()) {
                        $this->applyAi->handle($trainer, $aiRun);
                    }
                    break;

                default:
                    throw new RuntimeException('Type de proposition Review inconnu.');
            }

            $locked->update(['status' => 'accepted', 'accepted_at' => now(), 'rejected_at' => null]);
            if ($reindex) { IndexCourseKnowledge::dispatch($course->id)->afterCommit(); }

            return $locked->fresh(['academyAiRun','mediaGeneration']);
        });
    }

    public function reject(User $trainer, CourseReviewProposal $proposal): CourseReviewProposal
    {
        return DB::transaction(function () use ($trainer, $proposal): CourseReviewProposal {
            /** @var CourseReviewProposal $locked */
            $locked = CourseReviewProposal::query()->lockForUpdate()->findOrFail($proposal->id);
            $this->authorizeProposal($trainer, $locked);
            if (! $locked->isPending()) { throw new RuntimeException('Cette proposition a déjà été traitée.'); }
            if ($locked->media_generation_id) {
                CourseMediaGeneration::whereKey($locked->media_generation_id)->update(['status' => 'rejected', 'rejected_at' => now()]);
            }
            $locked->update(['status' => 'rejected', 'rejected_at' => now(), 'accepted_at' => null]);
            return $locked->fresh(['academyAiRun','mediaGeneration']);
        });
    }

    private function ownedRun(User $trainer, CourseCreationRun $run): CourseCreationRun
    {
        $owned = CourseCreationRun::query()->with(['course.modules.lessons','page.sections','offer'])->where('user_id', $trainer->id)->findOrFail($run->id);
        if (! $owned->course || (int) $owned->course->trainer_id !== (int) $trainer->id) {
            throw new AuthorizationException('Cette génération de formation ne vous appartient pas.');
        }
        return $owned;
    }

    private function authorizeProposal(User $trainer, CourseReviewProposal $proposal): void
    {
        if ((int) $proposal->user_id !== (int) $trainer->id) {
            throw new AuthorizationException('Cette proposition de revue ne vous appartient pas.');
        }
    }

    private function positioningProposal(User $trainer, Course $course, string $instruction): array
    {
        $before = [
            'target_audience' => $course->target_audience,
            'level' => $course->level,
            'language' => $course->language,
            'positioning' => $course->positioning,
        ];
        $run = $this->ai->run($trainer, 'course.positioning.rewrite', $instruction, ['course_id' => $course->id]);
        return [$before, (array) $run->output, $run];
    }

    private function moduleProposal(User $trainer, Course $course, ?int $targetId, string $instruction): array
    {
        $module = Module::query()->where('course_id', $course->id)->findOrFail((int) $targetId);
        $before = ['title' => $module->title, 'description' => $module->description, 'objectives' => $module->objectives];
        $run = $this->ai->run($trainer, 'module.rewrite', $instruction, ['module_id' => $module->id]);
        return [$before, (array) $run->output, $run];
    }

    private function lessonProposal(User $trainer, Course $course, ?int $targetId, string $instruction): array
    {
        $lesson = Lesson::query()->whereHas('module', fn ($q) => $q->where('course_id', $course->id))->findOrFail((int) $targetId);
        $before = ['title' => $lesson->title, 'content' => $lesson->content];
        $run = $this->ai->run($trainer, 'lesson.rewrite', $instruction, ['lesson_id' => $lesson->id]);
        return [$before, (array) $run->output, $run];
    }

    private function imageProposal(User $trainer, Course $course, string $purpose, string $instruction): array
    {
        $field = $purpose === 'cover' ? 'image' : 'thumbnail';
        $before = ['url' => $course->{$field}];
        $generation = $this->media->generateCourseImageCandidate($course, $instruction, $purpose, $trainer->id);
        $after = ['url' => $generation->asset_url, 'provider' => $generation->provider, 'model' => $generation->model, 'prompt' => $generation->compiled_prompt];
        return [$before, $after, $generation];
    }

    private function landingProposal(User $trainer, CourseCreationRun $run, string $instruction): array
    {
        $page = $run->page;
        if (! $page) { throw new RuntimeException('Aucune landing page n’est liée à cette génération.'); }
        $page->loadMissing('sections');
        $before = [
            'title' => $page->title,
            'meta_title' => $page->meta_title,
            'meta_description' => $page->meta_description,
            'sections' => $page->sections->map(fn ($section) => ['type'=>$section->type,'variant'=>$section->variant,'settings'=>$section->settings])->values()->all(),
        ];
        $aiRun = $this->ai->run($trainer, 'page.optimize', $instruction, ['page_id' => $page->id]);
        return [$before, (array) $aiRun->output, $aiRun];
    }

    private function audioProposal(User $trainer, Course $course, ?int $targetId, string $instruction): array
    {
        $lesson = Lesson::query()->whereHas('module', fn ($q) => $q->where('course_id', $course->id))->findOrFail((int) $targetId);
        $before = ['url' => $lesson->audio_url];
        $generation = $this->media->generateLessonAudioCandidate($lesson, null, $instruction, $trainer->id);
        $after = ['url' => $generation->asset_url, 'provider' => $generation->provider, 'model' => $generation->model];
        return [$before, $after, $generation];
    }

    private function applyMedia(Course $course, CourseReviewProposal $proposal, string $field): void
    {
        $generation = $this->generation($proposal);
        $course->update([$field => $generation->asset_url]);
        $generation->update(['status' => 'applied', 'applied_at' => now(), 'rejected_at' => null]);
    }

    private function generation(CourseReviewProposal $proposal): CourseMediaGeneration
    {
        $generation = CourseMediaGeneration::query()->find((int) $proposal->media_generation_id);
        if (! $generation) { throw new RuntimeException('Le média candidat de cette proposition est introuvable.'); }
        return $generation;
    }

    private function normalizeLevel(mixed $value): string
    {
        $level = strtolower(trim((string) $value));
        return in_array($level, ['beginner','intermediate','advanced','all_levels'], true) ? $level : 'all_levels';
    }

    private function normalizeLanguage(mixed $value): string
    {
        $language = preg_replace('/[^a-z0-9_-]/', '', strtolower(trim((string) $value))) ?: 'fr';
        return mb_substr($language, 0, 16);
    }

    private function normalizePositioning(array $value): array
    {
        $result = [];
        foreach (['main_problem','desired_transformation','main_promise','unique_angle'] as $key) {
            $result[$key] = mb_substr(trim((string) ($value[$key] ?? '')), 0, 12000);
        }
        return $result;
    }
}
