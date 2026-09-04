<?php

declare(strict_types=1);

namespace App\MissionTower\Bridge;

use App\Mcp\AcademyMcpGateway;
use App\Models\AcademyMcpToken;
use App\MissionTower\Contracts\AcademyGateway;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class AcademyMcpHttpGateway implements AcademyGateway
{
    /** @return array<string, mixed> */
    public function discover(): array
    {
        return $this->request('server/discover');
    }

    /** @return array<int, array<string, mixed>> */
    public function tools(): array
    {
        $result = $this->request('tools/list');

        return array_values(array_filter((array) ($result['tools'] ?? []), 'is_array'));
    }

    /** @param array<string, mixed> $arguments @param array<string, mixed> $inputResponses @return array<string, mixed> */
    public function call(string $tool, array $arguments = [], ?string $requestState = null, array $inputResponses = []): array
    {
        $params = ['name' => $tool, 'arguments' => $arguments];
        if ($requestState !== null) {
            $params['requestState'] = $requestState;
        }
        if ($inputResponses !== []) {
            $params['inputResponses'] = $inputResponses;
        }

        return $this->request('tools/call', $params, $tool);
    }

    /** @param array<string, mixed> $params @return array<string, mixed> */
    private function request(string $method, array $params = [], ?string $tool = null): array
    {
        $url = (string) config('mission-tower.academy_mcp.url');
        $token = (string) config('mission-tower.academy_mcp.token');
        if ($url === '' || $token === '') {
            throw new RuntimeException('Mission Tower Academy MCP URL/token are not configured.');
        }

        $local = $this->dispatchInProcess($url, $token, $method, $params);
        if ($local !== null) {
            return $local;
        }

        $headers = [
            'MCP-Protocol-Version' => AcademyMcpGateway::PROTOCOL,
            'Mcp-Method' => $method,
        ];
        if ($tool !== null) {
            $headers['Mcp-Name'] = $tool;
        }

        $response = $this->client($token)
            ->withHeaders($headers)
            ->post($url, [
                'jsonrpc' => '2.0',
                'id' => (string) Str::uuid(),
                'method' => $method,
                'params' => $params,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Academy MCP returned HTTP '.$response->status().'.');
        }

        $payload = $response->json();
        if (! is_array($payload)) {
            throw new RuntimeException('Academy MCP returned an invalid JSON response.');
        }
        if (isset($payload['error'])) {
            $message = is_array($payload['error']) ? ($payload['error']['message'] ?? 'Unknown MCP error') : 'Unknown MCP error';
            throw new RuntimeException((string) $message);
        }

        return is_array($payload['result'] ?? null) ? $payload['result'] : [];
    }

    /** @param array<string, mixed> $params @return array<string, mixed>|null */
    private function dispatchInProcess(string $url, string $token, string $method, array $params): ?array
    {
        if (! (bool) config('mission-tower.academy_mcp.in_process', true)) {
            return null;
        }

        $localUrl = rtrim((string) config('app.url'), '/').'/mcp';
        if (rtrim($url, '/') !== rtrim($localUrl, '/')) {
            return null;
        }

        $mcpToken = AcademyMcpToken::query()
            ->with('user.roles')
            ->where('token_hash', hash('sha256', $token))
            ->first();

        if (! $mcpToken || ! $mcpToken->isActive() || ! $mcpToken->user?->hasAnyRole(['trainer', 'admin', 'super-admin'])) {
            throw new RuntimeException('Local MCP token is invalid, revoked, expired, or not authorized for Mission Tower.');
        }

        if ($mcpToken->user->email_verified_at === null) {
            throw new RuntimeException('Local MCP token user email must be verified.');
        }

        $mcpToken->forceFill(['last_used_at' => now()])->save();

        return app(AcademyMcpGateway::class)->dispatch(
            $mcpToken,
            $mcpToken->user,
            $method,
            $params,
            (string) Str::uuid(),
        );
    }

    private function client(string $token): PendingRequest
    {
        return Http::acceptJson()
            ->asJson()
            ->withToken($token)
            ->timeout(max(1, (int) config('mission-tower.academy_mcp.timeout', 10)));
    }
}
