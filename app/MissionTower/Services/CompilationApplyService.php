<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerCompilation;
use App\MissionTower\Models\TowerMission;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CompilationApplyService
{
    public function __construct(private readonly CompiledMissionValidator $validator) {}

    public function apply(TowerCompilation $compilation, User $user): TowerMission
    {
        return DB::transaction(function () use ($compilation, $user): TowerMission {
            $locked = TowerCompilation::query()->whereKey($compilation->id)->lockForUpdate()->firstOrFail();
            if ($locked->owner_id !== $user->id && ! $user->hasAnyRole(['admin', 'super-admin'])) {
                throw new HttpException(403, 'You cannot apply this Tower compilation.');
            }
            if ($locked->mission_id) {
                return $locked->mission()->firstOrFail();
            }
            if ($locked->status !== 'proposal' || ! is_array($locked->proposal)) {
                throw new RuntimeException('Cette compilation ne contient pas de proposition applicable.');
            }

            // Revalidate against the live MCP catalog because token abilities may have changed since compilation.
            $proposal = $this->validator->validateCanonical($locked->proposal);
            $mission = TowerMission::create([
                'owner_id' => $locked->owner_id,
                'title' => $proposal['title'],
                'objective' => $proposal['objective'],
                'priority' => $proposal['priority'],
                'status' => 'draft',
                'source' => 'compiler',
                'metadata' => [
                    'compilation_id' => $locked->id,
                    'compiler_provider' => $locked->provider,
                    'compiler_model' => $locked->model,
                    'compiler_summary' => $proposal['summary'],
                    'compiler_assumptions' => $proposal['assumptions'],
                ],
            ]);

            foreach ($proposal['steps'] as $step) {
                $mission->steps()->create([
                    'position' => $step['position'],
                    'title' => $step['title'],
                    'tool' => $step['tool'],
                    'risk' => $step['risk'],
                    'arguments' => $step['arguments'],
                    'status' => 'pending',
                ]);
            }

            $locked->update([
                'status' => 'applied',
                'proposal' => $proposal,
                'mission_id' => $mission->id,
                'applied_at' => now(),
            ]);

            return $mission;
        });
    }
}
