<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class TrainerCommerceSetting extends Model {
 protected $fillable=['trainer_id','platform_fee_bps','default_affiliate_bps','currency'];
 protected function casts(): array { return ['platform_fee_bps'=>'integer','default_affiliate_bps'=>'integer']; }
 public function trainer(): BelongsTo { return $this->belongsTo(User::class,'trainer_id'); }
 public static function forTrainer(int $trainerId): self { return self::firstOrCreate(['trainer_id'=>$trainerId],['platform_fee_bps'=>(int) config('commerce.platform_fee_bps',1500),'default_affiliate_bps'=>(int) config('commerce.default_affiliate_bps',1000),'currency'=>strtoupper((string) config('commerce.currency','EUR'))]); }
}
