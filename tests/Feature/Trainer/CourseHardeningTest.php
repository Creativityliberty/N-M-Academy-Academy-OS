<?php

declare(strict_types=1);

use App\Actions\Courses\PublishCourseAction;
use App\Actions\Courses\UnpublishCourseAction;
use App\Actions\Trainer\Courses\DeleteCourseAction;
use App\Actions\Trainer\Courses\UpdateCourseAction;
use App\Enums\CourseStatus;
use App\Models\AcademyOrder;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseOffer;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('archives a course without deleting commerce history', function () {
    $trainer = User::factory()->create();
    $course = Course::factory()->published()->create([
        'trainer_id' => $trainer->id,
        'stripe_product_id' => null,
        'stripe_price_id' => null,
    ]);
    $offer = CourseOffer::create([
        'course_id' => $course->id,
        'name' => 'Standard',
        'slug' => 'standard',
        'billing_type' => 'one_time',
        'amount' => 19900,
        'currency' => 'EUR',
        'access_rank' => 0,
        'is_default' => true,
        'is_active' => true,
    ]);

    app(DeleteCourseAction::class)->handle($course);

    expect(Course::query()->find($course->id))->not->toBeNull();
    expect($course->fresh()->status)->toBe(CourseStatus::Archived);
    expect($course->fresh()->published_at)->toBeNull();
    expect($offer->fresh()->is_active)->toBeFalse();
});

it('keeps an uploaded audio file when adding a new lesson during course update', function () {
    Storage::fake('imagekit');
    config()->set('filesystems.disks.imagekit.endpoint_url', 'https://cdn.example.test');

    $course = Course::factory()->create();
    $module = Module::factory()->create(['course_id' => $course->id, 'order' => 1]);
    $audio = UploadedFile::fake()->create('lesson.mp3', 8, 'audio/mpeg');

    app(UpdateCourseAction::class)->handle($course, [
        'category_id' => $course->category_id,
        'title' => $course->title,
        'description' => $course->description,
        'price' => (float) $course->price,
        'duration' => (int) $course->duration,
        'modules' => [[
            'id' => $module->id,
            'title' => $module->title,
            'duration' => (int) $module->duration,
            'lessons' => [[
                'title' => 'Nouvelle leçon audio',
                'content' => 'Contenu audio',
                'transcript' => null,
                'duration' => 10,
                'is_free' => false,
                'type' => 'audio',
                'audio_file' => $audio,
            ]],
        ]],
    ]);

    $lesson = Lesson::query()->where('module_id', $module->id)->firstOrFail();
    expect($lesson->audio_url)->not->toBeNull();
    $path = ltrim((string) parse_url($lesson->audio_url, PHP_URL_PATH), '/');
    Storage::disk('imagekit')->assertExists($path);
});

it('removes stale audio when an existing lesson switches to video', function () {
    Storage::fake('imagekit');
    config()->set('filesystems.disks.imagekit.endpoint_url', 'https://cdn.example.test');

    $course = Course::factory()->create();
    $module = Module::factory()->create(['course_id' => $course->id, 'order' => 1]);
    $path = 'Mindfulness/Audio/Lessons/old.mp3';
    Storage::disk('imagekit')->put($path, 'old audio');
    $lesson = Lesson::factory()->create([
        'module_id' => $module->id,
        'type' => 'audio',
        'audio_url' => 'https://cdn.example.test/'.$path,
        'video_url' => null,
        'pdf_url' => null,
    ]);

    app(UpdateCourseAction::class)->handle($course, [
        'category_id' => $course->category_id,
        'title' => $course->title,
        'description' => $course->description,
        'price' => (float) $course->price,
        'duration' => (int) $course->duration,
        'modules' => [[
            'id' => $module->id,
            'title' => $module->title,
            'duration' => (int) $module->duration,
            'lessons' => [[
                'id' => $lesson->id,
                'title' => $lesson->title,
                'content' => $lesson->content,
                'transcript' => $lesson->transcript,
                'duration' => (int) $lesson->duration,
                'is_free' => (bool) $lesson->is_free,
                'type' => 'video_url',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ]],
        ]],
    ]);

    expect($lesson->fresh()->audio_url)->toBeNull();
    expect($lesson->fresh()->video_url)->toContain('youtube.com');
    Storage::disk('imagekit')->assertMissing($path);
});

it('uses one lifecycle for publish and unpublish timestamps', function () {
    $trainer = User::factory()->create(['stripe_onboarding_completed' => true]);
    $course = Course::factory()->create([
        'trainer_id' => $trainer->id,
        'stripe_product_id' => 'prod_test',
        'stripe_price_id' => 'price_test',
        'published_at' => null,
    ]);

    $published = app(PublishCourseAction::class)->handle($course);
    expect($published->status)->toBe(CourseStatus::Published);
    expect($published->published_at)->not->toBeNull();

    $draft = app(UnpublishCourseAction::class)->handle($published);
    expect($draft->status)->toBe(CourseStatus::Draft);
    expect($draft->published_at)->toBeNull();
});

it('refuses account deletion when financial history must be retained', function () {
    $trainer = User::factory()->create();
    $buyer = User::factory()->create();
    $course = Course::factory()->create(['trainer_id' => $trainer->id]);

    AcademyOrder::create([
        'trainer_id' => $trainer->id,
        'user_id' => $buyer->id,
        'course_id' => $course->id,
    ]);

    $this->actingAs($buyer)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertSessionHas('error');

    expect($buyer->fresh())->not->toBeNull();
});

it('requires a page target when optimizing a page with Academy AI', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');

    $this->actingAs($trainer)
        ->post(route('trainer.academy-ai.run'), [
            'capability' => 'page.optimize',
            'prompt' => 'Optimise cette page',
            'input' => [],
        ])
        ->assertSessionHasErrors('input.page_id');
});
