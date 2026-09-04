<?php

declare(strict_types=1);

namespace App\Factory;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CoolifyClient
{
    private function request(): PendingRequest
    {
        $baseUrl = (string) config('factory.coolify.base_url');
        $token = (string) config('factory.coolify.api_token');
        if ($baseUrl === '' || $token === '') {
            throw new RuntimeException('Coolify API URL/token are not configured.');
        }

        $apiBase = rtrim($baseUrl, '/');
        if (! str_ends_with($apiBase, '/api/v1')) {
            $apiBase .= '/api/v1';
        }

        return Http::baseUrl($apiBase)
            ->withToken($token)
            ->acceptJson()
            ->asJson()
            ->timeout(30)
            ->retry(2, 500, throw: false);
    }

    public function createProject(string $name): string
    {
        $data = $this->request()->post('/projects', ['name'=>$name, 'description'=>'Provisioned by NÜM Academy Factory'])->throw()->json();
        return (string) ($data['uuid'] ?? throw new RuntimeException('Coolify project UUID missing.'));
    }

    public function createEnvironment(string $projectUuid, string $name = 'production'): string
    {
        $data = $this->request()->post("/projects/{$projectUuid}/environments", ['name'=>$name])->throw()->json();
        return (string) ($data['uuid'] ?? throw new RuntimeException('Coolify environment UUID missing.'));
    }

    public function createApplication(string $projectUuid, string $environmentUuid, string $name): string
    {
        $mode = (string) config('factory.coolify.source_mode', 'public');
        $payload = [
            'project_uuid' => $projectUuid,
            'environment_uuid' => $environmentUuid,
            'server_uuid' => (string) config('factory.coolify.server_uuid'),
            'destination_uuid' => config('factory.coolify.destination_uuid') ?: null,
            'git_repository' => (string) config('factory.coolify.git_repository'),
            'git_branch' => (string) config('factory.coolify.git_branch', 'main'),
            'build_pack' => 'dockercompose',
            'ports_exposes' => '80',
            'docker_compose_location' => (string) config('factory.coolify.compose_location', '/docker-compose.coolify.yml'),
            'name' => $name,
            'description' => 'NÜM Academy OS single-tenant client instance',
            'instant_deploy' => false,
            'autogenerate_domain' => false,
            'is_force_https_enabled' => true,
            'connect_to_docker_network' => true,
        ];
        $payload = array_filter($payload, fn ($value) => $value !== null && $value !== '');

        $endpoint = '/applications/public';
        if ($mode === 'private_deploy_key') {
            $endpoint = '/applications/private-deploy-key';
            $payload['private_key_uuid'] = (string) config('factory.coolify.private_key_uuid');
        }

        $data = $this->request()->post($endpoint, $payload)->throw()->json();
        return (string) ($data['uuid'] ?? throw new RuntimeException('Coolify application UUID missing.'));
    }

    public function updateEnvironment(string $applicationUuid, array $environment, array $secretKeys = []): void
    {
        if ($environment === []) {
            return;
        }

        $existing = collect($this->request()->get("/applications/{$applicationUuid}/envs")->throw()->json())
            ->pluck('key')
            ->filter()
            ->map(fn ($key) => (string) $key)
            ->all();

        $updates = [];
        foreach ($environment as $key => $value) {
            $payload = [
                'key' => (string) $key,
                'value' => (string) $value,
                'is_preview' => false,
                'is_literal' => true,
                'is_multiline' => false,
                'is_shown_once' => in_array((string) $key, $secretKeys, true),
            ];

            if (in_array((string) $key, $existing, true)) {
                $updates[] = $payload;
                continue;
            }

            $this->request()->post("/applications/{$applicationUuid}/envs", $payload)->throw();
        }

        if ($updates !== []) {
            $this->request()->patch("/applications/{$applicationUuid}/envs/bulk", ['data'=>$updates])->throw();
        }
    }

    public function updateEnvironmentVariable(string $applicationUuid, string $key, string $value, bool $shownOnce = true): void
    {
        $this->request()->patch("/applications/{$applicationUuid}/envs", [
            'key'=>$key, 'value'=>$value, 'is_preview'=>false, 'is_literal'=>true, 'is_multiline'=>false, 'is_shown_once'=>$shownOnce,
        ])->throw();
    }

    public function deploy(string $applicationUuid, bool $force = false): ?string
    {
        $data = $this->request()->post('/deploy', ['uuid'=>$applicationUuid, 'force'=>$force])->throw()->json();
        return (string) data_get($data, 'deployments.0.deployment_uuid', '');
    }

    public function application(string $applicationUuid): array
    {
        return (array) $this->request()->get("/applications/{$applicationUuid}")->throw()->json();
    }

    public function setComposeDomain(string $applicationUuid, string $domain): void
    {
        $scheme = (string) config('factory.verification.scheme', 'https');
        $this->request()->patch("/applications/{$applicationUuid}", [
            'docker_compose_domains' => [[
                'name' => 'app',
                'domain' => "{$scheme}://{$domain}",
            ]],
            'force_domain_override' => false,
        ])->throw();
    }
}
