<?php

declare(strict_types=1);

namespace App\Services\LearningAccess;

use App\Enums\UnlockRuleType;
use App\Enums\UnlockTargetType;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssignment;
use App\Models\CourseUnlockRule;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UnlockRuleDefinitionService
{
    /** @return Collection<int,CourseUnlockRule> */
    public function listForCourse(Course $course): Collection
    {
        return CourseUnlockRule::query()
            ->where('course_id', $course->id)
            ->orderBy('target_type')
            ->orderBy('target_id')
            ->orderBy('position')
            ->orderBy('id')
            ->get();
    }

    /** @param array<string,mixed> $payload */
    public function create(Course $course, array $payload): CourseUnlockRule
    {
        $data = $this->normalize($course, $payload);
        $data['position'] ??= $this->nextPositionFor(
            $course,
            (string) $data['target_type'],
            (int) $data['target_id'],
        );

        return CourseUnlockRule::query()->create(['course_id' => $course->id, ...$data]);
    }

    /** @param array<string,mixed> $payload */
    public function update(CourseUnlockRule $rule, array $payload): CourseUnlockRule
    {
        $course = $rule->course()->firstOrFail();
        $merged = array_merge([
            'target_type' => $rule->target_type->value,
            'target_id' => (int) $rule->target_id,
            'rule_type' => $rule->rule_type->value,
            'source_type' => $rule->source_type?->value,
            'source_id' => $rule->source_id ? (int) $rule->source_id : null,
            'delay_days' => $rule->delay_days,
            'available_at' => $rule->available_at?->toIso8601String(),
            'is_enabled' => $rule->is_enabled,
            'position' => (int) $rule->position,
        ], $payload);
        $data = $this->normalize($course, $merged);
        $rule->update($data);

        return $rule->fresh();
    }

    public function delete(CourseUnlockRule $rule): void
    {
        $rule->delete();
    }

    /** @param array<string,mixed> $payload @return array<string,mixed> */
    private function normalize(Course $course, array $payload): array
    {
        $targetType = UnlockTargetType::tryFrom((string) ($payload['target_type'] ?? ''));
        $ruleType = UnlockRuleType::tryFrom((string) ($payload['rule_type'] ?? ''));
        if (! $targetType || ! $ruleType) {
            throw ValidationException::withMessages(['rule' => 'Type de cible ou de règle invalide.']);
        }

        $targetId = (int) ($payload['target_id'] ?? 0);
        if ($targetId <= 0) {
            throw ValidationException::withMessages(['target_id' => 'Une cible valide est requise.']);
        }
        $target = $this->resolve($targetType, $targetId);
        $this->assertSameCourse($course, $target);

        $sourceType = null;
        $sourceId = null;
        $delayDays = null;
        $availableAt = null;

        if ($ruleType->requiresSource()) {
            $sourceType = $this->expectedSourceType($ruleType);
            $sourceId = (int) ($payload['source_id'] ?? 0);
            if ($sourceId <= 0) {
                throw ValidationException::withMessages(['source_id' => 'Un prérequis valide est requis.']);
            }
            $source = $this->resolve($sourceType, $sourceId);
            $this->assertSameCourse($course, $source);
            if ($sourceType === $targetType && $sourceId === $targetId) {
                throw ValidationException::withMessages(['source_id' => 'Une cible ne peut pas être son propre prérequis.']);
            }
            $this->assertNoForwardDependency($course, $sourceType, $sourceId, $targetType, $targetId);
        } elseif ($ruleType === UnlockRuleType::EnrollmentDelayDays) {
            $delayDays = (int) ($payload['delay_days'] ?? -1);
            if ($delayDays < 0 || $delayDays > 3650) {
                throw ValidationException::withMessages(['delay_days' => 'Le délai doit être compris entre 0 et 3650 jours.']);
            }
        } elseif ($ruleType === UnlockRuleType::FixedDatetime) {
            $availableAt = $payload['available_at'] ?? null;
            if (! is_string($availableAt) || trim($availableAt) === '' || strtotime($availableAt) === false) {
                throw ValidationException::withMessages(['available_at' => 'Une date de disponibilité valide est requise.']);
            }
        }

        $data = [
            'target_type' => $targetType->value,
            'target_id' => $targetId,
            'rule_type' => $ruleType->value,
            'source_type' => $sourceType?->value,
            'source_id' => $sourceId,
            'delay_days' => $delayDays,
            'available_at' => $availableAt,
            'is_enabled' => (bool) ($payload['is_enabled'] ?? true),
        ];
        if (array_key_exists('position', $payload)) {
            $data['position'] = max(0, (int) $payload['position']);
        }

        return $data;
    }

    public function nextPositionFor(Course $course, string $targetType, int $targetId): int
    {
        return ((int) CourseUnlockRule::query()
            ->where('course_id', $course->id)
            ->where('target_type', $targetType)
            ->where('target_id', $targetId)
            ->max('position')) + 1;
    }

    private function expectedSourceType(UnlockRuleType $ruleType): UnlockTargetType
    {
        return match ($ruleType) {
            UnlockRuleType::ModuleCompleted => UnlockTargetType::Module,
            UnlockRuleType::LessonCompleted => UnlockTargetType::Lesson,
            UnlockRuleType::AssessmentPassed => UnlockTargetType::Assessment,
            UnlockRuleType::AssignmentApproved => UnlockTargetType::Assignment,
            default => throw ValidationException::withMessages(['rule_type' => 'Cette règle ne possède pas de source.']),
        };
    }

    private function resolve(UnlockTargetType $type, int $id): Model
    {
        return match ($type) {
            UnlockTargetType::Module => Module::query()->findOrFail($id),
            UnlockTargetType::Lesson => Lesson::query()->with('module')->findOrFail($id),
            UnlockTargetType::Assessment => CourseAssessment::query()->findOrFail($id),
            UnlockTargetType::Assignment => CourseAssignment::query()->findOrFail($id),
        };
    }

    public function assertSameCourse(Course $course, Model $model): void
    {
        $courseId = match (true) {
            $model instanceof Module => (int) $model->course_id,
            $model instanceof Lesson => (int) $model->module?->course_id,
            $model instanceof CourseAssessment => (int) $model->course_id,
            $model instanceof CourseAssignment => (int) $model->course_id,
            default => 0,
        };

        if ($courseId !== (int) $course->id) {
            throw ValidationException::withMessages(['rule' => 'La cible et le prérequis doivent appartenir à la même formation.']);
        }
    }

    public function assertNoForwardDependency(Course $course, UnlockTargetType $sourceType, int $sourceId, UnlockTargetType $targetType, int $targetId): void
    {
        $sourceRank = $this->curriculumRank($course, $sourceType, $sourceId);
        $targetRank = $this->curriculumRank($course, $targetType, $targetId);

        if ($sourceRank >= $targetRank) {
            throw ValidationException::withMessages([
                'source_id' => 'Le prérequis doit se situer avant la cible dans la progression de la formation.',
            ]);
        }
    }

    private function curriculumRank(Course $course, UnlockTargetType $type, int $id): int
    {
        $course->loadMissing(['modules.lessons', 'assessments', 'assignments']);
        $moduleRanks = $course->modules->values()->mapWithKeys(fn (Module $module, int $index) => [$module->id => ($index + 1) * 1_000_000]);

        if ($type === UnlockTargetType::Module) {
            return (int) ($moduleRanks[$id] ?? PHP_INT_MAX);
        }
        if ($type === UnlockTargetType::Lesson) {
            foreach ($course->modules as $module) {
                foreach ($module->lessons->values() as $index => $lesson) {
                    if ((int) $lesson->id === $id) {
                        return (int) $moduleRanks[$module->id] + (($index + 1) * 1_000) + 100;
                    }
                }
            }
        }
        if ($type === UnlockTargetType::Assessment) {
            $item = $course->assessments->firstWhere('id', $id);
            if ($item) {
                return $this->attachedRank((int) ($item->module_id ?? 0), (int) ($item->lesson_id ?? 0), (int) $item->position, 300, $course, $moduleRanks);
            }
        }
        if ($type === UnlockTargetType::Assignment) {
            $item = $course->assignments->firstWhere('id', $id);
            if ($item) {
                return $this->attachedRank((int) ($item->module_id ?? 0), (int) ($item->lesson_id ?? 0), (int) $item->position, 600, $course, $moduleRanks);
            }
        }

        return PHP_INT_MAX;
    }

    /** @param Collection<int,int> $moduleRanks */
    private function attachedRank(int $moduleId, int $lessonId, int $position, int $offset, Course $course, Collection $moduleRanks): int
    {
        if ($lessonId > 0) {
            foreach ($course->modules as $module) {
                foreach ($module->lessons->values() as $index => $lesson) {
                    if ((int) $lesson->id === $lessonId) {
                        return (int) $moduleRanks[$module->id] + (($index + 1) * 1_000) + $offset + max(0, $position);
                    }
                }
            }
        }
        if ($moduleId > 0 && isset($moduleRanks[$moduleId])) {
            return (int) $moduleRanks[$moduleId] + 900_000 + $offset + max(0, $position);
        }

        return 9_000_000_000 + $offset + max(0, $position);
    }
}
