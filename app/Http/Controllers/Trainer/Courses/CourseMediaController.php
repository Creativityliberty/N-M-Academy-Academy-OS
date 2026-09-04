<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Courses\CourseMediaGenerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use RuntimeException;

class CourseMediaController extends Controller
{
    public function __construct(private readonly CourseMediaGenerationService $media) {}

    public function generateImage(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'purpose' => ['required', Rule::in(['cover', 'thumbnail'])],
            'prompt' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        try {
            $this->media->generateCourseImage($course, $validated['prompt'], $validated['purpose']);
        } catch (RuntimeException $error) {
            return back()->with('error', $error->getMessage());
        }

        return back()->with(
            'success',
            $validated['purpose'] === 'cover'
                ? 'Cover générée avec succès.'
                : 'Thumbnail générée avec succès.',
        );
    }

    public function generateAudio(Request $request, Lesson $lesson): RedirectResponse
    {
        $lesson->loadMissing('module.course');
        Gate::authorize('update', $lesson->module->course);

        $validated = $request->validate([
            'voice' => ['nullable', 'string', 'max:80'],
            'instructions' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->media->generateLessonAudio(
                $lesson,
                $validated['voice'] ?? null,
                $validated['instructions'] ?? null,
            );
        } catch (RuntimeException $error) {
            return back()->with('error', $error->getMessage());
        }

        return back()->with('success', 'Narration audio générée avec succès.');
    }
}
