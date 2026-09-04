<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\AcademyCoupon;
use App\Models\AcademyOrder;
use App\Models\AffiliatePartner;
use App\Models\CourseOffer;
use App\Models\Enrollment;
use App\Models\TrainerCommerceSetting;
use App\Services\Commerce\CommerceAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    public function __construct(private readonly CommerceAnalyticsService $analytics) {}

    public function index(Request $request): Response
    {
        $trainer = $request->user();
        $courseIds = $trainer->courses()->pluck('id');
        $orders = AcademyOrder::query()
            ->where('trainer_id', $trainer->id)
            ->with(['user:id,name,email','course:id,title','offer:id,name,billing_type','affiliate:id,name,code'])
            ->latest()
            ->limit(100)
            ->get();

        $legacyEnrollments = Enrollment::query()
            ->whereIn('course_id',$courseIds)
            ->whereNull('amount_paid')
            ->count();

        $legacySales = Enrollment::query()
            ->whereIn('course_id', $courseIds)
            ->with(['user:id,name,email','course:id,title'])
            ->latest('paid_at')->latest('enrolled_at')->get();
        $recordedLegacy = $legacySales->whereNotNull('amount_paid');
        $legacyRevenue = $recordedLegacy->groupBy(fn (Enrollment $sale) => $sale->currency ?: 'N/A')->map(fn ($group, $currency) => [
            'currency'=>$currency,
            'amount'=>round((float)$group->sum(fn (Enrollment $sale)=>(float)$sale->amount_paid),2),
            'sales'=>$group->count(),
        ])->values();

        return Inertia::render('trainer/sales/index', [
            'stats' => ['recordedSales'=>$recordedLegacy->count(),'legacyEnrollments'=>$legacyEnrollments,'revenueByCurrency'=>$legacyRevenue],
            'sales' => $legacySales->take(100)->map(fn (Enrollment $sale) => ['id'=>$sale->id,'student'=>$sale->user?->name,'email'=>$sale->user?->email,'course'=>$sale->course?->title,'amount'=>$sale->amount_paid !== null ? (float)$sale->amount_paid : null,'currency'=>$sale->currency,'paidAt'=>$sale->paid_at?->toIso8601String(),'enrolledAt'=>$sale->enrolled_at?->toIso8601String(),'legacy'=>$sale->amount_paid===null])->values(),
            'analytics' => $this->analytics->forTrainer($trainer->id),
            'commerceSettings' => TrainerCommerceSetting::forTrainer($trainer->id)->only(['platform_fee_bps','default_affiliate_bps','currency']),
            'legacyEnrollments' => $legacyEnrollments,
            'courses' => $trainer->courses()->select('id','title')->orderBy('title')->get(),
            'offers' => CourseOffer::query()->whereIn('course_id',$courseIds)->with('course:id,title')->latest()->get()->map(fn($offer)=>[
                'id'=>$offer->id,'course'=>$offer->course?->title,'course_id'=>$offer->course_id,'name'=>$offer->name,'billing_type'=>$offer->billing_type,'amount'=>$offer->amount,'currency'=>$offer->currency,'interval'=>$offer->interval,'access_rank'=>$offer->access_rank,'active'=>$offer->is_active,
            ]),
            'coupons' => AcademyCoupon::query()->where('trainer_id',$trainer->id)->latest()->get()->map(fn($coupon)=>[
                'id'=>$coupon->id,'code'=>$coupon->code,'discount_type'=>$coupon->discount_type,'discount_value'=>$coupon->discount_value,'currency'=>$coupon->currency,'redemptions'=>$coupon->redemptions,'max_redemptions'=>$coupon->max_redemptions,'expires_at'=>$coupon->expires_at?->toIso8601String(),'active'=>$coupon->is_active,
            ]),
            'affiliates' => AffiliatePartner::query()->where('trainer_id',$trainer->id)->with('commissions')->latest()->get()->map(fn($partner)=>[
                'id'=>$partner->id,'name'=>$partner->name,'email'=>$partner->email,'code'=>$partner->code,'commission_bps'=>$partner->commission_bps,'active'=>$partner->is_active,'accrued_amount'=>(int)$partner->commissions->where('status','accrued')->sum(fn($commission)=>max(0,(int)$commission->amount-(int)$commission->reversed_amount)),
            ]),
            'orders' => $orders->map(fn(AcademyOrder $order)=>[
                'id'=>$order->id,'student'=>$order->user?->name,'email'=>$order->user?->email,'course'=>$order->course?->title,'offer'=>$order->offer?->name,'kind'=>$order->kind,'status'=>$order->status,'gross'=>$order->gross_amount,'refunded'=>$order->refunded_amount,'platformFee'=>max(0,(int)$order->platform_fee_amount-(int)$order->refunded_platform_fee_amount),'currency'=>$order->currency,'affiliate'=>$order->affiliate?->name,'paidAt'=>$order->paid_at?->toIso8601String(),'createdAt'=>$order->created_at?->toIso8601String(),'refundable'=>in_array($order->status,['paid','partially_refunded'],true) && !empty($order->stripe_payment_intent_id),'remainingRefundable'=>max(0,(int)$order->gross_amount-(int)$order->refunded_amount),
            ]),
        ]);
    }
}
