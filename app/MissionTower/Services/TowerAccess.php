<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerCompilation;
use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Models\TowerEvidence;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerMemory;
use App\MissionTower\Models\TowerInsight;
use App\MissionTower\Models\TowerObservatorySnapshot;
use App\MissionTower\Models\TowerRun;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TowerAccess
{
    public function chatThreadQuery(User $user): Builder
    {
        $query = TowerChatThread::query();

        return $user->hasAnyRole(['admin', 'super-admin']) ? $query : $query->where('owner_id', $user->id);
    }

    public function compilationQuery(User $user): Builder
    {
        $query = TowerCompilation::query();

        return $user->hasAnyRole(['admin', 'super-admin']) ? $query : $query->where('owner_id', $user->id);
    }

    public function missionQuery(User $user): Builder
    {
        $query = TowerMission::query();

        return $user->hasAnyRole(['admin', 'super-admin']) ? $query : $query->where('owner_id', $user->id);
    }

    public function approvalQuery(User $user): Builder
    {
        $query = TowerApproval::query()->whereHas('mission');

        return $user->hasAnyRole(['admin', 'super-admin'])
            ? $query
            : $query->whereHas('mission', fn (Builder $builder) => $builder->where('owner_id', $user->id));
    }

    public function runQuery(User $user): Builder
    {
        $query = TowerRun::query()->whereHas('mission');

        return $user->hasAnyRole(['admin', 'super-admin'])
            ? $query
            : $query->whereHas('mission', fn (Builder $builder) => $builder->where('owner_id', $user->id));
    }

    public function insightQuery(User $user): Builder
    {
        $query = TowerInsight::query();

        return $user->hasAnyRole(['admin', 'super-admin']) ? $query : $query->where('owner_id', $user->id);
    }

    public function snapshotQuery(User $user): Builder
    {
        $query = TowerObservatorySnapshot::query();

        return $user->hasAnyRole(['admin', 'super-admin']) ? $query : $query->where('owner_id', $user->id);
    }


    public function memoryQuery(User $user): Builder
    {
        $query = TowerMemory::query();

        return $user->hasAnyRole(['admin', 'super-admin']) ? $query : $query->where('owner_id', $user->id);
    }

    public function evidenceQuery(User $user): Builder
    {
        $query = TowerEvidence::query()->whereHas('mission');

        return $user->hasAnyRole(['admin', 'super-admin'])
            ? $query
            : $query->whereHas('mission', fn (Builder $builder) => $builder->where('owner_id', $user->id));
    }

    public function assertChatThread(User $user, TowerChatThread $thread): void
    {
        if ($thread->owner_id !== $user->id && ! $user->hasAnyRole(['admin', 'super-admin'])) {
            throw new HttpException(403, 'You cannot access this Tower chat thread.');
        }
    }


    public function assertMemory(User $user, TowerMemory $memory): void
    {
        if ($memory->owner_id !== $user->id && ! $user->hasAnyRole(['admin', 'super-admin'])) {
            throw new HttpException(403, 'You cannot access this Tower memory.');
        }
    }

    public function assertCompilation(User $user, TowerCompilation $compilation): void
    {
        if ($compilation->owner_id !== $user->id && ! $user->hasAnyRole(['admin', 'super-admin'])) {
            throw new HttpException(403, 'You cannot access this Tower compilation.');
        }
    }

    public function assertMission(User $user, TowerMission $mission): void
    {
        if ($mission->owner_id !== $user->id && ! $user->hasAnyRole(['admin', 'super-admin'])) {
            throw new HttpException(403, 'You cannot access this Tower mission.');
        }
    }

    public function assertApproval(User $user, TowerApproval $approval): void
    {
        $this->assertMission($user, $approval->mission()->firstOrFail());
    }
}
