<?php

declare(strict_types=1);

$provider = env('ACADEMY_AI_PROVIDER');

if (! is_string($provider) || trim($provider) === '') {
    $provider = env('OPENAI_API_KEY')
        ? 'openai'
        : (env('DEEPSEEK_API_KEY') ? 'deepseek' : 'disabled');
}

return [
    'provider' => strtolower(trim((string) $provider)),
    'timeout' => (int) env('ACADEMY_AI_TIMEOUT', 90),
    'media_timeout' => (int) env('ACADEMY_MEDIA_TIMEOUT', 180),
    'image_provider' => strtolower((string) env('ACADEMY_IMAGE_PROVIDER', env('GEMINI_API_KEY') ? 'gemini' : (env('OPENAI_API_KEY') ? 'openai' : 'disabled'))),
    'image_size' => env('ACADEMY_IMAGE_SIZE', '1K'),
    'image_prompt_preset' => env('ACADEMY_IMAGE_PROMPT_PRESET', 'academy-premium'),
    'respect_branding' => filter_var(env('ACADEMY_IMAGE_RESPECT_BRANDING', true), FILTER_VALIDATE_BOOL),
    'avoid_embedded_text' => filter_var(env('ACADEMY_IMAGE_AVOID_EMBEDDED_TEXT', true), FILTER_VALIDATE_BOOL),
    'tts_provider' => strtolower((string) env('ACADEMY_TTS_PROVIDER', env('OPENAI_API_KEY') ? 'openai' : 'disabled')),
    'model_override' => env('ACADEMY_AI_MODEL'),
    'base_url_override' => env('ACADEMY_AI_BASE_URL'),

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-5.6-terra'),
        'base_url' => rtrim((string) env('OPENAI_BASE_URL', 'https://api.openai.com/v1'), '/'),
        'image_model' => env('OPENAI_IMAGE_MODEL', 'gpt-image-2'),
        'tts_model' => env('OPENAI_TTS_MODEL', 'gpt-4o-mini-tts'),
        'tts_voice' => env('OPENAI_TTS_VOICE', 'alloy'),
    ],

    'deepseek' => [
        'api_key' => env('DEEPSEEK_API_KEY'),
        'model' => env('DEEPSEEK_MODEL', 'deepseek-v4-pro'),
        'base_url' => rtrim((string) env('DEEPSEEK_BASE_URL', 'https://api.deepseek.com'), '/'),
        'reasoning_effort' => env('DEEPSEEK_REASONING_EFFORT', 'high'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'base_url' => rtrim((string) env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com'), '/'),
        'image_model' => env('GEMINI_IMAGE_MODEL', 'gemini-3.1-flash-lite-image'),
    ],
];
