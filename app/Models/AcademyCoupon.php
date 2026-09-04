<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class AcademyCoupon extends Model {
 protected $fillable=['trainer_id','course_id','code','discount_type','discount_value','currency','max_redemptions','redemptions','expires_at','stripe_coupon_id','is_active'];
 protected function casts(): array { return ['discount_value'=>'integer','max_redemptions'=>'integer','redemptions'=>'integer','expires_at'=>'datetime','is_active'=>'boolean']; }
 public function trainer(): BelongsTo { return $this->belongsTo(User::class,'trainer_id'); }
 public function course(): BelongsTo { return $this->belongsTo(Course::class); }
 public function usable(): bool { return $this->is_active && (! $this->expires_at || $this->expires_at->isFuture()) && ($this->max_redemptions===null || $this->redemptions < $this->max_redemptions); }
}
