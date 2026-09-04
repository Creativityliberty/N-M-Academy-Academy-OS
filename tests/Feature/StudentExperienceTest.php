<?php

use App\Enums\RoleEnum;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonNote;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function studentWithEnrollment(): array
{
    $student = User::factory()->create(['email_verified_at' => now()]);
    $student->assignRole(RoleEnum::Student->value);

    $course = Course::factory()->published()->create();
    $module = Module::factory()->create(['course_id' => $course->id, 'order' => 1]);
    $firstLesson = Lesson::factory()->create(['module_id' => $module->id, 'order' => 1]);
    $secondLesson = Lesson::factory()->create(['module_id' => $module->id, 'order' => 2]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'enrolled_at' => now(),
    ]);

    return [$student, $course, $firstLesson, $secondLesson];
}

test('student dashboard exposes learning progress and next lesson', function () {
    [$student, $course, $firstLesson, $secondLesson] = studentWithEnrollment();

    LessonProgress::create([
        'user_id' => $student->id,
        'lesson_id' => $firstLesson->id,
        'completed_at' => now(),
    ]);

    $this->actingAs($student)
        ->get(route('student.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/dashboard')
            ->where('stats.enrolledCourses', 1)
            ->where('stats.completedLessons', 1)
            ->where('stats.totalLessons', 2)
            ->where('stats.progressPercentage', 50)
            ->where('continueLearning.courseId', $course->id)
            ->where('continueLearning.lessonId', $secondLesson->id)
        );
});

test('student can save and remove a private note for an enrolled lesson', function () {
    [$student, , $firstLesson] = studentWithEnrollment();

    $this->actingAs($student)
        ->post(route('student.lessons.notes.store', $firstLesson), [
            'content' => 'Revoir cette partie avant le quiz.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('lesson_notes', [
        'user_id' => $student->id,
        'lesson_id' => $firstLesson->id,
        'content' => 'Revoir cette partie avant le quiz.',
    ]);

    $this->actingAs($student)
        ->delete(route('student.lessons.notes.destroy', $firstLesson))
        ->assertRedirect();

    expect(LessonNote::where('user_id', $student->id)->where('lesson_id', $firstLesson->id)->exists())->toBeFalse();
});

test('student cannot save a note for a lesson outside their enrollments', function () {
    $student = User::factory()->create(['email_verified_at' => now()]);
    $student->assignRole(RoleEnum::Student->value);

    $lesson = Lesson::factory()->create();

    $this->actingAs($student)
        ->post(route('student.lessons.notes.store', $lesson), [
            'content' => 'Should never be stored.',
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('lesson_notes', [
        'user_id' => $student->id,
        'lesson_id' => $lesson->id,
    ]);
});

test('preview keeps paid lesson media and generated content private', function () {
    $student = User::factory()->create(['email_verified_at' => now()]);
    $student->assignRole(RoleEnum::Student->value);

    $course = Course::factory()->published()->create();
    $module = Module::factory()->create(['course_id' => $course->id, 'order' => 1]);
    $freeLesson = Lesson::factory()->free()->create([
        'module_id' => $module->id,
        'order' => 1,
        'type' => 'video_url',
        'video_url' => 'https://example.com/free-video',
        'content' => 'Free lesson body',
        'transcript' => 'Free transcript',
    ]);
    $paidLesson = Lesson::factory()->create([
        'module_id' => $module->id,
        'order' => 2,
        'type' => 'video_url',
        'video_url' => 'https://example.com/private-video',
        'content' => 'Private generated lesson body',
        'transcript' => 'Private paid transcript',
    ]);

    $this->actingAs($student)
        ->get(route('student.courses.show', $course->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('course.modules.0.lessons.0.id', $freeLesson->id)
            ->where('course.modules.0.lessons.0.video_url', 'https://example.com/free-video')
            ->where('course.modules.0.lessons.0.content', 'Free lesson body')
            ->where('course.modules.0.lessons.0.transcript', 'Free transcript')
            ->where('course.modules.0.lessons.1.id', $paidLesson->id)
            ->where('course.modules.0.lessons.1.video_url', null)
            ->where('course.modules.0.lessons.1.content', null)
            ->where('course.modules.0.lessons.1.transcript', null)
        );
});

test('public course page redacts paid lesson media and generated content', function () {
    $course = Course::factory()->published()->create();
    $module = Module::factory()->create(['course_id' => $course->id, 'order' => 1]);
    Lesson::factory()->create([
        'module_id' => $module->id,
        'order' => 1,
        'is_free' => false,
        'type' => 'video_url',
        'video_url' => 'https://example.com/private-public-page-video',
        'content' => 'Private paid lesson body',
        'transcript' => 'Private transcript on public page',
    ]);

    $this->get(route('courses.show', $course->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('course.modules.0.lessons.0.video_url', null)
            ->where('course.modules.0.lessons.0.content', null)
            ->where('course.modules.0.lessons.0.transcript', null)
        );
});
