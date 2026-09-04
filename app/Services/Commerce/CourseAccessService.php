<?php

declare(strict_types=1);

namespace App\Services\Commerce;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Services\LearningAccess\LearningAccessService;

/**
 * Backward-compatible adapter kept for historical call sites.
 * New learning access logic lives exclusively in LearningAccessService.
 */
class CourseAccessService
{
    public function __construct(private readonly LearningAccessService $learningAccess) {}

    public function rankFor(int $userId, int $courseId): ?int
    {
        return $this->learningAccess->rankFor($userId, $courseId);
    }

    public function canAccessModule(User $user, Module $module): bool
    {
        return $this->learningAccess->canAccessModule($user, $module);
    }

    public function canAccessLesson(User $user, Lesson $lesson): bool
    {
        return $this->learningAccess->canAccessLesson($user, $lesson);
    }
}
