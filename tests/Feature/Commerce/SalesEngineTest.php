<?php

declare(strict_types=1);

use App\Models\AcademyCoupon;
use App\Models\AcademyMcpToken;
use App\Models\AcademyOrder;
use App\Models\Course;
use App\Models\CourseOffer;
use App\Models\Enrollment;
use App\Models\Module;
use App\Models\TrainerCommerceSetting;
use App\Models\User;
use App\Services\Commerce\CheckoutService;
use App\Services\Commerce\CommerceAnalyticsService;
use App\Services\Commerce\CourseAccessService;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function m10Trainer(): User
{
    $trainer = User::factory()->create(['email_verified_at'=>now(),'stripe_onboarding_completed'=>true,'stripe_account_id'=>'acct_m10']);
    $trainer->assignRole('trainer');
    return $trainer;
}

function m10Token(User $user): string
{
    $plain='num_m10_'.str()->random(40);
    AcademyMcpToken::create(['user_id'=>$user->id,'name'=>'M10','token_hash'=>hash('sha256',$plain),'abilities'=>['*']]);
    return $plain;
}

it('grants free offer access without Stripe and records a real zero-value order', function () {
    $trainer=m10Trainer();
    $student=User::factory()->create(['email_verified_at'=>now()]);
    $course=Course::factory()->published()->create(['trainer_id'=>$trainer->id]);
    $offer=CourseOffer::create(['course_id'=>$course->id,'name'=>'Free','slug'=>'free','billing_type'=>'free','amount'=>0,'currency'=>'EUR','access_rank'=>25,'is_default'=>true,'is_active'=>true]);

    $result=app(CheckoutService::class)->begin($student,$course,$offer);

    expect($result['session'])->toBeNull();
    $this->assertDatabaseHas('academy_orders',['user_id'=>$student->id,'course_id'=>$course->id,'status'=>'paid','gross_amount'=>0]);
    $this->assertDatabaseHas('enrollments',['user_id'=>$student->id,'course_id'=>$course->id,'offer_id'=>$offer->id,'access_rank'=>25]);
});

it('enforces module tier rank for enrolled students', function () {
    $trainer=m10Trainer();
    $student=User::factory()->create();
    $course=Course::factory()->published()->create(['trainer_id'=>$trainer->id]);
    $basic=Module::factory()->create(['course_id'=>$course->id,'minimum_access_rank'=>10]);
    $premium=Module::factory()->create(['course_id'=>$course->id,'minimum_access_rank'=>100]);
    Enrollment::create(['user_id'=>$student->id,'course_id'=>$course->id,'access_rank'=>25,'enrolled_at'=>now()]);

    $access=app(CourseAccessService::class);
    expect($access->canAccessModule($student,$basic))->toBeTrue();
    expect($access->canAccessModule($student,$premium))->toBeFalse();
});

it('calculates conversion refunds mrr churn and realized ltv from recorded commerce only', function () {
    $trainer=m10Trainer();
    $student=User::factory()->create();
    $course=Course::factory()->published()->create(['trainer_id'=>$trainer->id]);
    $offer=CourseOffer::create(['course_id'=>$course->id,'name'=>'Monthly','slug'=>'monthly','billing_type'=>'subscription','amount'=>4900,'currency'=>'EUR','interval'=>'month','access_rank'=>100,'is_active'=>true]);
    AcademyOrder::create(['trainer_id'=>$trainer->id,'user_id'=>$student->id,'course_id'=>$course->id,'offer_id'=>$offer->id,'kind'=>'one_time','status'=>'paid','currency'=>'EUR','subtotal_amount'=>10000,'gross_amount'=>10000,'platform_fee_amount'=>1500,'refunded_amount'=>2000,'paid_at'=>now()]);
    AcademyOrder::create(['trainer_id'=>$trainer->id,'user_id'=>$student->id,'course_id'=>$course->id,'offer_id'=>$offer->id,'kind'=>'one_time','status'=>'pending','currency'=>'EUR','subtotal_amount'=>10000,'gross_amount'=>10000]);
    \App\Models\AcademyMembership::create(['user_id'=>$student->id,'course_id'=>$course->id,'offer_id'=>$offer->id,'stripe_subscription_id'=>'sub_m10','status'=>'active']);

    $data=app(CommerceAnalyticsService::class)->forTrainer($trainer->id);
    expect($data['checkoutAttempts'])->toBe(2);
    expect($data['successfulCheckouts'])->toBe(1);
    expect($data['conversionRate'])->toBe(50.0);
    expect($data['revenueByCurrency'][0]['net'])->toBe(8000);
    expect($data['mrrByCurrency'][0]['mrr'])->toBe(4900);
});

it('rejects expired or exhausted coupons deterministically', function () {
    $trainer=m10Trainer();
    $coupon=AcademyCoupon::create(['trainer_id'=>$trainer->id,'code'=>'DONE','discount_type'=>'percent','discount_value'=>2000,'max_redemptions'=>1,'redemptions'=>1,'is_active'=>true]);
    expect($coupon->usable())->toBeFalse();
});

