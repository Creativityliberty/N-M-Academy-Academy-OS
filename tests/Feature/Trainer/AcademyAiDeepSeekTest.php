<?php

declare(strict_types=1);

use App\AI\AiProviderManager;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

it('uses DeepSeek Responses API with reasoning and structured output', function () {
    config()->set('academy-ai.provider', 'deepseek');
    config()->set('academy-ai.timeout', 30);
    config()->set('academy-ai.model_override', null);
    config()->set('academy-ai.base_url_override', null);
    config()->set('academy-ai.deepseek.api_key', 'test-deepseek-key');
    config()->set('academy-ai.deepseek.model', 'deepseek-v4-pro');
    config()->set('academy-ai.deepseek.base_url', 'https://api.deepseek.com');
    config()->set('academy-ai.deepseek.reasoning_effort', 'max');

    Http::fake([
        'https://api.deepseek.com/responses' => Http::response([
            'output' => [[
                'type' => 'message',
                'content' => [[
                    'type' => 'output_text',
                    'text' => '{"title":"DeepSeek Academy"}',
                ]],
            ]],
        ]),
    ]);

    $provider = app(AiProviderManager::class)->provider();
    $result = $provider->structured(
        'Return JSON.',
        'Create a course.',
        'course_blueprint',
        [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
            ],
            'required' => ['title'],
            'additionalProperties' => false,
        ],
    );

    expect($provider->name())->toBe('deepseek')
        ->and($provider->model())->toBe('deepseek-v4-pro')
        ->and($result)->toBe(['title' => 'DeepSeek Academy']);

    Http::assertSent(function (Request $request): bool {
        $data = $request->data();

        return $request->url() === 'https://api.deepseek.com/responses'
            && $data['model'] === 'deepseek-v4-pro'
            && $data['reasoning']['effort'] === 'max'
            && $data['text']['format']['type'] === 'json_schema'
            && $data['text']['format']['name'] === 'course_blueprint';
    });
});
