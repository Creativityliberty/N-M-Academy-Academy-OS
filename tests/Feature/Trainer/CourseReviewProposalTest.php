<?php

declare(strict_types=1);

use App\Enums\LessonType;
use App\Jobs\IndexCourseKnowledge;
use App\Models\Course;
use App\Models\CourseCreationRun;
use App\Models\CourseMediaGeneration;
use App\Models\CourseReviewProposal;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Services\Courses\CourseReviewProposalService;
use Illuminate\Support\Facades\Bus;

function m139ReviewRun(User $trainer, Course $course): CourseCreationRun
{
    return CourseCreationRun::create([
        'user_id' => $trainer->id,
        'course_id' => $course->id,
        'brief' => 'Créer une formation complète puis la revoir avant publication.',
        'options' => [],
        'state' => ['steps' => []],
        'status' => 'completed',
        'current_step' => 'review',
        'step_status' => 'completed',
        'progress_percent' => 100,
        'completed_at' => now(),
    ]);
}

it('keeps lesson regeneration as a proposal until the trainer accepts it', function () {
    Bus::fake([IndexCourseKnowledge::class]);
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $course = Course::factory()->create(['trainer_id' => $trainer->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);
    $lesson = Lesson::factory()->create([
        'module_id' => $module->id,
        'type' => LessonType::Text->value,
        'content' => 'Ancien contenu.',
    ]);
    $run = m139ReviewRun($trainer, $course);

    $proposal = CourseReviewProposal::create([
        'course_creation_run_id' => $run->id,
        'user_id' => $trainer->id,
        'course_id' => $course->id,
        'target_type' => 'lesson',
        'target_id' => $lesson->id,
        'instruction' => 'Rends la leçon plus claire.',
        'before_payload' => ['title' => $lesson->title, 'content' => 'Ancien contenu.'],
        'after_payload' => ['title' => 'Leçon améliorée', 'content' => 'Nouveau contenu.'],
        'status' => 'pending',
    ]);

    expect($lesson->fresh()->content)->toBe('Ancien contenu.');

    app(CourseReviewProposalService::class)->accept($trainer, $proposal);

    expect($lesson->fresh()->content)->toBe('Nouveau contenu.')
        ->and($proposal->fresh()->status)->toBe('accepted');
    Bus::assertDispatched(IndexCourseKnowledge::class);
});

it('rejects a media candidate without replacing the current course cover', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $course = Course::factory()->create([
        'trainer_id' => $trainer->id,
        'image' => '/storage/original-cover.png',
    ]);
    $run = m139ReviewRun($trainer, $course);
    $generation = CourseMediaGeneration::create([
        'course_id' => $course->id,
        'user_id' => $trainer->id,
        'purpose' => 'cover',
        'provider' => 'gemini',
        'model' => 'gemini-3.1-flash-lite-image',
        'compiled_prompt' => 'Compiled prompt',
        'aspect_ratio' => '16:9',
        'image_size' => '1K',
        'asset_url' => '/storage/candidate-cover.png',
        'mime_type' => 'image/png',
        'status' => 'candidate',
    ]);
    $proposal = CourseReviewProposal::create([
        'course_creation_run_id' => $run->id,
        'user_id' => $trainer->id,
        'course_id' => $course->id,
        'target_type' => 'cover',
        'media_generation_id' => $generation->id,
        'before_payload' => ['url' => '/storage/original-cover.png'],
        'after_payload' => ['url' => '/storage/candidate-cover.png'],
        'status' => 'pending',
    ]);

    app(CourseReviewProposalService::class)->reject($trainer, $proposal);

    expect($course->fresh()->image)->toBe('/storage/original-cover.png')
        ->and($proposal->fresh()->status)->toBe('rejected')
        ->and($generation->fresh()->status)->toBe('rejected');
});

it('prevents another trainer from accepting a review proposal', function () {
    $owner = User::factory()->create();
    $owner->assignRole('trainer');
    $other = User::factory()->create();
    $other->assignRole('trainer');
    $course = Course::factory()->create(['trainer_id' => $owner->id]);
    $run = m139ReviewRun($owner, $course);
    $proposal = CourseReviewProposal::create([
        'course_creation_run_id' => $run->id,
        'user_id' => $owner->id,
        'course_id' => $course->id,
        'target_type' => 'course_positioning',
        'before_payload' => [],
        'after_payload' => [],
        'status' => 'pending',
    ]);

    expect(fn () => app(CourseReviewProposalService::class)->accept($other, $proposal))
        ->toThrow(\Illuminate\Auth\Access\AuthorizationException::class);
});
