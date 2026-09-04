<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\AcademyMcpToken;
use Illuminate\Console\Command;

class RevokeAcademyMcpToken extends Command
{
    protected $signature = 'academy:mcp-token-revoke {token : Academy MCP token id}';

    protected $description = 'Revoke an Academy MCP token without deleting its audit history.';

    public function handle(): int
    {
        $token = AcademyMcpToken::query()->find((int) $this->argument('token'));
        if (! $token) {
            $this->error('Academy MCP token not found.');

            return self::FAILURE;
        }

        $token->update(['revoked_at' => now()]);
        $this->info("Academy MCP token #{$token->id} revoked.");

        return self::SUCCESS;
    }
}
