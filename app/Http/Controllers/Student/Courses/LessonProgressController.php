<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student\Courses;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Services\LearningAccess\LearningAccessService;
use App\Services\Completion\CourseCompletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function store(Request $request, Lesson $lesson, LearningAccessService $access, CourseCompletionService $completion): RedirectResponse
    {
        $user = $request->user();

        abort_unless($access->canAccessLesson($user, $lesson), 403);

        LessonProgress::firstOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['completed_at' => now()],
        );

        $lesson->loadMissing('module.course');
        if ($lesson->module?->course) {
            $completion->evaluate($user, $lesson->module->course);
        }

        return back();
    }

    public function destroy(Request $request, Lesson $lesson, LearningAccessService $access): RedirectResponse
    {
        $user = $request->user();
        abort_unless($access->canAccessLesson($user, $lesson), 403);

        LessonProgress::where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->delete();

        return back();
    }
}
