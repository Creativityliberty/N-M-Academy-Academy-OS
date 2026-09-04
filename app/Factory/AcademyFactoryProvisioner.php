<?php

declare(strict_types=1);

namespace App\Factory;

use App\Models\AcademyFactoryDeployment;
use RuntimeException;

class AcademyFactoryProvisioner
{
    public function __construct(private readonly CoolifyClient $coolify) {}

    public function provision(AcademyFactoryDeployment $deployment): AcademyFactoryDeployment
    {
        if (! config('factory.enabled')) {
            throw new RuntimeException('Academy Factory is disabled on this instance.');
        }
        if (blank(config('factory.coolify.server_uuid')) || blank(config('factory.coolify.git_repository'))) {
            throw new RuntimeException('Coolify server UUID and Factory Git repository are required.');
        }
        if (config('factory.coolify.source_mode') === 'private_deploy_key' && blank(config('factory.coolify.private_key_uuid'))) {
            throw new RuntimeException('Private deploy-key source mode requires ACADEMY_FACTORY_PRIVATE_KEY_UUID.');
        }

        $deployment->forceFill(['status'=>'provisioning','last_error'=>null])->save();

        if (! $deployment->coolify_project_uuid) {
            $deployment->markStep('project', 'running');
            $deployment->coolify_project_uuid = $this->coolify->createProject('Academy - '.$deployment->client_name);
            $deployment->save();
            $deployment->markStep('project', 'done', $deployment->coolify_project_uuid);
        }

        if (! $deployment->coolify_environment_uuid) {
            $deployment->markStep('environment', 'running');
            $deployment->coolify_environment_uuid = $this->coolify->createEnvironment($deployment->coolify_project_uuid);
            $deployment->save();
            $deployment->markStep('environment', 'done', $deployment->coolify_environment_uuid);
        }

        if (! $deployment->coolify_application_uuid) {
            $deployment->markStep('application', 'running');
            $deployment->coolify_application_uuid = $this->coolify->createApplication(
                $deployment->coolify_project_uuid,
                $deployment->coolify_environment_uuid,
                $deployment->client_name,
            );
            $deployment->save();
            $deployment->markStep('application', 'done', $deployment->coolify_application_uuid);
        }

        if ($deployment->secrets !== null) {
            $deployment->markStep('environment_variables', 'running');
            $secrets = (array) $deployment->secrets;
            $environment = array_merge((array) data_get($deployment->blueprint, 'environment', []), $secrets);
            $this->coolify->updateEnvironment($deployment->coolify_application_uuid, $environment, array_keys($secrets));
            $deployment->forceFill(['secrets'=>null])->save();
            $deployment->markStep('environment_variables', 'done', count($environment).' variables injected');
        }

        if ($deployment->phase !== 'awaiting_compose' && $deployment->phase !== 'awaiting_health') {
            $deployment->markStep('bootstrap_deploy', 'running');
            $deploymentUuid = $this->coolify->deploy($deployment->coolify_application_uuid);
            $deployment->forceFill([
                'coolify_deployment_uuid' => $deploymentUuid ?: $deployment->coolify_deployment_uuid,
                'status' => 'deploying',
                'phase' => 'awaiting_compose',
            ])->save();
            $deployment->markStep('bootstrap_deploy', 'queued', $deploymentUuid ?: null);
        }

        return $deployment->fresh();
    }
}
