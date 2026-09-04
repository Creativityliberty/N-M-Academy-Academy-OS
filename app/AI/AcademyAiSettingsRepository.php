<?php

declare(strict_types=1);

namespace App\AI;

use App\Models\AcademyAiSetting;
use Illuminate\Support\Facades\Schema;

class AcademyAiSettingsRepository
{
    /** @return array<string,mixed> */
    public function get(): array
    {
        $defaults = $this->defaults();

        try {
            if (! Schema::hasTable('academy_ai_settings')) {
                return $defaults;
            }

            $row = AcademyAiSetting::query()->where('scope', 'academy')->first();
        } catch (\Throwable) {
            // AI settings must never prevent Academy OS from booting when the database
            // is temporarily unavailable or the settings migration has not run yet.
            return $defaults;
        }
        if (! $row) {
            return $defaults;
        }

        $stored = array_filter([
            'text_provider' => $row->text_provider,
            'text_model' => $row->text_model,
            'image_provider' => $row->image_provider,
            'image_model' => $row->image_model,
            'image_size' => $row->image_size,
            'image_prompt_preset' => $row->image_prompt_preset,
            'tts_provider' => $row->tts_provider,
            'tts_model' => $row->tts_model,
        ], static fn ($value): bool => is_string($value) && trim($value) !== '');

        $merged = array_replace($defaults, $stored, [
            'respect_branding' => (bool) $row->respect_branding,
            'avoid_embedded_text' => (bool) $row->avoid_embedded_text,
        ]);

        if (($merged['image_model'] ?? null) === 'gemini-3.1-flash-lite-image') {
            $merged['image_size'] = '1K';
        }

        return $merged;
    }

    /** @param array<string,mixed> $values */
    public function update(array $values): AcademyAiSetting
    {
        return AcademyAiSetting::query()->updateOrCreate(
            ['scope' => 'academy'],
            [
                'text_provider' => $values['text_provider'] ?? null,
                'text_model' => $values['text_model'] ?? null,
                'image_provider' => $values['image_provider'] ?? null,
                'image_model' => $values['image_model'] ?? null,
                'image_size' => $values['image_size'] ?? null,
                'image_prompt_preset' => $values['image_prompt_preset'] ?? 'academy-premium',
                'respect_branding' => (bool) ($values['respect_branding'] ?? true),
                'avoid_embedded_text' => (bool) ($values['avoid_embedded_text'] ?? true),
                'tts_provider' => $values['tts_provider'] ?? null,
                'tts_model' => $values['tts_model'] ?? null,
            ],
        );
    }

    /** @return array<string,mixed> */
    private function defaults(): array
    {
        $textProvider = strtolower(trim((string) config('academy-ai.provider', 'disabled')));
        $imageProvider = strtolower(trim((string) config('academy-ai.image_provider', 'disabled')));
        $ttsProvider = strtolower(trim((string) config('academy-ai.tts_provider', 'disabled')));

        $textModel = match ($textProvider) {
            'openai' => (string) config('academy-ai.openai.model', ''),
            'deepseek' => (string) config('academy-ai.deepseek.model', ''),
            default => '',
        };

        $imageModel = match ($imageProvider) {
            'gemini' => (string) config('academy-ai.gemini.image_model', 'gemini-3.1-flash-lite-image'),
            'openai' => (string) config('academy-ai.openai.image_model', 'gpt-image-2'),
            default => '',
        };

        $ttsModel = $ttsProvider === 'openai'
            ? (string) config('academy-ai.openai.tts_model', 'gpt-4o-mini-tts')
            : '';

        $imageSize = $imageModel === 'gemini-3.1-flash-lite-image'
            ? '1K'
            : (string) config('academy-ai.image_size', '1K');

        return [
            'text_provider' => $textProvider,
            'text_model' => $textModel,
            'image_provider' => $imageProvider,
            'image_model' => $imageModel,
            'image_size' => $imageSize,
            'image_prompt_preset' => (string) config('academy-ai.image_prompt_preset', 'academy-premium'),
            'respect_branding' => (bool) config('academy-ai.respect_branding', true),
            'avoid_embedded_text' => (bool) config('academy-ai.avoid_embedded_text', true),
            'tts_provider' => $ttsProvider,
            'tts_model' => $ttsModel,
        ];
    }
}
