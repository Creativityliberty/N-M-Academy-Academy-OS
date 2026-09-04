<?php

use App\Enums\RoleEnum;
use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyKnowledgeChunk;
use App\Models\AcademyKnowledgeDocument;
use App\Models\AcademyTutorSetting;
use App\Models\AcademyTutorRun;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\TutorQuizSession;
use App\Models\User;
use App\Tutor\KnowledgeRetriever;
use App\Tutor\PdfTextExtractor;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function tutorStudent(): User
{
    $student = User::factory()->create(['email_verified_at' => now()]);
    $student->assignRole(RoleEnum::Student->value);

    return $student;
}

function tutorTrainer(): User
{
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole(RoleEnum::Trainer->value);

    return $trainer;
}

test('student cannot use tutor for a course they are not enrolled in', function () {
    $student = tutorStudent();
    $course = Course::factory()->published()->create();

    $this->actingAs($student)
        ->postJson(route('student.tutor.run', $course), [
            'capability' => 'tutor.ask',
            'prompt' => 'Explique cette formation.',
        ])
        ->assertForbidden();
});

test('grounded tutor refuses unsupported answers without calling a provider', function () {
    $student = tutorStudent();
    $course = Course::factory()->published()->create();
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'enrolled_at' => now()]);
    AcademyTutorSetting::forTrainer((int) $course->trainer_id)->update(['outside_content_policy' => 'never']);

    $this->actingAs($student)
        ->postJson(route('student.tutor.run', $course), [
            'capability' => 'tutor.ask',
            'prompt' => 'Question absente du cours',
        ])
        ->assertOk()
        ->assertJsonPath('answer', 'Je ne trouve pas cette information dans les contenus autorisés de cette formation.')
        ->assertJsonCount(0, 'sources');

    $this->assertDatabaseHas('academy_tutor_runs', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'succeeded',
        'provider' => 'grounded',
    ]);
});

test('knowledge retriever requires enrollment before returning chunks', function () {
    $student = tutorStudent();
    $course = Course::factory()->published()->create();
    $module = Module::factory()->create(['course_id' => $course->id]);
    $lesson = Lesson::factory()->create(['module_id' => $module->id, 'content' => 'Backlinks et autorité de domaine.']);
    $document = AcademyKnowledgeDocument::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'lesson_id' => $lesson->id,
        'source_type' => 'lesson',
        'source_ref' => 'test:lesson:'.$lesson->id,
        'title' => $lesson->title,
        'content' => $lesson->content,
        'checksum' => hash('sha256', $lesson->content),
        'visibility' => 'enrolled',
        'index_status' => 'indexed',
        'indexed_at' => now(),
    ]);
    AcademyKnowledgeChunk::create([
        'document_id' => $document->id,
        'course_id' => $course->id,
        'lesson_id' => $lesson->id,
        'chunk_index' => 0,
        'content' => 'Un backlink est un lien entrant venant d’un autre site.',
        'token_count' => 14,
    ]);

    expect(fn () => app(KnowledgeRetriever::class)->search($student, $course, 'backlink'))
        ->toThrow(AuthorizationException::class);
});

test('quiz scoring stays local and belongs to the student', function () {
    $student = tutorStudent();
    $course = Course::factory()->published()->create();
    $session = TutorQuizSession::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'title' => 'SEO Quiz',
        'questions' => [
            ['type' => 'mcq', 'question' => 'SEO ?', 'options' => ['A', 'B'], 'answer' => 'A', 'explanation' => 'A est correct.'],
            ['type' => 'true_false', 'question' => 'Vrai ?', 'options' => ['Vrai', 'Faux'], 'answer' => 'Vrai', 'explanation' => 'Oui.'],
        ],
        'max_score' => 2,
    ]);

    $this->actingAs($student)
        ->postJson(route('student.tutor.quizzes.submit', $session), ['answers' => ['A', 'Faux']])
        ->assertOk()
        ->assertJsonPath('score', 1)
        ->assertJsonPath('maxScore', 2);

    $this->assertDatabaseHas('tutor_quiz_sessions', ['id' => $session->id, 'score' => 1, 'max_score' => 2]);
});

test('trainer tutor settings discard courses owned by another trainer', function () {
    $trainer = tutorTrainer();
    $other = tutorTrainer();
    $owned = Course::factory()->create(['trainer_id' => $trainer->id]);
    $foreign = Course::factory()->create(['trainer_id' => $other->id]);

    $this->actingAs($trainer)
        ->patch(route('trainer.tutor.update'), [
            'enabled' => true,
            'provider' => 'inherit',
            'model' => null,
            'personality' => 'helpful',
            'outside_content_policy' => 'never',
            'daily_limit' => 20,
            'monthly_budget_cents' => 0,
            'allowed_course_ids' => [$owned->id, $foreign->id],
        ])
        ->assertRedirect();

    expect(AcademyTutorSetting::forTrainer($trainer->id)->allowed_course_ids)->toBe([$owned->id])
        ->and(AcademyTutorSetting::forTrainer($other->id)->allowed_course_ids)->toBe([]);
});

