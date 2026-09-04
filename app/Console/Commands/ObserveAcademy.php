<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\MissionTower\Services\ObservatoryService;
use App\MissionTower\Services\TowerTokenOwnerResolver;
use Illuminate\Console\Command;
use Throwable;

class ObserveAcademy extends Command
{
    protected $signature = 'tower:observe {--force : Observe even if the Observatory flag is disabled}';
    protected $description = 'Capture an Academy Observatory snapshot and derive Mission Tower insights.';

    public function handle(TowerTokenOwnerResolver $owners, ObservatoryService $observatory): int
    {
        if (! (bool) config('mission-tower.enabled') || (! $this->option('force') && ! (bool) config('mission-tower.observatory.enabled', true))) {
            $this->line('Mission Tower Observatory is disabled.');
            return self::SUCCESS;
        }

        try {
            $owner = $owners->resolve();
            $snapshot = $observatory->observe($owner);
            $this->info("Snapshot {$snapshot->snapshot_uuid}: {$snapshot->status}; {$snapshot->insights()->count()} insight(s) detected.");
            return self::SUCCESS;
        } catch (Throwable $error) {
            $this->error($error->getMessage());
            return self::FAILURE;
        }
    }
}
