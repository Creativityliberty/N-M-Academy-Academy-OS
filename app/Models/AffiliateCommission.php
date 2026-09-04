<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class AffiliateCommission extends Model {
 protected $fillable=['affiliate_id','order_id','amount','reversed_amount','currency','status','paid_at'];
 protected function casts(): array { return ['amount'=>'integer','reversed_amount'=>'integer','paid_at'=>'datetime']; }
 public function affiliate(): BelongsTo { return $this->belongsTo(AffiliatePartner::class,'affiliate_id'); }
 public function order(): BelongsTo { return $this->belongsTo(AcademyOrder::class,'order_id'); }
}
