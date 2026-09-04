<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\MissionTower\Services\TowerReadiness;
use Illuminate\Console\Command;

class CheckMissionTower extends Command
{
    protected $signature = 'academy:tower-check {--probe : Call Academy MCP to verify the live connection}';

    protected $description = 'Check Mission Tower configuration and optional bridge readiness.';

    public function handle(TowerReadiness $readiness): int
    {
        $status = $readiness->snapshot((bool) $this->option('probe'));
        $this->info('NÜM Mission Tower readiness');
        $this->newLine();
        $this->line('Tower enabled: '.($status['towerEnabled'] ? 'YES' : 'NO'));
        $this->line('AI: '.$this->mark($status['ai']['ready']).' '.$status['ai']['provider'].' / '.($status['ai']['model'] ?: 'default'));
        $this->line('Academy MCP: '.$this->mark($status['academyMcp']['ready']).' '.$status['academyMcp']['message']);
        if ($status['academyMcp']['toolCount'] !== null) {
            $this->line('Academy MCP tools: '.$status['academyMcp']['toolCount']);
        }
        $this->line('NümFlow: '.$this->mark($status['numflow']['ready']).' '.$status['numflow']['message']);
        $this->line('Harness: '.$this->mark($status['harness']['ready']).' '.$status['harness']['message']);
        $this->line('Fleet/Coolify: '.$this->mark($status['fleet']['ready']).' '.$status['fleet']['message']);
        $this->newLine();
        $this->line('Overall: '.($status['ready'] ? 'READY' : 'NOT READY'));

        return $status['ready'] ? self::SUCCESS : self::FAILURE;
    }

    private function mark(bool $ready): string
    {
        return $ready ? '[OK]' : '[!!]';
    }
}