test('trainer can queue a knowledge reindex for an owned course', function () {
    Queue::fake();
    $trainer = tutorTrainer();
    $course = Course::factory()->create(['trainer_id' => $trainer->id]);

    $this->actingAs($trainer)
        ->post(route('trainer.tutor.reindex', $course))
        ->assertRedirect();

    Queue::assertPushed(IndexCourseKnowledge::class, fn (IndexCourseKnowledge $job) => $job->courseId === $course->id);
});

test('student MCP role is limited to the student tool subset', function () {
    $student = tutorStudent();
    $trainer = tutorTrainer();
    $registry = app(\App\Mcp\AcademyMcpToolRegistry::class);

    expect($registry->allowedForUser('learning.progress.get', $student))->toBeTrue()
        ->and($registry->allowedForUser('course.knowledge.search', $student))->toBeTrue()
        ->and($registry->allowedForUser('courses.publish', $student))->toBeFalse()
        ->and($registry->allowedForUser('sales.summary', $student))->toBeFalse()
        ->and($registry->allowedForUser('courses.publish', $trainer))->toBeTrue()
        ->and($registry->allowedForUser('tutor.quiz.generate', $trainer))->toBeFalse();
});


test('monthly tutor budget is shared across a trainer academy instead of reset per student', function () {
    config([
        'academy-tutor.cost.input_per_million_cents' => 100,
        'academy-tutor.cost.output_per_million_cents' => 100,
    ]);

    $trainer = tutorTrainer();
    $student = tutorStudent();
    $otherStudent = tutorStudent();
    $course = Course::factory()->published()->create(['trainer_id' => $trainer->id]);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'enrolled_at' => now()]);

    AcademyTutorSetting::forTrainer($trainer->id)->update([
        'monthly_budget_cents' => 5,
        'daily_limit' => 100,
    ]);

    AcademyTutorRun::create([
        'user_id' => $otherStudent->id,
        'course_id' => $course->id,
        'capability' => 'tutor.ask',
        'question' => 'Previous usage',
        'status' => 'succeeded',
        'estimated_cost_cents' => 5,
    ]);

    $this->actingAs($student)
        ->postJson(route('student.tutor.run', $course), [
            'capability' => 'tutor.ask',
            'prompt' => 'Puis-je encore utiliser le Tutor ?',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('limit');
});

test('provider outage returns a graceful tutor unavailable response', function () {
    config([
        'academy-ai.openai.api_key' => '',
        'academy-tutor.embedding.provider' => 'disabled',
    ]);

    $trainer = tutorTrainer();
    $student = tutorStudent();
    $course = Course::factory()->published()->create(['trainer_id' => $trainer->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);
    $lesson = Lesson::factory()->create([
        'module_id' => $module->id,
        'content' => 'Les backlinks renforcent la popularité externe d’un site.',
    ]);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'enrolled_at' => now()]);
    AcademyTutorSetting::forTrainer($trainer->id)->update([
        'provider' => 'openai',
        'outside_content_policy' => 'never',
    ]);

    $document = AcademyKnowledgeDocument::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'lesson_id' => $lesson->id,
        'source_type' => 'lesson',
        'source_ref' => 'outage:lesson:'.$lesson->id,
        'title' => $lesson->title,
        'content' => $lesson->content,
        'checksum' => hash('sha256', $lesson->content),
        'visibility' => 'enrolled',
        'index_status' => 'indexed',
        'indexed_at' => now(),
    ]);
    AcademyKnowledgeChunk::create([
        'document_id' => $document->id,
        'course_id' => $course->id,
        'lesson_id' => $lesson->id,
        'chunk_index' => 0,
        'content' => $lesson->content,
        'token_count' => 14,
    ]);

    $this->actingAs($student)
        ->postJson(route('student.tutor.run', $course), [
            'capability' => 'tutor.ask',
            'prompt' => 'Explique les backlinks.',
            'lesson_id' => $lesson->id,
        ])
        ->assertStatus(503)
        ->assertJsonPath(
            'message',
            'Le Tutor AI est temporairement indisponible. Votre progression et vos cours restent accessibles.',
        );
});

test('pdf extraction refuses remote hosts outside the configured ImageKit endpoint', function () {
    config(['filesystems.disks.imagekit.endpoint_url' => 'https://ik.imagekit.io/academy']);
    Http::fake();

    expect(app(PdfTextExtractor::class)->extract('https://example.org/private.pdf'))->toBeNull();

    Http::assertNothingSent();
});
