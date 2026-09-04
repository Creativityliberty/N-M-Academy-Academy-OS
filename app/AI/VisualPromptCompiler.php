<?php

declare(strict_types=1);

namespace App\AI;

use App\Models\Course;
use InvalidArgumentException;

class VisualPromptCompiler
{
    public function __construct(private readonly AcademyAiSettingsRepository $settings) {}

    public function compileCourseImage(Course $course, string $purpose, ?string $direction = null): string
    {
        $purpose = match ($purpose) {
            'cover', 'course_cover' => 'course_cover',
            'thumbnail', 'course_thumbnail' => 'course_thumbnail',
            default => throw new InvalidArgumentException('Purpose visuel Academy non supporté.'),
        };

        $runtime = $this->settings->get();
        $positioning = (array) $course->positioning;
        $theme = (array) config('academy.theme', []);
        $respectBranding = (bool) ($runtime['respect_branding'] ?? true);
        $avoidEmbeddedText = (bool) ($runtime['avoid_embedded_text'] ?? true);
        $preset = (string) ($runtime['image_prompt_preset'] ?? 'academy-premium');

        $purposeRules = $purpose === 'course_cover'
            ? [
                'Purpose: course_cover',
                'Aspect ratio: 16:9.',
                'Create a strong premium marketing composition with one clear focal subject.',
                'Preserve generous negative space / safe zone for UI title overlays.',
                'Readable at desktop hero size; polished editorial finish.',
            ]
            : [
                'Purpose: course_thumbnail',
                'Aspect ratio: 1:1.',
                'Make the primary subject larger and immediately recognizable at small card size.',
                'Use fewer details and stronger silhouette/contrast than a hero cover.',
                'Keep the visual hierarchy obvious even at 160px.',
            ];

        $artDirection = $this->artDirectionFor($preset);

        $brandLines = $respectBranding ? [
            'Academy: '.(string) config('academy.name', 'NÜM Academy'),
            'Theme preset: '.(string) ($theme['preset'] ?? 'soft-glass'),
            'Primary color reference: '.(string) ($theme['primary'] ?? ''),
            'Secondary color reference: '.(string) ($theme['secondary'] ?? ''),
            'Accent color reference: '.(string) ($theme['accent'] ?? ''),
            'Use these colors as art-direction references, not as rigid flat fills.',
        ] : ['Brand styling: neutral premium educational art direction.'];

        $avoid = [
            'generic stock-photo aesthetics',
            'cheap SaaS gradients as the main idea',
            'visual clutter',
            'random logos or trademark-like marks',
            'watermark imitation',
            'irrelevant objects',
            'deformed anatomy',
            'tiny unreadable decorative labels',
        ];
        if ($avoidEmbeddedText) {
            $avoid[] = 'embedded text, captions or typography unless the user explicitly requests text in the artwork';
        }

        return trim(implode("\n", [
            'Create a premium editorial visual for an online course.',
            '',
            'COURSE CONTEXT',
            'Title: '.$course->title,
            'Target audience: '.($course->target_audience ?: 'not specified'),
            'Level: '.($course->level ?: 'all_levels'),
            'Language: '.($course->language ?: 'fr'),
            'Main problem: '.((string) ($positioning['main_problem'] ?? 'not specified')),
            'Desired transformation: '.((string) ($positioning['desired_transformation'] ?? 'not specified')),
            'Main promise: '.((string) ($positioning['main_promise'] ?? 'not specified')),
            'Unique angle: '.((string) ($positioning['unique_angle'] ?? 'not specified')),
            '',
            'ACADEMY BRAND',
            ...$brandLines,
            '',
            'VISUAL PURPOSE',
            ...$purposeRules,
            '',
            'ART DIRECTION',
            'Preset: '.$preset.'.',
            ...$artDirection,
            '',
            'USER DIRECTION',
            trim((string) $direction) !== '' ? trim((string) $direction) : 'No extra direction. Choose the strongest concept from the course context.',
            '',
            'OUTPUT RULES',
            'Generate exactly one finished visual.',
            'Keep the focal subject away from unsafe crop edges.',
            'Do not fabricate endorsements, certification badges, statistics, customer results or partner logos.',
            $avoidEmbeddedText ? 'Do not embed text by default; the application overlays titles separately.' : 'Embedded text is allowed only when it is visually justified and legible.',
            '',
            'AVOID',
            '- '.implode("\n- ", $avoid),
        ]));
    }
    /** @return list<string> */
    private function artDirectionFor(string $preset): array
    {
        return match ($preset) {
            'editorial' => [
                'Premium editorial art direction inspired by contemporary magazines and cultural publications.',
                'Favor refined typography-safe negative space, sophisticated composition, subtle texture and restrained visual storytelling.',
                'Avoid glossy stock-advertising clichés; prefer an authored, intelligent and timeless visual idea.',
            ],
            'cinematic' => [
                'Cinematic premium art direction with deliberate lens language, depth, atmosphere and motivated lighting.',
                'Use a strong focal subject, controlled contrast and dimensional environments without turning the image into a movie poster cliché.',
                'Keep the composition commercially usable for an educational product and preserve interface-safe negative space.',
            ],
            'minimal' => [
                'Minimal premium art direction with one dominant idea, generous negative space and very few supporting elements.',
                'Favor clean geometry, refined materials, restrained palette and crisp hierarchy that remains readable at small sizes.',
                'Avoid ornamental detail, busy backgrounds and unnecessary props.',
            ],
            default => [
                'Contemporary premium educational visual, commercially polished but not generic.',
                'Strong visual hierarchy, intentional composition, believable materials, coherent lighting and atmosphere.',
                'Use camera/framing, depth and texture deliberately. Prefer one memorable visual idea over many small motifs.',
                'Finishing should feel suitable for a high-end course marketplace and a modern creator brand.',
            ],
        };
    }

}
