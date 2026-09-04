<?php

declare(strict_types=1);

use App\AI\Providers\GeminiImageGenerationProvider;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

it('uses the Gemini Interactions API and forces Nano Banana 2 Lite to 1K', function () {
    Http::fake([
        'https://generativelanguage.googleapis.test/v1beta/interactions' => Http::response([
            'output_image' => [
                'data' => base64_encode('PNGDATA'),
                'mime_type' => 'image/png',
            ],
        ]),
    ]);

    $provider = new GeminiImageGenerationProvider(
        apiKey: 'test-gemini-key',
        model: 'gemini-3.1-flash-lite-image',
        baseUrl: 'https://generativelanguage.googleapis.test',
        timeout: 30,
        imageSize: '4K',
    );

    $result = $provider->generate('Create a premium course cover.', '1536x1024');

    expect($provider->name())->toBe('gemini')
        ->and($provider->model())->toBe('gemini-3.1-flash-lite-image')
        ->and($result['bytes'])->toBe('PNGDATA')
        ->and($result['mime'])->toBe('image/png');

    Http::assertSent(function (Request $request): bool {
        $data = $request->data();

        return $request->url() === 'https://generativelanguage.googleapis.test/v1beta/interactions'
            && $request->hasHeader('x-goog-api-key', 'test-gemini-key')
            && $data['model'] === 'gemini-3.1-flash-lite-image'
            && $data['input'] === 'Create a premium course cover.'
            && $data['response_format']['type'] === 'image'
            && $data['response_format']['aspect_ratio'] === '16:9'
            && $data['response_format']['image_size'] === '1K';
    });
});

it('uses the requested 4K size on compatible Gemini image models', function () {
    Http::fake([
        'https://generativelanguage.googleapis.test/v1beta/interactions' => Http::response([
            'output_image' => ['data' => base64_encode('IMG')],
        ]),
    ]);

    $provider = new GeminiImageGenerationProvider(
        apiKey: 'test-gemini-key',
        model: 'gemini-3-pro-image',
        baseUrl: 'https://generativelanguage.googleapis.test',
        imageSize: '4K',
    );

    $provider->generate('Create a square thumbnail.', '1024x1024');

    Http::assertSent(fn (Request $request): bool =>
        $request->data()['response_format']['aspect_ratio'] === '1:1'
        && $request->data()['response_format']['image_size'] === '4K'
    );
});
