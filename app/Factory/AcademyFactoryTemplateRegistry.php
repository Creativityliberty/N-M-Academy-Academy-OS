<?php

declare(strict_types=1);

namespace App\Factory;

use InvalidArgumentException;

class AcademyFactoryTemplateRegistry
{
    private const TEMPLATES = [
        'creator' => [
            'label' => 'Creator', 'descriptor' => 'Creator Academy',
            'theme' => ['preset'=>'soft-glass','primary'=>'#6F7F70','primary_hover'=>'#576A59','primary_soft'=>'#EAF0E8','primary_surface'=>'#F4F7F2','secondary'=>'#202720','accent'=>'#B79B72','radius'=>'1rem','density'=>'comfortable'],
            'capability_profile' => 'creator',
        ],
        'coaching' => [
            'label' => 'Coaching', 'descriptor' => 'Coaching Academy',
            'theme' => ['preset'=>'soft-glass','primary'=>'#866F63','primary_hover'=>'#6E594F','primary_soft'=>'#F1E9E4','primary_surface'=>'#FAF7F5','secondary'=>'#2D2825','accent'=>'#C9A46C','radius'=>'1.125rem','density'=>'comfortable'],
            'capability_profile' => 'creator',
        ],
        'business' => [
            'label' => 'Business', 'descriptor' => 'Business Academy',
            'theme' => ['preset'=>'minimal','primary'=>'#334155','primary_hover'=>'#1E293B','primary_soft'=>'#E2E8F0','primary_surface'=>'#F8FAFC','secondary'=>'#0F172A','accent'=>'#C99A2E','radius'=>'0.75rem','density'=>'comfortable'],
            'capability_profile' => 'creator',
        ],
        'wellness' => [
            'label' => 'Wellness', 'descriptor' => 'Wellness Academy',
            'theme' => ['preset'=>'soft-glass','primary'=>'#728C78','primary_hover'=>'#5D7463','primary_soft'=>'#E7EFE8','primary_surface'=>'#F7FAF7','secondary'=>'#253128','accent'=>'#D5B895','radius'=>'1.25rem','density'=>'spacious'],
            'capability_profile' => 'creator',
        ],
        'fitness' => [
            'label' => 'Fitness', 'descriptor' => 'Performance Academy',
            'theme' => ['preset'=>'minimal','primary'=>'#D45032','primary_hover'=>'#B63D24','primary_soft'=>'#FBE8E3','primary_surface'=>'#FFF8F6','secondary'=>'#18181B','accent'=>'#F59E0B','radius'=>'0.875rem','density'=>'compact'],
            'capability_profile' => 'creator',
        ],
        'corporate' => [
            'label' => 'Corporate', 'descriptor' => 'Corporate Learning',
            'theme' => ['preset'=>'minimal','primary'=>'#2F5D7C','primary_hover'=>'#244962','primary_soft'=>'#E4EEF5','primary_surface'=>'#F6F9FB','secondary'=>'#17232C','accent'=>'#6B91A8','radius'=>'0.625rem','density'=>'compact'],
            'capability_profile' => 'essential',
        ],
        'premium-dark' => [
            'label' => 'Premium Dark', 'descriptor' => 'Private Academy',
            'theme' => ['preset'=>'dark','primary'=>'#B8C5B9','primary_hover'=>'#D0D9D1','primary_soft'=>'#273129','primary_surface'=>'#181D19','secondary'=>'#F1F5F1','accent'=>'#D1B98F','radius'=>'1rem','density'=>'comfortable'],
            'capability_profile' => 'pro',
        ],
        'editorial' => [
            'label' => 'Editorial', 'descriptor' => 'Knowledge Academy',
            'theme' => ['preset'=>'editorial','primary'=>'#5F554B','primary_hover'=>'#493F37','primary_soft'=>'#EFEAE4','primary_surface'=>'#FBF9F6','secondary'=>'#24201C','accent'=>'#9A744B','radius'=>'0.375rem','density'=>'spacious'],
            'capability_profile' => 'creator',
        ],
    ];

    public function all(): array
    {
        return collect(self::TEMPLATES)->map(fn (array $template, string $key) => ['key'=>$key, ...$template])->values()->all();
    }

    public function get(string $key): array
    {
        if (! isset(self::TEMPLATES[$key])) {
            throw new InvalidArgumentException("Template Academy inconnu : {$key}");
        }

        return ['key'=>$key, ...self::TEMPLATES[$key]];
    }
}
