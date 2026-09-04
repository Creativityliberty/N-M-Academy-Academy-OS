<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\AI\AcademyAiSettingsRepository;
use App\AI\GeminiModelDiscoveryService;
use App\AI\ImageModelCatalog;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AiProvidersController extends Controller
{
    public function __construct(
        private readonly AcademyAiSettingsRepository $settings,
        private readonly ImageModelCatalog $imageModels,
        private readonly GeminiModelDiscoveryService $geminiDiscovery,
    ) {}

    public function edit(Request $request): Response
    {
        $this->authorizeSettings($request);
        $settings = $this->settings->get();

        return Inertia::render('settings/ai-providers', [
            'settings' => $settings,
            'catalog' => [
                'text' => [
                    'openai' => $this->configuredTextModels('openai'),
                    'deepseek' => $this->configuredTextModels('deepseek'),
                ],
                'image' => [
                    'gemini' => $this->imageModels->gemini(),
                    'openai' => $this->imageModels->forProvider('openai'),
                ],
                'speech' => [
                    'openai' => [[
                        'id' => (string) config('academy-ai.openai.tts_model', 'gpt-4o-mini-tts'),
                        'label' => (string) config('academy-ai.openai.tts_model', 'gpt-4o-mini-tts'),
                    ]],
                ],
            ],
            'configuredSecrets' => [
                'openai' => trim((string) config('academy-ai.openai.api_key')) !== '',
                'deepseek' => trim((string) config('academy-ai.deepseek.api_key')) !== '',
                'gemini' => trim((string) config('academy-ai.gemini.api_key')) !== '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->authorizeSettings($request);
        $validated = $request->validate([
            'text_provider' => ['required', Rule::in(['openai', 'deepseek', 'disabled'])],
            'text_model' => ['nullable', 'string', 'max:160'],
            'image_provider' => ['required', Rule::in(['gemini', 'openai', 'disabled'])],
            'image_model' => ['nullable', 'string', 'max:160'],
            'image_size' => ['required', Rule::in(['1K', '2K', '4K'])],
            'image_prompt_preset' => ['required', Rule::in(['academy-premium', 'editorial', 'cinematic', 'minimal'])],
            'respect_branding' => ['required', 'boolean'],
            'avoid_embedded_text' => ['required', 'boolean'],
            'tts_provider' => ['required', Rule::in(['openai', 'disabled'])],
            'tts_model' => ['nullable', 'string', 'max:160'],
        ]);

        if ($validated['image_provider'] === 'gemini') {
            $allowed = collect($this->imageModels->gemini())->pluck('id')->all();
            abort_unless(in_array((string) $validated['image_model'], $allowed, true), 422, 'Modèle Gemini image non autorisé.');
            if ($validated['image_model'] === 'gemini-3.1-flash-lite-image') {
                $validated['image_size'] = '1K';
            }
        }

        if ($validated['image_provider'] === 'openai') {
            $allowed = collect($this->imageModels->forProvider('openai'))->pluck('id')->all();
            abort_unless(in_array((string) $validated['image_model'], $allowed, true), 422, 'Modèle OpenAI image non autorisé.');
        }

        $this->settings->update($validated);

        return back()->with('success', 'Providers AI mis à jour. Les clés API restent gérées uniquement par les secrets serveur.');
    }

    public function discoverGemini(Request $request): JsonResponse
    {
        $this->authorizeSettings($request);
        return response()->json(['models' => $this->geminiDiscovery->discover()]);
    }

    private function authorizeSettings(Request $request): void
    {
        abort_unless($request->user()?->hasAnyRole(['trainer', 'admin', 'super-admin']), 403);
    }

    /** @return array<int,array{id:string,label:string}> */
    private function configuredTextModels(string $provider): array
    {
        $configured = trim((string) config("academy-ai.{$provider}.model"));
        $models = $provider === 'deepseek'
            ? ['deepseek-v4-flash', 'deepseek-v4-pro']
            : array_values(array_filter([$configured]));

        if ($configured !== '' && ! in_array($configured, $models, true)) {
            array_unshift($models, $configured);
        }

        return collect($models)->unique()->values()->map(fn (string $model) => ['id' => $model, 'label' => $model])->all();
    }
}