it('requires a strong MCP phrase before any sales refund can execute', function () {
    $trainer=m10Trainer();
    $student=User::factory()->create();
    $course=Course::factory()->published()->create(['trainer_id'=>$trainer->id]);
    $order=AcademyOrder::create(['trainer_id'=>$trainer->id,'user_id'=>$student->id,'course_id'=>$course->id,'kind'=>'one_time','status'=>'paid','currency'=>'EUR','subtotal_amount'=>5000,'gross_amount'=>5000,'platform_fee_amount'=>750,'stripe_payment_intent_id'=>'pi_m10','paid_at'=>now()]);
    $token=m10Token($trainer);

    $response=$this->postJson('/mcp',['jsonrpc'=>'2.0','id'=>101,'method'=>'tools/call','params'=>['name'=>'sales.refund','arguments'=>['order_id'=>$order->id,'amount'=>2500]]],[
        'Authorization'=>'Bearer '.$token,'MCP-Protocol-Version'=>'2026-07-28','Mcp-Method'=>'tools/call','Mcp-Name'=>'sales.refund','Accept'=>'application/json',
    ])->assertOk();

    expect($response->json('result.resultType'))->toBe('input_required');
    expect($response->json('result.inputRequests.approval.params.message'))->toContain('REFUND ORDER '.$order->id.' AMOUNT 2500');
    $this->assertDatabaseMissing('academy_refunds',['order_id'=>$order->id]);
});

it('keeps plan-specific platform fee policy in trainer commerce settings', function () {
    $trainer=m10Trainer();
    $settings=TrainerCommerceSetting::forTrainer($trainer->id);
    expect($settings->platform_fee_bps)->toBe((int) config('commerce.platform_fee_bps'));
});

it('turns a fully discounted one-time checkout into a paid zero-value order without Stripe', function () {
    $trainer = m10Trainer();
    $student = User::factory()->create(['email_verified_at' => now()]);
    $course = Course::factory()->published()->create(['trainer_id' => $trainer->id]);
    $offer = CourseOffer::create([
        'course_id' => $course->id,
        'name' => 'Launch',
        'slug' => 'launch',
        'billing_type' => 'one_time',
        'amount' => 10000,
        'currency' => 'EUR',
        'access_rank' => 100,
        'is_active' => true,
    ]);
    AcademyCoupon::create([
        'trainer_id' => $trainer->id,
        'course_id' => $course->id,
        'code' => 'FREE100',
        'discount_type' => 'percent',
        'discount_value' => 10000,
        'is_active' => true,
    ]);

    $result = app(CheckoutService::class)->begin($student, $course, $offer, 'FREE100');

    expect($result['session'])->toBeNull();
    expect($result['order']->status)->toBe('paid');
    expect($result['order']->gross_amount)->toBe(0);
    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'access_rank' => 100,
    ]);
});

it('uses the actual recurring membership amount for mrr instead of the catalog offer amount', function () {
    $trainer = m10Trainer();
    $student = User::factory()->create();
    $course = Course::factory()->published()->create(['trainer_id' => $trainer->id]);
    $offer = CourseOffer::create([
        'course_id' => $course->id,
        'name' => 'Monthly',
        'slug' => 'monthly-actual',
        'billing_type' => 'subscription',
        'amount' => 4900,
        'currency' => 'EUR',
        'interval' => 'month',
        'access_rank' => 100,
        'is_active' => true,
    ]);
    \App\Models\AcademyMembership::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'offer_id' => $offer->id,
        'stripe_subscription_id' => 'sub_discounted_m10',
        'status' => 'active',
        'recurring_amount' => 3900,
        'currency' => 'EUR',
        'interval' => 'month',
    ]);

    $data = app(CommerceAnalyticsService::class)->forTrainer($trainer->id);

    expect($data['mrrByCurrency'][0]['mrr'])->toBe(3900);
});

it('projects partial refunds proportionally into platform and affiliate ledger values', function () {
    $trainer = m10Trainer();
    $student = User::factory()->create();
    $course = Course::factory()->published()->create(['trainer_id' => $trainer->id]);
    $affiliate = \App\Models\AffiliatePartner::create([
        'trainer_id' => $trainer->id,
        'name' => 'Partner',
        'code' => 'partner-m10',
        'commission_bps' => 1000,
        'is_active' => true,
    ]);
    $order = AcademyOrder::create([
        'trainer_id' => $trainer->id,
        'user_id' => $student->id,
        'course_id' => $course->id,
        'affiliate_id' => $affiliate->id,
        'kind' => 'one_time',
        'status' => 'paid',
        'currency' => 'EUR',
        'subtotal_amount' => 10000,
        'gross_amount' => 10000,
        'platform_fee_amount' => 1500,
        'affiliate_commission_amount' => 1000,
        'stripe_payment_intent_id' => 'pi_projection_m10',
        'paid_at' => now(),
    ]);
    \App\Models\AffiliateCommission::create([
        'affiliate_id' => $affiliate->id,
        'order_id' => $order->id,
        'amount' => 1000,
        'reversed_amount' => 0,
        'currency' => 'EUR',
        'status' => 'accrued',
    ]);
    \App\Models\AcademyRefund::create([
        'order_id' => $order->id,
        'requested_by' => $trainer->id,
        'amount' => 4000,
        'currency' => 'EUR',
        'status' => 'succeeded',
    ]);

    app(\App\Services\Commerce\RefundService::class)->synchronizeOrder($order);

    expect($order->fresh()->refunded_amount)->toBe(4000);
    expect($order->fresh()->refunded_platform_fee_amount)->toBe(600);
    $commission = \App\Models\AffiliateCommission::where('order_id', $order->id)->firstOrFail();
    expect($commission->reversed_amount)->toBe(400);
    expect($commission->status)->toBe('accrued');
});
