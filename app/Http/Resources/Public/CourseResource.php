<?php

declare(strict_types=1);

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $enrollment = Auth::check()
            ? Enrollment::query()->where('course_id', $this->id)->where('user_id', Auth::id())->first()
            : null;
        $isEnrolled = $enrollment !== null;
        $accessRank = (int) ($enrollment?->access_rank ?? -1);
        $displayOffer = $this->relationLoaded('offers')
            ? $this->offers->where('is_active', true)->sortByDesc('is_default')->first()
            : null;
        $displayAmount = $displayOffer ? ((int) $displayOffer->amount / 100) : (float) $this->price;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'target_audience' => $this->target_audience,
            'level' => $this->level,
            'language' => $this->language,
            'positioning' => $this->positioning,
            'price' => number_format($displayAmount, 0, ',', ' ').' €',
            'offers' => $this->whenLoaded('offers', fn () => $this->offers->where('is_active', true)->map(fn ($offer) => [
                'id' => $offer->id,
                'name' => $offer->name,
                'billing_type' => $offer->billing_type,
                'amount' => $offer->amount,
                'currency' => $offer->currency,
                'interval' => $offer->interval,
                'access_rank' => $offer->access_rank,
                'trial_days' => $offer->trial_days,
                'is_default' => $offer->is_default,
            ])->values()),
            'duration' => $this->duration,
            'image' => $this->image,
            'thumbnail' => $this->thumbnail,
            'featured' => $this->featured,
            'category' => $this->whenLoaded('category', fn () => $this->category->name),
            'moduleCount' => $this->modules_count ?? $this->whenLoaded('modules', fn () => $this->modules->count(), 0),
            'lessonCount' => $this->whenLoaded('modules', fn () => $this->modules->sum(fn ($m) => $m->relationLoaded('lessons') ? $m->lessons->count() : 0), 0),
            'studentCount' => (int) ($this->enrollments_count ?? 0),
            'rating' => 0,
            'benefits' => $this->benefits,
            'objectives' => $this->when(
                $this->objectives !== null,
                fn () => collect($this->objectives)->map(fn (array $o) => [
                    'title' => $o['title'],
                    'description' => $o['description'],
                ])->values(),
            ),
            'prerequisites' => $this->prerequisites,
            'trainer' => $this->whenLoaded('trainer', fn () => [
                'name' => $this->trainer->name,
                'initials' => $this->trainerInitials(),
                'role' => $this->trainer->trainer_title,
                'bio' => $this->trainer->trainer_bio,
            ]),
            'modules' => $this->whenLoaded('modules', fn () => $this->modules->map(
                fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'description' => $module->description,
                    'objectives' => $module->objectives,
                    'duration' => $module->duration,
                    'minimum_access_rank' => (int) ($module->minimum_access_rank ?? 0),
                    'locked_by_tier' => $isEnrolled && $accessRank < (int) ($module->minimum_access_rank ?? 0),
                    'order' => $module->order,
                    'lessons' => $module->relationLoaded('lessons')
                        ? $module->lessons->map(function ($lesson) use ($isEnrolled, $accessRank, $module): array {
                            $data = (new LessonResource($lesson))->resolve();
                            $canAccess = $lesson->is_free || ($isEnrolled && $accessRank >= (int) ($module->minimum_access_rank ?? 0));

                            if (! $canAccess) {
                                $data['content'] = null;
                                $data['transcript'] = null;
                                $data['video_url'] = null;
                                $data['audio_url'] = null;
                                $data['pdf_url'] = null;
                            }

                            return $data;
                        })->values()
                        : [],
                ],
            )),
            'is_enrolled' => $isEnrolled,
        ];
    }

    private function trainerInitials(): string
    {
        return collect(explode(' ', $this->trainer->name))
            ->map(fn (string $word) => mb_strtoupper(mb_substr($word, 0, 1)))
            ->take(2)
            ->implode('');
    }
}
