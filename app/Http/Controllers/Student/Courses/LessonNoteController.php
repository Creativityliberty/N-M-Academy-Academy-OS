<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student\Courses;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonNote;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LessonNoteController extends Controller
{
    public function store(Request $request, Lesson $lesson, LearningAccessService $access): RedirectResponse
    {
        $user = $request->user();
        abort_unless($access->canAccessLesson($user, $lesson), 403);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
        ]);

        LessonNote::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['content' => $validated['content']],
        );

        return back();
    }

    public function destroy(Request $request, Lesson $lesson, LearningAccessService $access): RedirectResponse
    {
        $user = $request->user();
        abort_unless($access->canAccessLesson($user, $lesson), 403);

        LessonNote::where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->delete();

        return back();
    }
}
