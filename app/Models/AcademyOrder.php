<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class AcademyOrder extends Model {
 protected $fillable=['trainer_id','user_id','course_id','offer_id','coupon_id','affiliate_id','kind','status','currency','subtotal_amount','discount_amount','gross_amount','platform_fee_amount','affiliate_commission_amount','refunded_amount','refunded_platform_fee_amount','stripe_checkout_session_id','stripe_payment_intent_id','stripe_subscription_id','stripe_invoice_id','paid_at'];
 protected function casts(): array { return ['subtotal_amount'=>'integer','discount_amount'=>'integer','gross_amount'=>'integer','platform_fee_amount'=>'integer','affiliate_commission_amount'=>'integer','refunded_amount'=>'integer','refunded_platform_fee_amount'=>'integer','paid_at'=>'datetime']; }
 public function trainer(): BelongsTo { return $this->belongsTo(User::class,'trainer_id'); }
 public function user(): BelongsTo { return $this->belongsTo(User::class); }
 public function course(): BelongsTo { return $this->belongsTo(Course::class); }
 public function offer(): BelongsTo { return $this->belongsTo(CourseOffer::class,'offer_id'); }
 public function coupon(): BelongsTo { return $this->belongsTo(AcademyCoupon::class,'coupon_id'); }
 public function affiliate(): BelongsTo { return $this->belongsTo(AffiliatePartner::class,'affiliate_id'); }
 public function refunds(): HasMany { return $this->hasMany(AcademyRefund::class,'order_id'); }
}
