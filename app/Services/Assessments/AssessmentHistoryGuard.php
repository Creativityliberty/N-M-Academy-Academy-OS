<?php

declare(strict_types=1);

namespace App\Services\Assessments;

use App\Models\CourseAssessment;
use Illuminate\Validation\ValidationException;

class AssessmentHistoryGuard
{
    public function assertQuestionBankMutable(CourseAssessment $assessment): void
    {
        if ($assessment->attempts()->exists()) {
            throw ValidationException::withMessages([
                'questions' => 'This assessment question bank is locked because historical student attempts already exist.',
            ]);
        }
    }

    public function assertDeletable(CourseAssessment $assessment): void
    {
        if ($assessment->attempts()->exists()) {
            throw ValidationException::withMessages([
                'assessment' => 'This assessment cannot be deleted because historical student attempts already exist. Disable it instead.',
            ]);
        }
    }
}
