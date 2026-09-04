<?php

declare(strict_types=1);

namespace App\Services\Commerce;

use App\Models\AcademyMembership;
use App\Models\AcademyOrder;
use App\Models\Enrollment;

class AccessProjectionService
{
    public function refresh(int $userId, int $courseId): ?Enrollment
    {
        $existing = Enrollment::query()->where('user_id',$userId)->where('course_id',$courseId)->first();

        $orderOffers = AcademyOrder::query()
            ->where('user_id',$userId)->where('course_id',$courseId)
            ->whereIn('kind',['free','one_time'])
            ->whereIn('status',['paid','partially_refunded'])
            ->with('offer:id,access_rank')
            ->get()->pluck('offer')->filter();

        $membershipOffers = AcademyMembership::query()
            ->where('user_id',$userId)->where('course_id',$courseId)
            ->whereIn('status',['active','trialing','past_due'])
            ->with('offer:id,access_rank')
            ->get()->pluck('offer')->filter();

        $offers = $orderOffers->concat($membershipOffers);
        if ($offers->isEmpty()) {
            // Never delete a legacy/pre-M10 enrollment that has no commerce source.
            if ($existing && $existing->offer_id === null) return $existing;
            $existing?->delete();
            return null;
        }

        $best = $offers->sortByDesc(fn($offer)=>(int)$offer->access_rank)->first();
        return Enrollment::updateOrCreate(
            ['user_id'=>$userId,'course_id'=>$courseId],
            ['offer_id'=>$best->id,'access_rank'=>(int)$best->access_rank,'enrolled_at'=>$existing?->enrolled_at ?? now()],
        );
    }
}
