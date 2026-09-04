<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademyFactoryDeployment extends Model
{
    protected $fillable = [
        'created_by', 'receipt_id', 'client_name', 'slug', 'template_key', 'domain',
        'status', 'phase', 'blueprint', 'secrets', 'steps', 'coolify_project_uuid',
        'coolify_environment_uuid', 'coolify_application_uuid', 'coolify_deployment_uuid',
        'last_error', 'last_health_check_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'blueprint' => 'array',
            'secrets' => 'encrypted:array',
            'steps' => 'array',
            'last_health_check_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function markStep(string $key, string $status, ?string $message = null): void
    {
        $steps = (array) ($this->steps ?? []);
        $steps[$key] = [
            'status' => $status,
            'message' => $message,
            'at' => now()->toIso8601String(),
        ];
        $this->forceFill(['steps' => $steps])->save();
    }
}
