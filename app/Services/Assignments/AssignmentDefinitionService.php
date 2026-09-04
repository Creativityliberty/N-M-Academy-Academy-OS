<?php

declare(strict_types=1);

namespace App\Services\Assignments;

use App\Enums\AssignmentDeliverableType;
use App\Enums\AssignmentKind;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AssignmentDefinitionService
{
    /** @param array<string,mixed> $payload */
    public function create(Course $course, array $payload): CourseAssignment
    {
        return DB::transaction(function () use ($course, $payload): CourseAssignment {
            [$moduleId, $lessonId] = $this->targetIds($course, $payload);
            $data = $this->validated($payload);
            $assignment = $course->assignments()->create([
                ...collect($data)->except('rubric')->all(),
                'module_id' => $moduleId,
                'lesson_id' => $lessonId,
                'position' => (int) ($payload['position'] ?? (($course->assignments()->max('position') ?? 0) + 1)),
            ]);
            $this->replaceRubric($assignment, (array) $data['rubric']);

            return $assignment->fresh('rubricItems');
        });
    }

    /** @param array<string,mixed> $payload */
    public function update(CourseAssignment $assignment, array $payload): CourseAssignment
    {
        return DB::transaction(function () use ($assignment, $payload): CourseAssignment {
            $this->assertDefinitionMutable($assignment);
            $assignment->loadMissing('course');
            [$moduleId, $lessonId] = $this->targetIds($assignment->course, $payload);
            $data = $this->validated($payload);
            $assignment->update([
                ...collect($data)->except('rubric')->all(),
                'module_id' => $moduleId,
                'lesson_id' => $lessonId,
            ]);
            $this->replaceRubric($assignment, (array) $data['rubric']);

            return $assignment->fresh('rubricItems');
        });
    }

    public function delete(CourseAssignment $assignment): void
    {
        $this->assertDefinitionMutable($assignment);
        $assignment->delete();
    }

    public function assertDefinitionMutable(CourseAssignment $assignment): void
    {
        if ($assignment->submissions()->exists()) {
            throw ValidationException::withMessages([
                'assignment' => 'La définition et la rubric sont verrouillées dès qu’une soumission étudiante existe afin de préserver l’historique.',
            ]);
        }
    }

    /** @param array<string,mixed> $payload @return array<string,mixed> */
    private function validated(array $payload): array
    {
        $validator = validator($payload, [
            'title' => ['required','string','max:255'],
            'instructions' => ['required','string','max:60000'],
            'kind' => ['required', Rule::enum(AssignmentKind::class)],
            'deliverable_type' => ['required', Rule::enum(AssignmentDeliverableType::class)],
            'is_enabled' => ['sometimes','boolean'],
            'rubric' => ['required','array','min:1','max:20'],
            'rubric.*.criterion' => ['required','string','max:255'],
            'rubric.*.description' => ['nullable','string','max:5000'],
            'rubric.*.max_points' => ['required','integer','min:1','max:1000'],
        ]);

        return $validator->validate();
    }

    /** @param array<int,array<string,mixed>> $rubric */
    private function replaceRubric(CourseAssignment $assignment, array $rubric): void
    {
        $assignment->rubricItems()->delete();
        foreach ($rubric as $index => $item) {
            $assignment->rubricItems()->create([
                'criterion' => $item['criterion'],
                'description' => $item['description'] ?? null,
                'max_points' => (int) $item['max_points'],
                'position' => $index + 1,
            ]);
        }
    }

    /** @param array<string,mixed> $payload @return array{0:?int,1:?int} */
    private function targetIds(Course $course, array $payload): array
    {
        $moduleId = filled($payload['module_id'] ?? null) ? (int) $payload['module_id'] : null;
        $lessonId = filled($payload['lesson_id'] ?? null) ? (int) $payload['lesson_id'] : null;

        if ($lessonId) {
            $lesson = Lesson::query()->with('module:id,course_id')->find($lessonId);
            if (! $lesson || (int) $lesson->module?->course_id !== (int) $course->id) {
                throw new AuthorizationException('La leçon cible n’appartient pas à cette formation.');
            }
            $moduleId = (int) $lesson->module_id;
        } elseif ($moduleId && ! Module::query()->whereKey($moduleId)->where('course_id', $course->id)->exists()) {
            throw new AuthorizationException('Le module cible n’appartient pas à cette formation.');
        }

        return [$moduleId, $lessonId];
    }
}
