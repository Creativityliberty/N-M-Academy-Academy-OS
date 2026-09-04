<?php

declare(strict_types=1);

use App\Actions\Trainer\AcademyAi\ApplyAcademyAiRunAction;
use App\Enums\LessonType;
use App\Mcp\AcademyMcpToolExecutor;
use App\Models\AcademyAiRun;
use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Services\Courses\CourseMediaGenerationService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

it('persists the canonical course positioning and simple text lesson domain', function () {
    $course = Course::factory()->create([
        'target_audience' => 'Entrepreneurs débutants',
        'level' => 'beginner',
        'language' => 'fr',
        'positioning' => [
            'main_problem' => 'Créer des visuels cohérents',
            'desired_transformation' => 'Publier seul',
            'main_promise' => 'Produire une identité visuelle en six semaines',
            'unique_angle' => 'Pratique guidée',
        ],
        'thumbnail' => 'https://example.test/thumb.png',
    ]);
    $module = Module::factory()->create([
        'course_id' => $course->id,
        'description' => 'Fondations',
        'objectives' => ['Comprendre les bases'],
        'minimum_access_rank' => 10,
    ]);
    $lesson = Lesson::factory()->create([
        'module_id' => $module->id,
        'type' => LessonType::Text->value,
        'content' => 'Une leçon textuelle.',
    ]);

    expect($course->fresh()->positioning['main_problem'])->toBe('Créer des visuels cohérents');
    expect($module->fresh()->objectives)->toBe(['Comprendre les bases']);
    expect($lesson->fresh()->type)->toBe(LessonType::Text);
});

it('materializes course.generate positioning and text lessons', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $run = AcademyAiRun::create([
        'user_id' => $trainer->id,
        'capability' => 'course.generate',
        'mode' => 'create',
        'prompt' => 'Créer une formation Canva',
        'input' => ['category_id' => $category->id],
        'output' => [
            'title' => 'Canva Starter',
            'description' => 'Créer des visuels professionnels.',
            'target_audience' => 'Entrepreneurs débutants',
            'level' => 'beginner',
            'language' => 'fr',
            'positioning' => [
                'main_problem' => 'Manque de cohérence visuelle',
                'desired_transformation' => 'Créer seul',
                'main_promise' => 'Maîtriser Canva',
                'unique_angle' => 'Projet concret',
            ],
            'suggested_price' => 197,
            'duration_minutes' => 90,
            'benefits' => ['Autonomie'],
            'objectives' => [['title' => 'Créer', 'description' => 'Créer un kit']],
            'prerequisites' => [],
            'modules' => [[
                'title' => 'Fondations',
                'duration_minutes' => 90,
                'lessons' => [['title' => 'Bienvenue', 'duration_minutes' => 15, 'content' => 'Texte de leçon']],
            ]],
        ],
        'provider' => 'fake',
        'model' => 'fake',
        'status' => 'succeeded',
    ]);

    app(ApplyAcademyAiRunAction::class)->handle($trainer, $run);

    $course = Course::where('trainer_id', $trainer->id)->where('title', 'Canva Starter')->firstOrFail();
    expect($course->target_audience)->toBe('Entrepreneurs débutants');
    expect($course->level)->toBe('beginner');
    expect($course->positioning['main_promise'])->toBe('Maîtriser Canva');
    expect($course->modules()->firstOrFail()->lessons()->firstOrFail()->type)->toBe(LessonType::Text);
});

it('lets MCP discover categories and edit curriculum without inventing ids', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $category = Category::factory()->create(['name' => 'Design']);
    $executor = app(AcademyMcpToolExecutor::class);

    $categories = $executor->execute($trainer, 'categories.list', []);
    expect(collect($categories['items'])->pluck('id'))->toContain($category->id);

    $created = $executor->execute($trainer, 'courses.create', [
        'category_id' => $category->id,
        'title' => 'Formation design',
        'description' => 'Une formation suffisamment détaillée.',
        'target_audience' => 'Créateurs',
        'level' => 'beginner',
        'language' => 'fr',
    ]);
    $courseId = (int) $created['course']['id'];
    $module = $executor->execute($trainer, 'modules.create', [
        'course_id' => $courseId,
        'title' => 'Module 1',
        'description' => 'Introduction',
        'minimum_access_rank' => 10,
    ]);
    $lesson = $executor->execute($trainer, 'lessons.create', [
        'module_id' => (int) $module['module']['id'],
        'title' => 'Leçon texte',
        'type' => 'text',
        'content' => 'Contenu',
    ]);

    expect($lesson['lesson']['type'])->toBe('text');
    expect($executor->execute($trainer, 'courses.get', ['course_id' => $courseId])['course']['targetAudience'])->toBe('Créateurs');
});

it('generates cover thumbnail and lesson narration through independent media providers', function () {
    Storage::fake('public');
    config()->set('academy-ai.image_provider', 'openai');
    config()->set('academy-ai.tts_provider', 'openai');
    config()->set('academy-ai.openai.api_key', 'test-key');
    config()->set('academy-ai.openai.base_url', 'https://api.openai.test/v1');
    config()->set('academy-ai.openai.image_model', 'gpt-image-2');
    config()->set('academy-ai.openai.tts_model', 'gpt-4o-mini-tts');
    config()->set('academy-ai.openai.tts_voice', 'alloy');

    Http::fake([
        'https://api.openai.test/v1/images/generations' => Http::response(['data' => [['b64_json' => base64_encode('PNGDATA')]]], 200),
        'https://api.openai.test/v1/audio/speech' => Http::response('MP3DATA', 200, ['Content-Type' => 'audio/mpeg']),
    ]);

    $course = Course::factory()->create();
    $module = Module::factory()->create(['course_id' => $course->id]);
    $lesson = Lesson::factory()->create(['module_id' => $module->id, 'type' => 'text', 'content' => 'Bonjour et bienvenue.']);
    $service = app(CourseMediaGenerationService::class);

    $cover = $service->generateCourseImage($course, 'Premium course cover', 'cover');
    $thumb = $service->generateCourseImage($course, 'Square thumbnail', 'thumbnail');
    $audio = $service->generateLessonAudio($lesson);

    expect($cover)->toContain('/storage/academy/generated/courses/');
    expect($thumb)->toContain('/storage/academy/generated/courses/');
    expect($audio)->toContain('/storage/academy/generated/courses/');
    expect($lesson->fresh()->type)->toBe(LessonType::Text);
    expect($lesson->fresh()->audio_url)->toBe($audio);
});
