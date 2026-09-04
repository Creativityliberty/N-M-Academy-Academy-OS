<?php

declare(strict_types=1);

namespace App\PageBuilder;

use App\Models\AcademyPage;
use App\Models\AcademyPageSection;
use App\Models\Course;
use App\Models\CourseOffer;

class PageSectionResolver
{
    public function resolvePage(AcademyPage $page): array
    {
        return $page->sections->filter->is_visible->map(fn (AcademyPageSection $section) => $this->resolve($page, $section))->values()->all();
    }

    public function resolve(AcademyPage $page, AcademyPageSection $section): array
    {
        $settings = (array) ($section->settings ?? []);
        $data = [];
        $courseId = (int) ($settings['course_id'] ?? 0);

        if (in_array($section->type, ['instructor','course','curriculum','pricing'], true) && $courseId > 0) {
            $course = Course::query()
                ->where('trainer_id', $page->trainer_id)
                ->when($page->isPublished(), fn ($query) => $query->published())
                ->with(['trainer:id,name,trainer_title,trainer_bio,trainer_avatar','modules.lessons:id,module_id,title,duration,is_free','offers' => fn ($q) => $q->where('is_active', true)])
                ->find($courseId);

            if ($course) {
                $data['course'] = [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'duration' => $course->duration,
                    'image' => $course->image,
                    'trainer' => $course->trainer ? [
                        'name' => $course->trainer->name,
                        'title' => $course->trainer->trainer_title,
                        'bio' => $course->trainer->trainer_bio,
                        'avatar' => $course->trainer->trainer_avatar,
                    ] : null,
                    'modules' => $course->modules->map(fn ($module) => [
                        'id' => $module->id,
                        'title' => $module->title,
                        'duration' => $module->duration,
                        'lessons' => $module->lessons->map(fn ($lesson) => [
                            'id' => $lesson->id, 'title' => $lesson->title, 'duration' => $lesson->duration, 'is_free' => $lesson->is_free,
                        ])->values(),
                    ])->values(),
                ];

                if ($section->type === 'pricing') {
                    $offerIds = collect((array) ($settings['offer_ids'] ?? []))->map(fn ($id) => (int) $id)->filter()->values();
                    $offers = CourseOffer::query()->where('course_id', $course->id)->where('is_active', true)
                        ->when($offerIds->isNotEmpty(), fn ($q) => $q->whereIn('id', $offerIds))->orderByDesc('is_default')->orderBy('amount')->get();
                    $data['offers'] = $offers->map(fn (CourseOffer $offer) => [
                        'id' => $offer->id, 'name' => $offer->name, 'billing_type' => $offer->billing_type, 'amount' => $offer->amount,
                        'currency' => $offer->currency, 'interval' => $offer->interval, 'access_rank' => $offer->access_rank, 'trial_days' => $offer->trial_days,
                    ])->values();
                }
            }
        }

        return [
            'id' => $section->id,
            'type' => $section->type,
            'variant' => $section->variant,
            'settings' => $settings,
            'data' => $data,
        ];
    }
}
