<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseCertificate extends Model
{
    protected $fillable = [
        'completion_id',
        'user_id',
        'course_id',
        'verification_code',
        'recipient_name',
        'course_title',
        'issuer_name',
        'certificate_title',
        'document_hash',
        'issued_at',
        'revoked_at',
        'revoked_by',
        'revocation_reason',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function completion(): BelongsTo { return $this->belongsTo(CourseCompletion::class, 'completion_id'); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function revoker(): BelongsTo { return $this->belongsTo(User::class, 'revoked_by'); }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }
}
