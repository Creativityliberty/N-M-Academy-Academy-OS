<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Factory\AcademyFactoryProvisioner;
use App\Jobs\VerifyAcademyDeployment;
use App\Models\AcademyFactoryDeployment;
use Illuminate\Console\Command;

class ProvisionAcademyFactoryDeployment extends Command
{
    protected $signature = 'academy:factory:provision {deployment : Deployment ID}';
    protected $description = 'Resume/provision an Academy Factory deployment and queue verification.';

    public function handle(AcademyFactoryProvisioner $provisioner): int
    {
        $deployment = AcademyFactoryDeployment::find((int) $this->argument('deployment'));
        if (! $deployment) {
            $this->components->error('Factory deployment not found.');
            return self::FAILURE;
        }
        $deployment = $provisioner->provision($deployment);
        VerifyAcademyDeployment::dispatch($deployment->id)->delay(now()->addSeconds(30));
        $this->components->info("Provisioning queued for {$deployment->domain} ({$deployment->receipt_id}).");
        return self::SUCCESS;
    }
}
