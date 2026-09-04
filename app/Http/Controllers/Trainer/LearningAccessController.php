<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseUnlockRule;
use App\Services\LearningAccess\UnlockRuleDefinitionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LearningAccessController extends Controller
{
    public function __construct(private readonly UnlockRuleDefinitionService $definitions) {}

    public function index(Course $course): Response
    {
        Gate::authorize('update', $course);
        $course->load(['modules.lessons', 'assessments', 'assignments']);
        $targets = $this->targets($course);
        $labels = collect($targets)->keyBy(fn (array $item) => $item['type'].':'.$item['id']);

        return Inertia::render('trainer/courses/learning-access/index', [
            'course' => ['id' => $course->id, 'title' => $course->title],
            'targets' => $targets,
            'rules' => $this->definitions->listForCourse($course)->map(function (CourseUnlockRule $rule) use ($labels): array {
                $targetKey = $rule->target_type->value.':'.$rule->target_id;
                $sourceKey = $rule->source_type?->value.':'.$rule->source_id;

                return [
                    'id' => $rule->id,
                    'targetType' => $rule->target_type->value,
                    'targetId' => (int) $rule->target_id,
                    'targetLabel' => data_get($labels->get($targetKey), 'label', $targetKey),
                    'ruleType' => $rule->rule_type->value,
                    'sourceType' => $rule->source_type?->value,
                    'sourceId' => $rule->source_id ? (int) $rule->source_id : null,
                    'sourceLabel' => $rule->source_id ? data_get($labels->get($sourceKey), 'label', $sourceKey) : null,
                    'delayDays' => $rule->delay_days,
                    'availableAt' => $rule->available_at?->format('Y-m-d\TH:i'),
                    'isEnabled' => $rule->is_enabled,
                    'position' => (int) $rule->position,
                ];
            })->values(),
        ]);
    }

    public function store(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->definitions->create($course, $this->payload($request));

        return back()->with('success', 'Règle de déverrouillage ajoutée.');
    }

    public function update(Request $request, Course $course, CourseUnlockRule $rule): RedirectResponse
    {
        Gate::authorize('update', $course);
        abort_unless((int) $rule->course_id === (int) $course->id, 404);
        $this->definitions->update($rule, $this->payload($request, partial: true));

        return back()->with('success', 'Règle de déverrouillage mise à jour.');
    }

    public function destroy(Course $course, CourseUnlockRule $rule): RedirectResponse
    {
        Gate::authorize('update', $course);
        abort_unless((int) $rule->course_id === (int) $course->id, 404);
        $this->definitions->delete($rule);

        return back()->with('success', 'Règle de déverrouillage supprimée.');
    }

    /** @return array<string,mixed> */
    private function payload(Request $request, bool $partial = false): array
    {
        $rules = [
            'target_type' => [$partial ? 'sometimes' : 'required', 'string'],
            'target_id' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'rule_type' => [$partial ? 'sometimes' : 'required', 'string'],
            'source_id' => ['nullable', 'integer', 'min:1'],
            'delay_days' => ['nullable', 'integer', 'min:0', 'max:3650'],
            'available_at' => ['nullable', 'date'],
            'is_enabled' => ['nullable', 'boolean'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];

        return $request->validate($rules);
    }

    /** @return list<array{type:string,id:int,label:string,group:string}> */
    private function targets(Course $course): array
    {
        $items = [];
        foreach ($course->modules->values() as $moduleIndex => $module) {
            $modulePrefix = 'Module '.($moduleIndex + 1).' · '.$module->title;
            $items[] = ['type' => 'module', 'id' => (int) $module->id, 'label' => $modulePrefix, 'group' => 'Modules'];
            foreach ($module->lessons->values() as $lessonIndex => $lesson) {
                $items[] = [
                    'type' => 'lesson',
                    'id' => (int) $lesson->id,
                    'label' => $modulePrefix.' / Leçon '.($lessonIndex + 1).' · '.$lesson->title,
                    'group' => 'Leçons',
                ];
            }
        }
        foreach ($course->assessments as $assessment) {
            $items[] = ['type' => 'assessment', 'id' => (int) $assessment->id, 'label' => 'Évaluation · '.$assessment->title, 'group' => 'Évaluations'];
        }
        foreach ($course->assignments as $assignment) {
            $items[] = ['type' => 'assignment', 'id' => (int) $assignment->id, 'label' => 'Projet · '.$assignment->title, 'group' => 'Projets'];
        }

        return $items;
    }
}
