<?php

declare(strict_types=1);

use App\AI\VisualPromptCompiler;
use App\Models\AcademyAiSetting;
use App\Models\Course;

it('compiles course context brand purpose and user direction into a reusable visual system prompt', function () {
    AcademyAiSetting::create([
        'scope' => 'academy',
        'image_provider' => 'gemini',
        'image_model' => 'gemini-3.1-flash-lite-image',
        'image_size' => '4K',
        'image_prompt_preset' => 'editorial',
        'respect_branding' => true,
        'avoid_embedded_text' => true,
    ]);

    config()->set('academy.name', 'Maison Test Academy');
    config()->set('academy.theme.preset', 'soft-glass');
    config()->set('academy.theme.primary', '#112233');
    config()->set('academy.theme.secondary', '#F4F4F4');
    config()->set('academy.theme.accent', '#CCAA22');

    $course = Course::factory()->create([
        'title' => 'Canva Business Starter',
        'target_audience' => 'Entrepreneurs débutants',
        'level' => 'beginner',
        'language' => 'fr',
        'positioning' => [
            'main_problem' => 'Créer des visuels cohérents',
            'desired_transformation' => 'Publier avec autonomie',
            'main_promise' => 'Créer une identité visuelle professionnelle',
            'unique_angle' => 'Un projet de marque complet',
        ],
    ]);

    $prompt = app(VisualPromptCompiler::class)->compileCourseImage(
        $course,
        'cover',
        'Direction manga premium, sans clichés.',
    );

    expect($prompt)->toContain('COURSE CONTEXT')
        ->and($prompt)->toContain('Canva Business Starter')
        ->and($prompt)->toContain('Entrepreneurs débutants')
        ->and($prompt)->toContain('ACADEMY BRAND')
        ->and($prompt)->toContain('Maison Test Academy')
        ->and($prompt)->toContain('#112233')
        ->and($prompt)->toContain('Purpose: course_cover')
        ->and($prompt)->toContain('Aspect ratio: 16:9')
        ->and($prompt)->toContain('Preset: editorial')
        ->and($prompt)->toContain('Premium editorial art direction')
        ->and($prompt)->toContain('Direction manga premium')
        ->and($prompt)->toContain('Do not embed text by default')
        ->and($prompt)->toContain('random logos');

    expect(app(\App\AI\AcademyAiSettingsRepository::class)->get()['image_size'])->toBe('1K');
});

it('uses a thumbnail-specific small-card composition', function () {
    $course = Course::factory()->create();
    $prompt = app(VisualPromptCompiler::class)->compileCourseImage($course, 'thumbnail');

    expect($prompt)->toContain('Purpose: course_thumbnail')
        ->and($prompt)->toContain('Aspect ratio: 1:1')
        ->and($prompt)->toContain('recognizable at small card size');
});
