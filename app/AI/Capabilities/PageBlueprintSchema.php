<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

final class PageBlueprintSchema
{
    public static function schema(): array
    {
        $item = [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'name' => ['type' => 'string'],
                'quote' => ['type' => 'string'],
                'question' => ['type' => 'string'],
                'answer' => ['type' => 'string'],
                'label' => ['type' => 'string'],
                'url' => ['type' => 'string'],
            ],
            'required' => ['title','description','name','quote','question','answer','label','url'],
            'additionalProperties' => false,
        ];

        $section = [
            'type' => 'object',
            'properties' => [
                'type' => ['type' => 'string', 'enum' => ['hero','features','instructor','course','curriculum','testimonials','pricing','faq','cta','footer']],
                'variant' => ['type' => 'string', 'enum' => ['minimal','centered','split','grid','list','profile','featured','compact','accordion','timeline','quotes','cards','focused','columns']],
                'headline' => ['type' => 'string'],
                'subheadline' => ['type' => 'string'],
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'button_label' => ['type' => 'string'],
                'button_url' => ['type' => 'string'],
                'course_id' => ['type' => 'integer', 'minimum' => 0],
                'items' => ['type' => 'array', 'items' => $item],
            ],
            'required' => ['type','variant','headline','subheadline','title','description','button_label','button_url','course_id','items'],
            'additionalProperties' => false,
        ];

        return [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'slug_hint' => ['type' => 'string'],
                'meta_title' => ['type' => 'string'],
                'meta_description' => ['type' => 'string'],
                'sections' => ['type' => 'array', 'items' => $section, 'minItems' => 3, 'maxItems' => 12],
            ],
            'required' => ['title','slug_hint','meta_title','meta_description','sections'],
            'additionalProperties' => false,
        ];
    }
}
