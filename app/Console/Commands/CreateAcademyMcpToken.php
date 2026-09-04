<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\AcademyMcpToken;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateAcademyMcpToken extends Command
{
    protected $signature = 'academy:mcp-token {user : User id or email} {--name=Agent : Token label} {--days= : Optional expiry in days} {--ability=* : Allowed tool name; repeat for multiple tools}';

    protected $description = 'Create a one-time Academy MCP bearer token for a trainer/admin.';

    public function handle(): int
    {
        $identity = (string) $this->argument('user');
        $user = User::query()
            ->where('id', ctype_digit($identity) ? (int) $identity : -1)
            ->orWhere('email', $identity)
            ->first();

        if (! $user || ! $user->hasAnyRole(['trainer', 'admin', 'super-admin']) || $user->email_verified_at === null) {
            $this->error('A verified trainer/admin user is required.');

            return self::FAILURE;
        }

        $plain = 'num_mcp_'.Str::random(64);
        $days = $this->option('days');
        AcademyMcpToken::create([
            'user_id' => $user->id,
            'name' => mb_substr((string) $this->option('name'), 0, 120),
            'token_hash' => hash('sha256', $plain),
            'abilities' => ($abilities = array_values(array_filter((array) $this->option('ability')))) !== [] ? $abilities : ['*'],
            'expires_at' => $days !== null ? now()->addDays(max(1, (int) $days)) : null,
        ]);

        $this->warn('Copy this token now. It will not be shown again:');
        $this->line($plain);

        return self::SUCCESS;
    }
}
