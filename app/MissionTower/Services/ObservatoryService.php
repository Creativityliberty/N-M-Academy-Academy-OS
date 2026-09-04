<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerObservatorySnapshot;
use App\Models\User;

class ObservatoryService
{
    public function __construct(
        private readonly ObservatoryCollector $collector,
        private readonly ObservatorySignalEngine $signals,
    ) {}

    public function observe(User $owner): TowerObservatorySnapshot
    {
        $snapshot = $this->collector->collect($owner);
        $this->signals->evaluate($snapshot);

        return $snapshot->fresh('insights');
    }
}
