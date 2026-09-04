<?php

declare(strict_types=1);

use App\Models\AcademyAiSetting;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('lets trainers configure non-secret AI provider preferences without exposing API keys', function () {
    config()->set('academy-ai.gemini.api_key', 'server-only-gemini-secret');
    config()->set('academy-ai.openai.api_key', 'server-only-openai-secret');

    $trainer = User::factory()->create();
    $trainer->assignRole('trainer');

    $this->actingAs($trainer)
        ->get(route('ai-providers.edit'))
        ->assertOk()
        ->assertDontSee('server-only-gemini-secret')
        ->assertDontSee('server-only-openai-secret')
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/ai-providers')
            ->where('configuredSecrets.gemini', true)
            ->where('configuredSecrets.openai', true)
            ->where('catalog.image.gemini.0.id', 'gemini-3.1-flash-lite-image')
        );

    $this->actingAs($trainer)
        ->patch(route('ai-providers.update'), [
            'text_provider' => 'deepseek',
            'text_model' => 'deepseek-v4-flash',
            'image_provider' => 'gemini',
            'image_model' => 'gemini-3.1-flash-lite-image',
            'image_size' => '4K',
            'image_prompt_preset' => 'cinematic',
            'respect_branding' => true,
            'avoid_embedded_text' => true,
            'tts_provider' => 'openai',
            'tts_model' => 'gpt-4o-mini-tts',
        ])
        ->assertSessionHasNoErrors();

    $settings = AcademyAiSetting::where('scope', 'academy')->firstOrFail();
    expect($settings->image_provider)->toBe('gemini')
        ->and($settings->image_model)->toBe('gemini-3.1-flash-lite-image')
        ->and($settings->image_size)->toBe('1K')
        ->and($settings->image_prompt_preset)->toBe('cinematic');
});

it('forbids ordinary users from AI provider settings', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('ai-providers.edit'))
        ->assertForbidden();
});
