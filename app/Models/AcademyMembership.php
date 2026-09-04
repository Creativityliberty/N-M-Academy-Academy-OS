<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class AcademyMembership extends Model {
 protected $fillable=['order_id','user_id','course_id','offer_id','stripe_subscription_id','status','recurring_amount','currency','interval','current_period_start','current_period_end','canceled_at','ended_at'];
 protected function casts(): array { return ['recurring_amount'=>'integer','current_period_start'=>'datetime','current_period_end'=>'datetime','canceled_at'=>'datetime','ended_at'=>'datetime']; }
 public function order(): BelongsTo { return $this->belongsTo(AcademyOrder::class,'order_id'); }
 public function offer(): BelongsTo { return $this->belongsTo(CourseOffer::class,'offer_id'); }
 public function course(): BelongsTo { return $this->belongsTo(Course::class); }
 public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
