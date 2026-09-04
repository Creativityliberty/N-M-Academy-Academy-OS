<?php

declare(strict_types=1);

namespace App\Actions\Trainer\AcademyAi;

use App\AI\AcademyAiCapabilityRegistry;
use App\Enums\CourseStatus;
use App\Enums\LessonType;
use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyAiRun;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Models\AcademyPage;
use App\PageBuilder\PageBlockRegistry;
use App\Services\Assessments\AssessmentDefinitionService;
use App\Services\Assignments\AssignmentDefinitionService;
use Illuminate\Support\Str;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApplyAcademyAiRunAction
{
    public function __construct(
        private readonly AcademyAiCapabilityRegistry $registry,
        private readonly PageBlockRegistry $pageBlocks,
        private readonly AssessmentDefinitionService $assessmentDefinitions,
        private readonly AssignmentDefinitionService $assignmentDefinitions,
    ) {}

    public function handle(User $trainer, AcademyAiRun $run): AcademyAiRun
    {
        return DB::transaction(function () use ($trainer, $run): AcademyAiRun {
            /** @var AcademyAiRun $locked */
            $locked = AcademyAiRun::query()->lockForUpdate()->findOrFail($run->id);

            if ($locked->user_id !== $trainer->id) {
                throw new AuthorizationException('Cette exécution Academy AI ne vous appartient pas.');
            }

            if (! $locked->isSucceeded()) {
                throw new RuntimeException('Seule une exécution Academy AI réussie peut être appliquée.');
            }

            if ($locked->isApplied()) {
                throw new RuntimeException('Cette proposition Academy AI a déjà été appliquée.');
            }

            $capability = $this->registry->get($locked->capability);
            if (! $capability->canApply()) {
                throw new RuntimeException('Cette capability est en lecture seule.');
            }

            match ($locked->capability) {
                'course.generate' => $this->applyCourse($trainer, $locked),
                'assessment.generate' => $this->applyAssessment($trainer, $locked),
                'assignment.generate' => $this->applyAssignment($trainer, $locked),
                'curriculum.generate' => $this->applyCurriculum($trainer, $locked),
                'lessons.generate' => $this->applyLessons($trainer, $locked),
                'lesson.rewrite' => $this->applyRewrite($trainer, $locked),
                'page.generate' => $this->applyGeneratedPage($trainer, $locked),
                'page.optimize' => $this->applyOptimizedPage($trainer, $locked),
                default => throw new RuntimeException('Aucune mutation n’est disponible pour cette capability.'),
            };

            $this->queueKnowledgeReindex($trainer, $locked);
            $locked->update(['applied_at' => now()]);

            return $locked->fresh();
        });
    }

    private function queueKnowledgeReindex(User $trainer, AcademyAiRun $run): void
    {
        $courseId = match ($run->capability) {
            'course.generate' => (int) (($run->output ?? [])['materialized_course_id'] ?? 0),
            'curriculum.generate' => (int) (($run->input ?? [])['course_id'] ?? 0),
            'lessons.generate' => (int) (Module::find((int) (($run->input ?? [])['module_id'] ?? 0))?->course_id ?? 0),
            'lesson.rewrite' => (int) (Lesson::with('module:id,course_id')->find((int) (($run->input ?? [])['lesson_id'] ?? 0))?->module?->course_id ?? 0),
            default => 0,
        };

        if ($courseId > 0 && Course::whereKey($courseId)->where('trainer_id', $trainer->id)->exists()) {
            IndexCourseKnowledge::dispatch($courseId)->afterCommit();
        }
    }

    private function applyCourse(User $trainer, AcademyAiRun $run): void
    {
        $output = (array) $run->output;
        $input = (array) $run->input;

        $course = Course::create([
            'trainer_id' => $trainer->id,
            'category_id' => (int) ($input['category_id'] ?? 0),
            'title' => $this->title($output['title'] ?? 'Formation générée'),
            'description' => $this->content($output['description'] ?? '', 60000),
            'target_audience' => $this->content($output['target_audience'] ?? '', 12000),
            'level' => $this->courseLevel($output['level'] ?? 'all_levels'),
            'language' => $this->courseLanguage($output['language'] ?? 'fr'),
            'positioning' => $this->positioning((array) ($output['positioning'] ?? [])),
            'price' => max(0, (float) ($output['suggested_price'] ?? 0)),
            'duration' => max(1, (int) ($output['duration_minutes'] ?? 1)),
            'featured' => false,
            'benefits' => array_values((array) ($output['benefits'] ?? [])),
            'objectives' => array_values((array) ($output['objectives'] ?? [])),
            'prerequisites' => array_values((array) ($output['prerequisites'] ?? [])),
            'status' => CourseStatus::Draft->value,
        ]);

        $this->appendModules($course, (array) ($output['modules'] ?? []), true);

        $output['materialized_course_id'] = $course->id;
        $run->update(['output' => $output]);
    }

    private function applyAssignment(User $trainer, AcademyAiRun $run): void
    {
        $input = (array) $run->input;
        $course = Course::query()->where('trainer_id', $trainer->id)->find((int) ($input['course_id'] ?? 0));
        if (! $course) { throw new AuthorizationException('Formation cible introuvable ou non autorisée.'); }
        $output = (array) $run->output;
        $assignment = $this->assignmentDefinitions->create($course, [
            ...$output,
            'module_id' => $input['module_id'] ?? null,
            'lesson_id' => $input['lesson_id'] ?? null,
            'is_enabled' => true,
        ]);
        $output['materialized_assignment_id'] = $assignment->id;
        $run->update(['output' => $output]);
    }

    private function applyAssessment(User $trainer, AcademyAiRun $run): void
    {
        $input = (array) $run->input;
        $course = Course::query()->where('trainer_id', $trainer->id)->find((int) ($input['course_id'] ?? 0));
        if (! $course) { throw new AuthorizationException('Formation cible introuvable ou non autorisée.'); }

        $output = (array) $run->output;
        $assessment = $this->assessmentDefinitions->create($course, [
            ...$output,
            'module_id' => $input['module_id'] ?? null,
            'lesson_id' => $input['lesson_id'] ?? null,
            'max_attempts' => $input['max_attempts'] ?? 3,
            'shuffle_questions' => true,
            'shuffle_options' => true,
            'show_explanations' => true,
            'is_enabled' => true,
        ]);

        $output['materialized_assessment_id'] = $assessment->id;
        $run->update(['output' => $output]);
    }

    private function applyCurriculum(User $trainer, AcademyAiRun $run): void
    {
        $course = Course::query()
            ->where('trainer_id', $trainer->id)
            ->find((int) (($run->input ?? [])['course_id'] ?? 0));

        if (! $course) {
            throw new AuthorizationException('Formation cible introuvable ou non autorisée.');
        }

        $modules = (array) (($run->output ?? [])['modules'] ?? []);
        $this->appendModules($course, $modules, false);

        $addedMinutes = collect($modules)->sum(fn ($module) => max(1, (int) ($module['duration_minutes'] ?? 1)));
        if ($addedMinutes > 0) {
            $course->increment('duration', $addedMinutes);
        }
    }

    private function applyLessons(User $trainer, AcademyAiRun $run): void
    {
        $module = Module::query()
            ->whereHas('course', fn ($query) => $query->where('trainer_id', $trainer->id))
            ->find((int) (($run->input ?? [])['module_id'] ?? 0));

        if (! $module) {
            throw new AuthorizationException('Module cible introuvable ou non autorisé.');
        }

        $lessons = (array) (($run->output ?? [])['lessons'] ?? []);
        $addedMinutes = 0;

        foreach ($lessons as $lessonData) {
            $duration = max(1, (int) ($lessonData['duration_minutes'] ?? 1));
            $addedMinutes += $duration;

            $module->lessons()->create([
                'title' => $this->title($lessonData['title'] ?? 'Leçon'),
                'content' => $this->content($lessonData['content'] ?? ''),
                'duration' => $duration,
                'is_free' => false,
                'type' => LessonType::Text->value,
            ]);
        }

        if ($addedMinutes > 0) {
            $module->increment('duration', $addedMinutes);
            $module->course()->increment('duration', $addedMinutes);
        }
    }

    private function applyRewrite(User $trainer, AcademyAiRun $run): void
    {
        $lesson = Lesson::query()
            ->whereHas('module.course', fn ($query) => $query->where('trainer_id', $trainer->id))
            ->find((int) (($run->input ?? [])['lesson_id'] ?? 0));

        if (! $lesson) {
            throw new AuthorizationException('Leçon cible introuvable ou non autorisée.');
        }

        $output = (array) $run->output;
        $lesson->update([
            'title' => $this->title($output['title'] ?? $lesson->title),
            'content' => $this->content($output['content'] ?? $lesson->content),
        ]);
    }

    private function applyGeneratedPage(User $trainer, AcademyAiRun $run): void
    {
        $output = (array) $run->output;
        $base = Str::slug((string) ($output['slug_hint'] ?? $output['title'] ?? 'page')) ?: 'page';
        $slug = $base; $i = 2;
        while (AcademyPage::where('slug', $slug)->exists()) { $slug = $base.'-'.$i++; }
        $page = AcademyPage::create([
            'trainer_id' => $trainer->id, 'title' => $this->title($output['title'] ?? 'Page générée'), 'slug' => $slug,
            'page_type' => 'landing', 'status' => 'draft', 'meta_title' => $this->title($output['meta_title'] ?? ''),
            'meta_description' => $this->content($output['meta_description'] ?? '', 1000),
        ]);
        $this->replacePageSections($trainer, $page, (array) ($output['sections'] ?? []));
        $output['materialized_page_id'] = $page->id;
        $run->update(['output' => $output]);
    }

    private function applyOptimizedPage(User $trainer, AcademyAiRun $run): void
    {
        $page = AcademyPage::query()->where('trainer_id', $trainer->id)->find((int) (($run->input ?? [])['page_id'] ?? 0));
        if (! $page) { throw new AuthorizationException('Page cible introuvable ou non autorisée.'); }
        $output = (array) $run->output;
        $page->update([
            'title' => $this->title($output['title'] ?? $page->title),
            'meta_title' => $this->title($output['meta_title'] ?? $page->meta_title),
            'meta_description' => $this->content($output['meta_description'] ?? $page->meta_description, 1000),
            'status' => 'draft', 'published_at' => null,
        ]);
        $this->replacePageSections($trainer, $page, (array) ($output['sections'] ?? []));
    }

    private function replacePageSections(User $trainer, AcademyPage $page, array $sections): void
    {
        $page->sections()->delete();
        foreach (array_slice($sections, 0, 12) as $order => $section) {
            $type = (string) ($section['type'] ?? '');
            if (! isset(PageBlockRegistry::BLOCKS[$type])) {
                continue;
            }
            $variant = $this->pageBlocks->normalizeVariant($type, (string) ($section['variant'] ?? ''));
            $settings = [
                'headline' => $section['headline'] ?? '', 'subheadline' => $section['subheadline'] ?? '', 'title' => $section['title'] ?? '',
                'description' => $section['description'] ?? '', 'button_label' => $section['button_label'] ?? '', 'button_url' => $section['button_url'] ?? '',
                'course_id' => (int) ($section['course_id'] ?? 0), 'items' => array_values((array) ($section['items'] ?? [])),
            ];
            if (($settings['course_id'] ?? 0) > 0 && ! $trainer->courses()->whereKey($settings['course_id'])->exists()) { $settings['course_id'] = 0; }
            $page->sections()->create([
                'type' => $type, 'variant' => $variant, 'sort_order' => $order, 'settings' => $this->pageBlocks->sanitizeSettings($type, $settings),
            ]);
        }
    }


    private function courseLevel(mixed $value): string
    {
        $level = strtolower(trim((string) $value));

        return in_array($level, ['beginner', 'intermediate', 'advanced', 'all_levels'], true)
            ? $level
            : 'all_levels';
    }

    private function courseLanguage(mixed $value): string
    {
        $language = strtolower(trim((string) $value));
        $language = preg_replace('/[^a-z0-9_-]/', '', $language) ?: 'fr';

        return mb_substr($language, 0, 16);
    }

    /** @param array<string, mixed> $value @return array<string, string> */
    private function positioning(array $value): array
    {
        $result = [];
        foreach (['main_problem', 'desired_transformation', 'main_promise', 'unique_angle'] as $key) {
            $result[$key] = $this->content($value[$key] ?? '', 12000);
        }

        return $result;
    }

    private function title(mixed $value): string
    {
        return mb_substr(trim((string) $value), 0, 255);
    }

    private function content(mixed $value, int $max = 30000): string
    {
        return mb_substr(trim((string) $value), 0, $max);
    }

    /** @param array<int, array<string, mixed>> $modules */
    private function appendModules(Course $course, array $modules, bool $withContent): void
    {
        foreach ($modules as $moduleData) {
            $module = $course->modules()->create([
                'title' => $this->title($moduleData['title'] ?? 'Module'),
                'duration' => max(1, (int) ($moduleData['duration_minutes'] ?? 1)),
            ]);

            foreach ((array) ($moduleData['lessons'] ?? []) as $lessonData) {
                $module->lessons()->create([
                    'title' => $this->title($lessonData['title'] ?? 'Leçon'),
                    'content' => $withContent
                        ? $this->content($lessonData['content'] ?? '')
                        : $this->content($lessonData['summary'] ?? ''),
                    'duration' => max(1, (int) ($lessonData['duration_minutes'] ?? 1)),
                    'is_free' => false,
                    'type' => LessonType::Text->value,
                ]);
            }
        }
    }
}
