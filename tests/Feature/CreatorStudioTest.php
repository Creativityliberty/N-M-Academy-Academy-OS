<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\Public\Courses\WebhookController as CourseWebhookController;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function creatorStudioTrainer(): User
{
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole(RoleEnum::Trainer->value);

    return $trainer;
}

test('trainer creator studio exposes students sales and analytics from owned courses', function () {
    $trainer = creatorStudioTrainer();
    $student = User::factory()->create();
    $course = Course::factory()->published()->create(['trainer_id' => $trainer->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);
    $lesson = Lesson::factory()->create(['module_id' => $module->id]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'amount_paid' => 149.00,
        'currency' => 'EUR',
        'paid_at' => now(),
        'enrolled_at' => now(),
    ]);

    LessonProgress::create([
        'user_id' => $student->id,
        'lesson_id' => $lesson->id,
        'completed_at' => now(),
    ]);

    $this->actingAs($trainer)
        ->get(route('trainer.students.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('trainer/students/index')
            ->where('stats.uniqueStudents', 1)
            ->where('stats.totalEnrollments', 1)
            ->where('students.0.email', $student->email)
        );

    $this->actingAs($trainer)
        ->get(route('trainer.sales.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('trainer/sales/index')
            ->where('stats.recordedSales', 1)
            ->where('stats.revenueByCurrency.0.currency', 'EUR')
            ->where('stats.revenueByCurrency.0.amount', 149.0)
        );

    $this->actingAs($trainer)
        ->get(route('trainer.analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('trainer/analytics/index')
            ->where('stats.students', 1)
            ->where('stats.averageCompletion', 100)
            ->where('courses.0.completionRate', 100)
        );
});

test('course purchase webhook snapshots paid amount currency and timestamp', function () {
    $student = User::factory()->create();
    $course = Course::factory()->published()->create();

    app(CourseWebhookController::class)->handleCheckoutSessionCompleted([
        'data' => [
            'object' => [
                'payment_intent' => 'pi_creator_studio_test',
                'amount_total' => 12900,
                'currency' => 'eur',
                'created' => now()->timestamp,
                'metadata' => [
                    'student_id' => (string) $student->id,
                    'course_id' => (string) $course->id,
                ],
            ],
        ],
    ]);

    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'stripe_payment_intent_id' => 'pi_creator_studio_test',
        'amount_paid' => 129.00,
        'currency' => 'EUR',
    ]);
});
