<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademyMcpCall extends Model
{
    protected $fillable = [
        'receipt_id', 'academy_mcp_token_id', 'user_id', 'request_id', 'tool', 'risk', 'arguments', 'status',
        'result', 'error_message', 'approved_at', 'executed_at',
    ];

    protected function casts(): array
    {
        return [
            'arguments' => 'array',
            'result' => 'array',
            'approved_at' => 'datetime',
            'executed_at' => 'datetime',
        ];
    }

    public function token(): BelongsTo
    {
        return $this->belongsTo(AcademyMcpToken::class, 'academy_mcp_token_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
