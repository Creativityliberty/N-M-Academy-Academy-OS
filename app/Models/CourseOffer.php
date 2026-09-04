<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class CourseOffer extends Model {
    protected $fillable=['course_id','name','slug','billing_type','amount','currency','interval','access_rank','trial_days','stripe_product_id','stripe_price_id','is_default','is_active'];
    protected function casts(): array { return ['amount'=>'integer','access_rank'=>'integer','trial_days'=>'integer','is_default'=>'boolean','is_active'=>'boolean']; }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function orders(): HasMany { return $this->hasMany(AcademyOrder::class,'offer_id'); }
}
