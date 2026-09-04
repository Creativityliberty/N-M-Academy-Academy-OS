<?php

declare(strict_types=1);

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseCreationRun;
use App\Models\CourseOffer;
use App\Models\CourseReviewProposal;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;

function m139PublishReadyCourse(User $trainer): array
{
    $course = Course::factory()->create([
        'trainer_id' => $trainer->id,
        'status' => CourseStatus::Draft->value,
        'stripe_product_id' => 'prod_existing',
        'stripe_price_id' => 'price_existing',
    ]);
    $module = Module::factory()->create(['course_id' => $course->id]);
    Lesson::factory()->create(['module_id' => $module->id, 'type' => 'text', 'content' => 'Contenu.']);
    $offer = CourseOffer::create([
        'course_id' => $course->id,
        'name' => 'Offre principale',
        'slug' => 'main',
        'billing_type' => 'one_time',
        'amount' => 19700,
        'currency' => 'EUR',
        'access_rank' => 0,
        'trial_days' => 0,
        'is_default' => true,
        'is_active' => true,
    ]);
    $run = CourseCreationRun::create([
        'user_id' => $trainer->id,
        'course_id' => $course->id,
        'offer_id' => $offer->id,
        'brief' => 'Formation prête pour revue et publication.',
        'options' => [],
        'state' => ['steps' => []],
        'status' => 'completed',
        'current_step' => 'review',
        'step_status' => 'completed',
        'progress_percent' => 100,
        'completed_at' => now(),
    ]);

    return [$course, $run, $offer];
}

it('blocks publication while a review proposal is pending', function () {
    $trainer = User::factory()->create(['stripe_onboarding_completed' => true]);
    $trainer->assignRole('trainer');
    [$course, $run] = m139PublishReadyCourse($trainer);

    CourseReviewProposal::create([
        'course_creation_run_id' => $run->id,
        'user_id' => $trainer->id,
        'course_id' => $course->id,
        'target_type' => 'cover',
        'before_payload' => [],
        'after_payload' => [],
        'status' => 'pending',
    ]);

    $this->actingAs($trainer)
        ->post(route('trainer.course-review.publish', $run))
        ->assertSessionHas('error', 'Traitez toutes les propositions en attente avant publication.');

    expect($course->fresh()->status)->toBe(CourseStatus::Draft);
});

it('requires an active default offer before publication', function () {
    $trainer = User::factory()->create(['stripe_onboarding_completed' => true]);
    $trainer->assignRole('trainer');
    [$course, $run, $offer] = m139PublishReadyCourse($trainer);
    $offer->update(['is_default' => false]);

    $this->actingAs($trainer)
        ->post(route('trainer.course-review.publish', $run))
        ->assertSessionHas('error', 'Une offre active par défaut est requise avant publication.');

    expect($course->fresh()->status)->toBe(CourseStatus::Draft);
});

it('publishes a review-ready course through the canonical publish lifecycle', function () {
    $trainer = User::factory()->create(['stripe_onboarding_completed' => true]);
    $trainer->assignRole('trainer');
    [$course, $run] = m139PublishReadyCourse($trainer);

    $this->actingAs($trainer)
        ->post(route('trainer.course-review.publish', $run))
        ->assertRedirect(route('trainer.course-review.show', $run));

    expect($course->fresh()->status)->toBe(CourseStatus::Published)
        ->and($course->fresh()->published_at)->not->toBeNull()
        ->and($course->fresh()->stripe_product_id)->toBe('prod_existing')
        ->and($course->fresh()->stripe_price_id)->toBe('price_existing');
});
