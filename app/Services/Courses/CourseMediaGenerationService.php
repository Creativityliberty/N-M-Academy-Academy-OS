<?php

declare(strict_types=1);

namespace App\Services\Courses;

use App\AI\AcademyAiSettingsRepository;
use App\AI\MediaProviderManager;
use App\AI\VisualPromptCompiler;
use App\Models\Course;
use App\Models\CourseMediaGeneration;
use App\Models\Lesson;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class CourseMediaGenerationService
{
    public function __construct(
        private readonly MediaProviderManager $providers,
        private readonly VisualPromptCompiler $promptCompiler,
        private readonly AcademyAiSettingsRepository $settings,
    ) {}

    public function generateCourseImage(Course $course, string $prompt, string $purpose): string
    {
        $generation = $this->generateCourseImageCandidate($course, $prompt, $purpose, (int) $course->trainer_id);
        $field = $purpose === 'cover' ? 'image' : 'thumbnail';
        $course->update([$field => $generation->asset_url]);
        $generation->update(['status' => 'applied', 'applied_at' => now(), 'rejected_at' => null]);
        return (string) $generation->asset_url;
    }

    public function generateCourseImageCandidate(Course $course, string $userPrompt, string $purpose, ?int $userId = null): CourseMediaGeneration
    {
        if (! in_array($purpose, ['cover', 'thumbnail'], true)) {
            throw new RuntimeException('Purpose image Academy non supporté.');
        }

        $compiledPrompt = $this->promptCompiler->compileCourseImage($course, $purpose, $userPrompt);
        $provider = $this->providers->image();
        $size = $purpose === 'cover' ? '1536x1024' : '1024x1024';
        $result = $provider->generate($compiledPrompt, $size);
        $path = 'academy/generated/courses/'.$course->id.'/review/'.$purpose.'-'.Str::uuid().'.'.$result['extension'];
        Storage::disk('public')->put($path, $result['bytes']);
        $url = Storage::disk('public')->url($path);
        $runtime = $this->settings->get();

        return CourseMediaGeneration::create([
            'course_id' => $course->id,
            'user_id' => $userId ?: (int) $course->trainer_id,
            'purpose' => $purpose,
            'provider' => $provider->name(),
            'model' => $provider->model(),
            'compiled_prompt' => $compiledPrompt,
            'user_prompt' => trim($userPrompt) ?: null,
            'aspect_ratio' => $purpose === 'cover' ? '16:9' : '1:1',
            'image_size' => (string) ($runtime['image_size'] ?? '1K'),
            'asset_url' => $url,
            'mime_type' => $result['mime'] ?? null,
            'status' => 'candidate',
        ]);
    }

    public function generateLessonAudio(Lesson $lesson, ?string $voice = null, ?string $instructions = null): string
    {
        $lesson->loadMissing('module.course');
        $generation = $this->generateLessonAudioCandidate($lesson, $voice, $instructions, (int) $lesson->module->course->trainer_id);
        $lesson->update(['audio_url' => $generation->asset_url]);
        $generation->update(['status' => 'applied', 'applied_at' => now(), 'rejected_at' => null]);
        return (string) $generation->asset_url;
    }

    public function generateLessonAudioCandidate(Lesson $lesson, ?string $voice = null, ?string $instructions = null, ?int $userId = null): CourseMediaGeneration
    {
        $lesson->loadMissing('module.course');
        $text = trim((string) ($lesson->content ?: $lesson->transcript));
        if ($text === '') { throw new RuntimeException('La leçon ne contient aucun texte à narrer.'); }

        $provider = $this->providers->speech();
        $result = $provider->synthesize($text, $voice, $instructions);
        $courseId = (int) $lesson->module->course_id;
        $path = 'academy/generated/courses/'.$courseId.'/lessons/'.$lesson->id.'/review-narration-'.Str::uuid().'.'.$result['extension'];
        Storage::disk('public')->put($path, $result['bytes']);
        $url = Storage::disk('public')->url($path);

        return CourseMediaGeneration::create([
            'course_id' => $courseId,
            'user_id' => $userId ?: (int) $lesson->module->course->trainer_id,
            'lesson_id' => $lesson->id,
            'purpose' => 'lesson_audio',
            'provider' => $provider->name(),
            'model' => $provider->model(),
            'compiled_prompt' => mb_substr($text, 0, 30000),
            'user_prompt' => trim((string) $instructions) ?: null,
            'asset_url' => $url,
            'mime_type' => $result['mime'] ?? null,
            'status' => 'candidate',
        ]);
    }
}
