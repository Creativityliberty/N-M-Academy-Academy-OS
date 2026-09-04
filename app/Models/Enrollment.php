<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'offer_id',
        'access_rank',
        'stripe_payment_intent_id',
        'amount_paid',
        'currency',
        'paid_at',
        'enrolled_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_paid' => 'decimal:2',
            'access_rank' => 'integer',
            'paid_at' => 'datetime',
            'enrolled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(CourseOffer::class, 'offer_id');
    }
}
