<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Contracts\AcademyGateway;
use Throwable;

class TowerReadiness
{
    public function __construct(private readonly AcademyGateway $academy) {}

    /** @return array<string, mixed> */
    public function snapshot(bool $probe = false): array
    {
        $ai = $this->aiStatus();
        $mcp = $this->mcpStatus($probe);
        $numflow = $this->optionalBridge('numflow');
        $harness = $this->optionalBridge('harness');
        $fleet = $this->fleetStatus();

        $requiredReady = (bool) config('mission-tower.enabled') && $ai['ready'] && $mcp['ready'];
        $optionalReady = $numflow['ready'] && $harness['ready'] && $fleet['ready'];

        return [
            'ready' => $requiredReady && $optionalReady,
            'towerEnabled' => (bool) config('mission-tower.enabled'),
            'ai' => $ai,
            'academyMcp' => $mcp,
            'numflow' => $numflow,
            'harness' => $harness,
            'fleet' => $fleet,
        ];
    }

    /** @return array<string, mixed> */
    private function aiStatus(): array
    {
        $provider = (string) config('mission-tower.ai.provider', 'inherit');
        if ($provider === 'inherit') {
            $provider = (string) config('academy-ai.provider', 'disabled');
        }

        $configured = match ($provider) {
            'openai' => trim((string) config('academy-ai.openai.api_key')) !== '',
            'deepseek' => trim((string) config('academy-ai.deepseek.api_key')) !== '',
            default => false,
        };

        return [
            'ready' => $configured,
            'provider' => $provider,
            'model' => config('mission-tower.ai.model') ?: config('academy-ai.model_override') ?: config("academy-ai.{$provider}.model"),
            'message' => $configured ? 'Provider IA configuré.' : 'Configure OpenAI ou DeepSeek pour compiler/analyser les missions.',
        ];
    }

    /** @return array<string, mixed> */
    private function mcpStatus(bool $probe): array
    {
        $configured = trim((string) config('mission-tower.academy_mcp.url')) !== ''
            && trim((string) config('mission-tower.academy_mcp.token')) !== '';
        if (! $configured || ! $probe) {
            return [
                'ready' => $configured,
                'configured' => $configured,
                'connected' => null,
                'toolCount' => null,
                'message' => $configured ? 'Academy MCP configuré; lance un probe pour vérifier la connexion.' : 'Crée un token Academy MCP dédié à Tower.',
            ];
        }

        try {
            $discover = $this->academy->discover();
            $tools = $this->academy->tools();

            return [
                'ready' => true,
                'configured' => true,
                'connected' => true,
                'toolCount' => count($tools),
                'protocol' => $discover['supportedVersions'][0] ?? null,
                'message' => 'Academy MCP joignable.',
            ];
        } catch (Throwable $error) {
            return [
                'ready' => false,
                'configured' => true,
                'connected' => false,
                'toolCount' => null,
                'message' => $error->getMessage(),
            ];
        }
    }

    /** @return array<string, mixed> */
    private function optionalBridge(string $name): array
    {
        $enabled = (bool) config("mission-tower.{$name}.enabled", false);
        $configured = trim((string) config("mission-tower.{$name}.url")) !== ''
            && trim((string) config("mission-tower.{$name}.token")) !== '';

        return [
            'enabled' => $enabled,
            'ready' => ! $enabled || $configured,
            'configured' => $configured,
            'message' => ! $enabled
                ? 'Optionnel et désactivé.'
                : ($configured ? 'Bridge configuré.' : 'Bridge activé mais URL/token manquants.'),
        ];
    }

    /** @return array<string, mixed> */
    private function fleetStatus(): array
    {
        $enabled = (bool) config('mission-tower.fleet.enabled', false);
        $configured = trim((string) config('mission-tower.fleet.coolify_api_url')) !== ''
            && trim((string) config('mission-tower.fleet.coolify_api_token')) !== ''
            && trim((string) config('mission-tower.fleet.coolify_server_uuid')) !== '';

        return [
            'enabled' => $enabled,
            'ready' => ! $enabled || $configured,
            'configured' => $configured,
            'message' => ! $enabled
                ? 'Fleet Mode optionnel et désactivé.'
                : ($configured ? 'Coolify Fleet configuré.' : 'Fleet activé mais variables Coolify incomplètes.'),
        ];
    }
}
