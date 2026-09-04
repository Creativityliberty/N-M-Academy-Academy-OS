<?php

declare(strict_types=1);

use App\AI\Context\StudentAnalysisContextBuilder;
use App\AI\Contracts\AiProvider;
use App\Models\AcademyAiRun;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;

function fakeAcademyAiProvider(array $structured = [], string $text = 'Réponse AI'): AiProvider
{
    return new class($structured, $text) implements AiProvider {
        public function __construct(private array $structured, private string $text) {}
        public function name(): string { return 'fake'; }
        public function model(): string { return 'fake-model'; }
        public function text(string $system, string $prompt): string { return $this->text; }
        public function structured(string $system, string $prompt, string $schemaName, array $schema): array { return $this->structured; }
    };
}

it('lets a trainer open Academy AI', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');

    $this->actingAs($trainer)->get(route('trainer.academy-ai.index'))->assertOk();
});

it('applies a generated course only as a draft owned by the trainer', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();

    $run = AcademyAiRun::create([
        'user_id' => $trainer->id,
        'capability' => 'course.generate',
        'mode' => 'create',
        'prompt' => 'Créer une formation',
        'input' => ['category_id' => $category->id],
        'output' => [
            'title' => 'Academy AI Starter',
            'description' => 'Une formation générée.',
            'suggested_price' => 199,
            'duration_minutes' => 60,
            'benefits' => ['Clarté'],
            'objectives' => [['title' => 'Objectif', 'description' => 'Comprendre']],
            'prerequisites' => [],
            'modules' => [[
                'title' => 'Module 1',
                'duration_minutes' => 60,
                'lessons' => [['title' => 'Leçon 1', 'duration_minutes' => 20, 'content' => 'Contenu AI']],
            ]],
        ],
        'provider' => 'fake',
        'model' => 'fake-model',
        'status' => 'succeeded',
    ]);

    $this->actingAs($trainer)
        ->post(route('trainer.academy-ai.runs.apply', $run))
        ->assertRedirect();

    $course = Course::where('trainer_id', $trainer->id)->where('title', 'Academy AI Starter')->firstOrFail();
    expect($course->status->value)->toBe('draft');
    expect($course->stripe_product_id)->toBeNull();
    expect($course->modules()->firstOrFail()->lessons()->firstOrFail()->content)->toBe('Contenu AI');
    expect($run->fresh()->applied_at)->not->toBeNull();
});

it('does not let another trainer apply a run', function () {
    $owner = User::factory()->create();
    $owner->assignRole('trainer');
    $other = User::factory()->create();
    $other->assignRole('trainer');

    $run = AcademyAiRun::create([
        'user_id' => $owner->id,
        'capability' => 'lesson.rewrite',
        'mode' => 'modify',
        'prompt' => 'Rewrite',
        'input' => ['lesson_id' => 123],
        'output' => ['title' => 'X', 'content' => 'Y', 'change_summary' => 'Z'],
        'status' => 'succeeded',
    ]);

    $this->actingAs($other)->post(route('trainer.academy-ai.runs.apply', $run));
    expect($run->fresh()->applied_at)->toBeNull();
});

it('builds student analysis context without student PII', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $student = User::factory()->create([
        'name' => 'Private Student Name',
        'email' => 'private.student@example.test',
    ]);
    $student->assignRole('student');

    $course = Course::factory()->create(['trainer_id' => $trainer->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);
    Lesson::factory()->create(['module_id' => $module->id]);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'enrolled_at' => now(),
    ]);

    $context = app(StudentAnalysisContextBuilder::class)->build($trainer, $course->id);
    $json = json_encode($context);

    expect($json)->not->toContain('Private Student Name');
    expect($json)->not->toContain('private.student@example.test');
});

