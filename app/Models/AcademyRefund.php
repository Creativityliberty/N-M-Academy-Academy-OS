<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class AcademyRefund extends Model {
 protected $fillable=['order_id','requested_by','amount','currency','reason','status','stripe_refund_id','receipt_id','processed_at'];
 protected function casts(): array { return ['amount'=>'integer','processed_at'=>'datetime']; }
 public function order(): BelongsTo { return $this->belongsTo(AcademyOrder::class,'order_id'); }
 public function requester(): BelongsTo { return $this->belongsTo(User::class,'requested_by'); }
}
