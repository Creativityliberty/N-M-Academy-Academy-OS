<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Factory\CoolifyClient;
use App\Models\AcademyFactoryDeployment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class VerifyAcademyDeployment implements ShouldQueue
{
    use Queueable;

    public int $tries = 16;
    public array $backoff = [30, 45, 60, 90, 120, 180, 240, 300];

    public function __construct(public readonly int $deploymentId) {}

    public function middleware(): array
    {
        return [(new WithoutOverlapping('academy-factory-'.$this->deploymentId))->expireAfter(600)];
    }

    public function handle(CoolifyClient $coolify): void
    {
        $deployment = AcademyFactoryDeployment::findOrFail($this->deploymentId);
        if ($deployment->completed_at || ! $deployment->coolify_application_uuid) {
            return;
        }

        try {
            if ($deployment->phase === 'awaiting_compose') {
                $application = $coolify->application($deployment->coolify_application_uuid);
                if (blank($application['docker_compose_raw'] ?? null)) {
                    throw new RuntimeException('Coolify has not loaded the Docker Compose source yet.');
                }

                $deployment->markStep('domain', 'running');
                $coolify->setComposeDomain($deployment->coolify_application_uuid, $deployment->domain);
                $deployment->markStep('domain', 'done', $deployment->domain);
                $deploymentUuid = $coolify->deploy($deployment->coolify_application_uuid, true);
                $deployment->forceFill([
                    'coolify_deployment_uuid' => $deploymentUuid ?: $deployment->coolify_deployment_uuid,
                    'phase' => 'awaiting_health',
                    'status' => 'deploying',
                ])->save();
                $deployment->markStep('domain_deploy', 'queued', $deploymentUuid ?: null);
                self::dispatch($deployment->id)->delay(now()->addSeconds(45));
                return;
            }

            if ($deployment->phase !== 'awaiting_health') {
                throw new RuntimeException('Unexpected Factory verification phase: '.$deployment->phase);
            }

            $scheme = (string) config('factory.verification.scheme', 'https');
            $healthPath = '/'.ltrim((string) config('factory.verification.health_path', '/up'), '/');
            $healthUrl = "{$scheme}://{$deployment->domain}{$healthPath}";
            $deployment->forceFill(['last_health_check_at'=>now()])->save();
            $response = Http::acceptJson()->timeout(10)->get($healthUrl);
            if (! $response->successful()) {
                throw new RuntimeException('Academy healthcheck is not healthy yet (HTTP '.$response->status().').');
            }

            $deployment->markStep('healthcheck', 'done', $healthUrl);
            $coolify->updateEnvironmentVariable($deployment->coolify_application_uuid, 'ACADEMY_BOOTSTRAP_OWNER_PASSWORD', '', true);
            $deployment->forceFill([
                'status'=>'healthy', 'phase'=>'complete', 'completed_at'=>now(), 'last_error'=>null,
            ])->save();
            $deployment->markStep('complete', 'done', 'Academy is live');
        } catch (Throwable $e) {
            $deployment->forceFill(['last_error'=>mb_substr($e->getMessage(), 0, 4000)])->save();
            if ($this->attempts() >= $this->tries) {
                $deployment->forceFill(['status'=>'failed'])->save();
                $deployment->markStep('verification', 'failed', $deployment->last_error);
                return;
            }
            throw $e;
        }
    }
}
