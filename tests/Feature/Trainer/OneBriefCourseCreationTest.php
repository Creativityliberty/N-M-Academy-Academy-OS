<?php

declare(strict_types=1);

use App\Enums\CourseStatus;
use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyPageSection;
use App\Models\Category;
use App\Models\CourseCreationRun;
use App\Models\CourseOffer;
use App\Models\User;
use App\Services\Courses\CourseCreationEngine;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

function oneBriefOpenAiResponse(array $payload): array
{
    return [
        'output' => [[
            'content' => [[
                'type' => 'output_text',
                'text' => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ]],
        ]],
    ];
}

function oneBriefCourseBlueprint(): array
{
    return [
        'title' => 'Canva Business Starter',
        'description' => 'Une formation pratique pour produire des visuels professionnels avec Canva.',
        'target_audience' => 'Entrepreneurs débutants',
        'level' => 'beginner',
        'language' => 'fr',
        'positioning' => [
            'main_problem' => 'Dépendre de prestataires pour chaque visuel',
            'desired_transformation' => 'Créer seul des contenus cohérents',
            'main_promise' => 'Maîtriser un système visuel simple en six semaines',
            'unique_angle' => 'Un projet de marque construit au fil des leçons',
        ],
        'suggested_price' => 149,
        'duration_minutes' => 120,
        'benefits' => ['Autonomie', 'Cohérence'],
        'objectives' => [[
            'title' => 'Créer une identité visuelle',
            'description' => 'Construire un kit cohérent et réutilisable.',
        ]],
        'prerequisites' => ['Un compte Canva'],
        'modules' => [[
            'title' => 'Fondations',
            'duration_minutes' => 120,
            'lessons' => [
                ['title' => 'Définir son système visuel', 'duration_minutes' => 45, 'content' => 'Contenu de la première leçon.'],
                ['title' => 'Construire son kit', 'duration_minutes' => 75, 'content' => 'Contenu de la deuxième leçon.'],
            ],
        ]],
    ];
}

function oneBriefPageBlueprint(): array
{
    $emptyItem = [
        'title' => '', 'description' => '', 'name' => '', 'quote' => '',
        'question' => '', 'answer' => '', 'label' => '', 'url' => '',
    ];

    return [
        'title' => 'Canva Business Starter',
        'slug_hint' => 'canva-business-starter',
        'meta_title' => 'Canva Business Starter',
        'meta_description' => 'Apprenez à créer vos visuels avec une méthode progressive.',
        'sections' => [
            [
                'type' => 'hero', 'variant' => 'centered',
                'headline' => 'Créez vos visuels avec méthode', 'subheadline' => 'Un parcours progressif.',
                'title' => '', 'description' => '', 'button_label' => 'Découvrir', 'button_url' => '#pricing',
                'course_id' => 0, 'items' => [$emptyItem],
            ],
            [
                'type' => 'curriculum', 'variant' => 'accordion',
                'headline' => '', 'subheadline' => '', 'title' => 'Programme', 'description' => '',
                'button_label' => '', 'button_url' => '', 'course_id' => 0, 'items' => [$emptyItem],
            ],
            [
                'type' => 'pricing', 'variant' => 'cards',
                'headline' => '', 'subheadline' => '', 'title' => 'Offre', 'description' => '',
                'button_label' => '', 'button_url' => '', 'course_id' => 0, 'items' => [$emptyItem],
            ],
        ],
    ];
}

function configureOneBriefProviders(): void
{
    config()->set('academy-ai.provider', 'openai');
    config()->set('academy-ai.image_provider', 'openai');
    config()->set('academy-ai.tts_provider', 'openai');
    config()->set('academy-ai.openai.api_key', 'test-key');
    config()->set('academy-ai.openai.base_url', 'https://api.openai.test/v1');
    config()->set('academy-ai.openai.model', 'test-model');
    config()->set('academy-ai.openai.image_model', 'gpt-image-test');
    config()->set('academy-ai.openai.tts_model', 'tts-test');
    config()->set('academy-ai.openai.tts_voice', 'alloy');
}

