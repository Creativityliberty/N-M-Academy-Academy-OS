<?php

declare(strict_types=1);

namespace App\Enums;

enum UnlockRuleType: string
{
    case EnrollmentDelayDays = 'enrollment_delay_days';
    case FixedDatetime = 'fixed_datetime';
    case ModuleCompleted = 'module_completed';
    case LessonCompleted = 'lesson_completed';
    case AssessmentPassed = 'assessment_passed';
    case AssignmentApproved = 'assignment_approved';

    public function requiresSource(): bool
    {
        return match ($this) {
            self::ModuleCompleted,
            self::LessonCompleted,
            self::AssessmentPassed,
            self::AssignmentApproved => true,
            default => false,
        };
    }
}
