<?php

declare(strict_types=1);

namespace App\Services\LearningAccess;

use App\Data\LearningAccessDecision;
use App\Enums\AssignmentSubmissionStatus;
use App\Enums\UnlockRuleType;
use App\Enums\UnlockTargetType;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssessmentAttempt;
use App\Models\CourseAssignment;
use App\Models\CourseAssignmentSubmission;
use App\Models\CourseUnlockRule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class LearningAccessService
{
    public function rankFor(int $userId, int $courseId): ?int
    {
        return $this->enrollmentFor($userId, $courseId)?->access_rank;
    }

    public function enrollmentFor(int $userId, int $courseId): ?Enrollment
    {
        return Enrollment::query()
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
    }

    public function isEntitledModule(User $user, Module $module): bool
    {
        $enrollment = $this->enrollmentFor((int) $user->id, (int) $module->course_id);

        return $enrollment !== null
            && (int) $enrollment->access_rank >= (int) ($module->minimum_access_rank ?? 0);
    }

    public function isEntitledLesson(User $user, Lesson $lesson): bool
    {
        $lesson->loadMissing('module');

        return $lesson->module !== null && $this->isEntitledModule($user, $lesson->module);
    }

    public function isEntitledAssessment(User $user, CourseAssessment $assessment): bool
    {
        $assessment->loadMissing(['module', 'lesson.module']);
        if (! $this->enrollmentFor((int) $user->id, (int) $assessment->course_id)) {
            return false;
        }
        if ($assessment->lesson_id && $assessment->lesson) {
            return $this->isEntitledLesson($user, $assessment->lesson);
        }
        if ($assessment->module_id && $assessment->module) {
            return $this->isEntitledModule($user, $assessment->module);
        }

        return true;
    }

    public function isEntitledAssignment(User $user, CourseAssignment $assignment): bool
    {
        $assignment->loadMissing(['module', 'lesson.module']);
        if (! $this->enrollmentFor((int) $user->id, (int) $assignment->course_id)) {
            return false;
        }
        if ($assignment->lesson_id && $assignment->lesson) {
            return $this->isEntitledLesson($user, $assignment->lesson);
        }
        if ($assignment->module_id && $assignment->module) {
            return $this->isEntitledModule($user, $assignment->module);
        }

        return true;
    }

    public function canAccessModule(User $user, Module $module): bool
    {
        return $this->decisionForModule($user, $module)->allowed;
    }

    public function canAccessLesson(User $user, Lesson $lesson): bool
    {
        return $this->decisionForLesson($user, $lesson)->allowed;
    }

    public function canAccessAssessment(User $user, CourseAssessment $assessment): bool
    {
        return $this->decisionForAssessment($user, $assessment)->allowed;
    }

    public function canAccessAssignment(User $user, CourseAssignment $assignment): bool
    {
        return $this->decisionForAssignment($user, $assignment)->allowed;
    }

    public function decisionForModule(User $user, Module $module): LearningAccessDecision
    {
        $enrollment = $this->enrollmentFor((int) $user->id, (int) $module->course_id);
        if (! $enrollment) {
            return $this->denied('Inscription requise pour accéder à ce module.');
        }
        if ((int) $enrollment->access_rank < (int) ($module->minimum_access_rank ?? 0)) {
            return $this->denied('Ce module nécessite un niveau d’accès supérieur.');
        }

        return $this->rulesDecision($user, $enrollment, (int) $module->course_id, UnlockTargetType::Module, (int) $module->id);
    }

    public function decisionForLesson(User $user, Lesson $lesson): LearningAccessDecision
    {
        $lesson->loadMissing('module');
        if (! $lesson->module) {
            return $this->denied('Le module de cette leçon est introuvable.');
        }

        $moduleDecision = $this->decisionForModule($user, $lesson->module);
        if (! $moduleDecision->allowed) {
            return $moduleDecision;
        }

        $enrollment = $this->enrollmentFor((int) $user->id, (int) $lesson->module->course_id);
        if (! $enrollment) {
            return $this->denied('Inscription requise pour accéder à cette leçon.');
        }

        return $this->rulesDecision($user, $enrollment, (int) $lesson->module->course_id, UnlockTargetType::Lesson, (int) $lesson->id);
    }

    public function decisionForAssessment(User $user, CourseAssessment $assessment): LearningAccessDecision
    {
        $assessment->loadMissing(['module', 'lesson.module']);
        $courseId = (int) $assessment->course_id;
        $enrollment = $this->enrollmentFor((int) $user->id, $courseId);
        if (! $enrollment) {
            return $this->denied('Inscription requise pour accéder à cette évaluation.');
        }
        if ($assessment->lesson_id && $assessment->lesson) {
            $parent = $this->decisionForLesson($user, $assessment->lesson);
            if (! $parent->allowed) {
                return $parent;
            }
        } elseif ($assessment->module_id && $assessment->module) {
            $parent = $this->decisionForModule($user, $assessment->module);
            if (! $parent->allowed) {
                return $parent;
            }
        }

        return $this->rulesDecision($user, $enrollment, $courseId, UnlockTargetType::Assessment, (int) $assessment->id);
    }

    public function decisionForAssignment(User $user, CourseAssignment $assignment): LearningAccessDecision
    {
        $assignment->loadMissing(['module', 'lesson.module']);
        $courseId = (int) $assignment->course_id;
        $enrollment = $this->enrollmentFor((int) $user->id, $courseId);
        if (! $enrollment) {
            return $this->denied('Inscription requise pour accéder à ce projet.');
        }
        if ($assignment->lesson_id && $assignment->lesson) {
            $parent = $this->decisionForLesson($user, $assignment->lesson);
            if (! $parent->allowed) {
                return $parent;
            }
        } elseif ($assignment->module_id && $assignment->module) {
            $parent = $this->decisionForModule($user, $assignment->module);
            if (! $parent->allowed) {
                return $parent;
            }
        }

        return $this->rulesDecision($user, $enrollment, $courseId, UnlockTargetType::Assignment, (int) $assignment->id);
    }

    /** @return list<int> */
    public function entitledLessonIds(User $user, Course $course): array
    {
        $course->loadMissing('modules.lessons');

        return $course->modules
            ->flatMap(fn (Module $module) => $module->lessons)
            ->filter(fn (Lesson $lesson) => $this->isEntitledLesson($user, $lesson))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }

    /** @return list<int> */
    public function accessibleLessonIds(User $user, Course $course): array
    {
        $course->loadMissing('modules.lessons');

        return $course->modules
            ->flatMap(fn (Module $module) => $module->lessons)
            ->filter(fn (Lesson $lesson) => $this->canAccessLesson($user, $lesson))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }

    private function rulesDecision(User $user, Enrollment $enrollment, int $courseId, UnlockTargetType $targetType, int $targetId): LearningAccessDecision
    {
        if (! (bool) config('academy.features.drip', true)) {
            return new LearningAccessDecision(true);
        }

        /** @var Collection<int,CourseUnlockRule> $rules */
        $rules = CourseUnlockRule::query()
            ->where('course_id', $courseId)
            ->where('target_type', $targetType->value)
            ->where('target_id', $targetId)
            ->where('is_enabled', true)
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        if ($rules->isEmpty()) {
            return new LearningAccessDecision(true);
        }

        $reasons = [];
        $unlockAt = null;
        foreach ($rules as $rule) {
            [$passed, $reason, $candidateUnlock] = $this->evaluateRule($user, $enrollment, $rule);
            if ($passed) {
                continue;
            }
            if ($reason !== null) {
                $reasons[] = $reason;
            }
            if ($candidateUnlock !== null && ($unlockAt === null || $candidateUnlock->greaterThan($unlockAt))) {
                $unlockAt = $candidateUnlock;
            }
        }

        if ($reasons === []) {
            return new LearningAccessDecision(true);
        }

        return new LearningAccessDecision(
            false,
            array_values(array_unique($reasons)),
            $unlockAt?->toIso8601String(),
        );
    }

    /** @return array{0:bool,1:?string,2:?CarbonInterface} */
    private function evaluateRule(User $user, Enrollment $enrollment, CourseUnlockRule $rule): array
    {
        $type = $rule->rule_type;

        if ($type === UnlockRuleType::EnrollmentDelayDays) { // enrollment_delay_days
            $base = $enrollment->enrolled_at ?? $enrollment->created_at;
            $unlockAt = $base?->copy()->addDays((int) ($rule->delay_days ?? 0));
            $passed = $unlockAt === null || now()->greaterThanOrEqualTo($unlockAt);

            return [$passed, $passed ? null : sprintf('Disponible %d jour(s) après votre inscription.', (int) ($rule->delay_days ?? 0)), $passed ? null : $unlockAt];
        }

        if ($type === UnlockRuleType::FixedDatetime) { // fixed_datetime
            $unlockAt = $rule->available_at;
            $passed = $unlockAt === null || now()->greaterThanOrEqualTo($unlockAt);

            return [$passed, $passed ? null : 'Disponible à partir du '.$unlockAt?->locale('fr')->translatedFormat('d F Y à H:i').'.', $passed ? null : $unlockAt];
        }

        $sourceId = (int) ($rule->source_id ?? 0);
        return match ($type) {
            UnlockRuleType::ModuleCompleted => [ // module_completed
                $this->moduleCompleted($user, $sourceId),
                'Terminez le module prérequis pour continuer.',
                null,
            ],
            UnlockRuleType::LessonCompleted => [ // lesson_completed
                LessonProgress::query()->where('user_id', $user->id)->where('lesson_id', $sourceId)->exists(),
                'Terminez la leçon prérequise pour continuer.',
                null,
            ],
            UnlockRuleType::AssessmentPassed => [ // assessment_passed
                CourseAssessmentAttempt::query()->where('user_id', $user->id)->where('assessment_id', $sourceId)->where('passed', true)->exists(),
                'Réussissez l’évaluation prérequise pour continuer.',
                null,
            ],
            UnlockRuleType::AssignmentApproved => [ // assignment_approved
                CourseAssignmentSubmission::query()->where('user_id', $user->id)->where('assignment_id', $sourceId)->where('status', AssignmentSubmissionStatus::Approved->value)->exists(),
                'Faites approuver le projet prérequis pour continuer.',
                null,
            ],
            default => [false, 'Une règle de déverrouillage est invalide.', null],
        };
    }

    private function moduleCompleted(User $user, int $moduleId): bool
    {
        $lessonIds = Lesson::query()->where('module_id', $moduleId)->pluck('id');
        if ($lessonIds->isEmpty()) {
            return false;
        }

        $completed = LessonProgress::query()
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->distinct()
            ->count('lesson_id');

        return $completed === $lessonIds->count();
    }

    private function denied(string $reason): LearningAccessDecision
    {
        return new LearningAccessDecision(false, [$reason]);
    }
}