it('turns one brief into a complete reviewable draft without publishing', function () {
    Storage::fake('public');
    Bus::fake([IndexCourseKnowledge::class]);
    configureOneBriefProviders();

    Http::fake([
        'https://api.openai.test/v1/responses' => Http::sequence()
            ->push(oneBriefOpenAiResponse(oneBriefCourseBlueprint()))
            ->push(oneBriefOpenAiResponse(oneBriefPageBlueprint())),
        'https://api.openai.test/v1/images/generations' => Http::response([
            'data' => [['b64_json' => base64_encode('PNGDATA')]],
        ], 200),
        'https://api.openai.test/v1/audio/speech' => Http::response('MP3DATA', 200, ['Content-Type' => 'audio/mpeg']),
    ]);

    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $engine = app(CourseCreationEngine::class);

    $run = $engine->start($trainer, [
        'brief' => 'Créer une formation Canva de six semaines pour entrepreneurs débutants.',
        'category_id' => $category->id,
        'audience' => 'Entrepreneurs débutants',
        'outcome' => 'Créer seuls leurs visuels',
        'weeks' => 6,
        'price_major' => 197,
        'currency' => 'EUR',
        'generate_cover' => true,
        'generate_thumbnail' => true,
        'generate_audio' => true,
        'generate_landing' => true,
    ]);

    $guard = 0;
    while ($run->status === 'running' && $guard++ < 20) {
        $run = $engine->advance($trainer, $run);

        if ($run->current_step === 'narrations' && ($run->state['narrations']['generated'] ?? 0) === 1) {
            expect($run->course->modules->flatMap->lessons->filter(fn ($lesson) => filled($lesson->audio_url))->count())->toBe(1);
        }
    }

    $run->refresh()->load(['course.modules.lessons', 'page.sections', 'offer']);

    expect($run->status)->toBe('completed');
    expect($run->progress_percent)->toBe(100);
    expect($run->course)->not->toBeNull();
    expect($run->course->status)->toBe(CourseStatus::Draft);
    expect($run->course->published_at)->toBeNull();
    expect($run->course->stripe_product_id)->toBeNull();
    expect($run->course->stripe_price_id)->toBeNull();
    expect($run->course->modules)->toHaveCount(1);
    expect($run->course->modules->first()->lessons)->toHaveCount(2);
    expect($run->course->image)->not->toBeNull();
    expect($run->course->thumbnail)->not->toBeNull();
    expect($run->course->modules->first()->lessons->every(fn ($lesson) => filled($lesson->audio_url)))->toBeTrue();

    expect($run->offer)->not->toBeNull();
    expect($run->offer->slug)->toBe('ai-default');
    expect($run->offer->amount)->toBe(19700);
    expect($run->offer->is_default)->toBeTrue();
    expect($run->offer->stripe_product_id)->toBeNull();
    expect($run->offer->stripe_price_id)->toBeNull();

    expect($run->page)->not->toBeNull();
    expect($run->page->status)->toBe('draft');
    expect($run->page->published_at)->toBeNull();
    expect($run->page->sections->whereIn('type', ['hero', 'curriculum', 'pricing'])
        ->every(fn (AcademyPageSection $section) => (int) ($section->settings['course_id'] ?? 0) === $run->course_id))->toBeTrue();

    Bus::assertDispatched(IndexCourseKnowledge::class);
});

it('keeps optional media failures skippable and still reaches review', function () {
    Storage::fake('public');
    Bus::fake([IndexCourseKnowledge::class]);
    configureOneBriefProviders();
    config()->set('academy-ai.image_provider', 'disabled');
    config()->set('academy-ai.tts_provider', 'disabled');

    Http::fake([
        'https://api.openai.test/v1/responses' => Http::sequence()
            ->push(oneBriefOpenAiResponse(oneBriefCourseBlueprint())),
    ]);

    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $engine = app(CourseCreationEngine::class);

    $run = $engine->start($trainer, [
        'brief' => 'Créer une formation Canva complète sans dépendre de médias obligatoires.',
        'category_id' => $category->id,
        'generate_cover' => true,
        'generate_thumbnail' => true,
        'generate_audio' => true,
        'generate_landing' => false,
    ]);

    $guard = 0;
    while ($run->status === 'running' && $guard++ < 20) {
        $run = $engine->advance($trainer, $run);
    }

    $run->refresh();
    expect($run->status)->toBe('completed');
    expect($run->state['steps']['cover']['status'])->toBe('skipped');
    expect($run->state['steps']['thumbnail']['status'])->toBe('skipped');
    expect($run->state['steps']['narrations']['status'])->toBe('skipped');
    expect($run->state['steps']['landing']['status'])->toBe('skipped');
    expect(CourseOffer::where('course_id', $run->course_id)->where('slug', 'ai-default')->exists())->toBeTrue();
});

it('lets only the owning trainer open and advance a course creation run', function () {
    $owner = User::factory()->create();
    $owner->assignRole('trainer');
    $other = User::factory()->create();
    $other->assignRole('trainer');
    $category = Category::factory()->create();

    $run = CourseCreationRun::create([
        'user_id' => $owner->id,
        'brief' => 'Une idée de formation suffisamment longue pour le test.',
        'options' => ['category_id' => $category->id],
        'state' => ['steps' => []],
        'status' => 'running',
        'current_step' => 'blueprint',
        'step_status' => 'pending',
        'progress_percent' => 0,
    ]);

    $this->actingAs($other)
        ->postJson(route('trainer.course-creation.advance', $run))
        ->assertForbidden();

    $this->actingAs($other)
        ->get(route('trainer.course-creation.index', ['run' => $run->id]))
        ->assertNotFound();
});

it('can resume a failed durable run from the same step', function () {
    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $run = CourseCreationRun::create([
        'user_id' => $trainer->id,
        'brief' => 'Une formation de test suffisamment détaillée pour vérifier la reprise.',
        'options' => ['category_id' => $category->id],
        'state' => ['steps' => ['blueprint' => ['status' => 'failed', 'detail' => 'Échec', 'reason' => 'Provider indisponible']]],
        'status' => 'failed',
        'current_step' => 'blueprint',
        'step_status' => 'failed',
        'progress_percent' => 5,
        'error_message' => 'Provider indisponible',
    ]);

    $resumed = app(CourseCreationEngine::class)->resume($trainer, $run);

    expect($resumed->status)->toBe('running');
    expect($resumed->step_status)->toBe('pending');
    expect($resumed->current_step)->toBe('blueprint');
    expect($resumed->error_message)->toBeNull();
    expect($resumed->state['steps']['blueprint']['status'])->toBe('pending');
});
