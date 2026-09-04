<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Factory\AcademyFactoryProvisioner;
use App\Models\AcademyFactoryDeployment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Throwable;

class ProvisionAcademyDeployment implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public function __construct(public readonly int $deploymentId) {}

    public function middleware(): array
    {
        return [(new WithoutOverlapping('academy-factory-'.$this->deploymentId))->expireAfter(600)];
    }

    public function handle(AcademyFactoryProvisioner $provisioner): void
    {
        $deployment = AcademyFactoryDeployment::findOrFail($this->deploymentId);
        try {
            $deployment = $provisioner->provision($deployment);
            VerifyAcademyDeployment::dispatch($deployment->id)->delay(now()->addSeconds(30));
        } catch (Throwable $e) {
            $deployment->forceFill(['status'=>'failed','last_error'=>mb_substr($e->getMessage(), 0, 4000)])->save();
            $deployment->markStep('provisioning', 'failed', $deployment->last_error);
            throw $e;
        }
    }
}
