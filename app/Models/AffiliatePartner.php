<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class AffiliatePartner extends Model {
 protected $fillable=['trainer_id','name','email','code','commission_bps','is_active'];
 protected function casts(): array { return ['commission_bps'=>'integer','is_active'=>'boolean']; }
 public function trainer(): BelongsTo { return $this->belongsTo(User::class,'trainer_id'); }
 public function commissions(): HasMany { return $this->hasMany(AffiliateCommission::class,'affiliate_id'); }
}
