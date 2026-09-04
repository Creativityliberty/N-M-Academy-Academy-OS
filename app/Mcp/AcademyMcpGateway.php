<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Models\AcademyMcpCall;
use App\Models\AcademyMcpToken;
use App\Models\User;
use Illuminate\Support\Str;
use Throwable;

class AcademyMcpGateway
{
    public const PROTOCOL = '2026-07-28';

    public function __construct(
        private readonly AcademyMcpToolRegistry $registry,
        private readonly AcademyMcpToolExecutor $executor,
        private readonly AcademyMcpApprovalService $approval,
    ) {}

    /** @param array<string, mixed> $params @return array<string, mixed> */
    public function dispatch(AcademyMcpToken $token, User $user, string $method, array $params, string|int|null $requestId): array
    {
        return match ($method) {
            'server/discover' => $this->discover(),
            'tools/list' => $this->listTools($token, $user),
            'tools/call' => $this->callTool($token, $user, $params, $requestId),
            default => throw new \InvalidArgumentException("Unsupported MCP method: {$method}"),
        };
    }

    /** @return array<string, mixed> */
    public function discover(): array
    {
        return $this->stamp([
            'resultType' => 'complete',
            'supportedVersions' => [self::PROTOCOL],
            'capabilities' => ['tools' => ['listChanged' => false]],
            'instructions' => 'NÜM Academy OS business tools. Mutating tools use MCP multi-round approvals before execution.',
            'ttlMs' => 300000,
            'cacheScope' => 'private',
        ]);
    }

    /** @return array<string, mixed> */
    private function listTools(AcademyMcpToken $token, User $user): array
    {
        $tools = array_values(array_filter($this->registry->mcpTools(), fn (array $tool) => $token->allows((string) $tool['name']) && $this->registry->allowedForUser((string) $tool['name'], $user)));

        return $this->stamp([
            'resultType' => 'complete',
            'tools' => $tools,
            'ttlMs' => 300000,
            'cacheScope' => 'private',
        ]);
    }

    /** @param array<string, mixed> $params @return array<string, mixed> */
    private function callTool(AcademyMcpToken $token, User $user, array $params, string|int|null $requestId): array
    {
        $tool = (string) ($params['name'] ?? '');
        $arguments = is_array($params['arguments'] ?? null) ? $params['arguments'] : [];
        $definition = $this->registry->get($tool);

        if (! $this->registry->allowedForUser($tool, $user)) {
            $call = $this->newCall($token, $user, $requestId, $tool, (string) $definition['risk'], $arguments, 'denied');

            return $this->toolError($call, 'This MCP user role is not allowed to call this tool.');
        }

        if (! $token->allows($tool)) {
            $call = $this->newCall($token, $user, $requestId, $tool, (string) $definition['risk'], $arguments, 'denied');

            return $this->toolError($call, 'This MCP token is not allowed to call this tool.');
        }

        try {
            $arguments = $this->executor->preflight($user, $tool, $arguments);
        } catch (Throwable $error) {
            $call = $this->newCall($token, $user, $requestId, $tool, (string) $definition['risk'], $arguments, 'failed');
            $call->update(['error_message' => mb_substr($error->getMessage(), 0, 4000), 'executed_at' => now()]);

            return $this->toolError($call->fresh(), $error->getMessage());
        }

        $requestState = $params['requestState'] ?? null;
        $inputResponses = is_array($params['inputResponses'] ?? null) ? $params['inputResponses'] : [];

        if ($definition['risk'] !== AcademyMcpToolRegistry::READ && ! is_string($requestState)) {
            $call = $this->newCall($token, $user, $requestId, $tool, (string) $definition['risk'], $arguments, 'approval_required');

            return $this->stamp($this->approval->inputRequired($call, $token, $user, $tool, (string) $definition['risk'], $arguments));
        }

        if (is_string($requestState)) {
            $verified = $this->approval->verifyRetry($token, $user, $tool, $arguments, $requestState, $inputResponses);
            /** @var AcademyMcpCall $call */
            $call = $verified['call'];
            if ($verified['declined']) {
                return $this->toolError($call, 'User declined or cancelled the Academy action.');
            }
            if ($call->status === 'failed') {
                return $this->toolError($call, $call->error_message ?: 'This Academy MCP call previously failed.');
            }
            if ($call->status === 'succeeded' && is_array($call->result)) {
                return $this->toolSuccess($call, $call->result, replayed: true);
            }
            if ($call->status === 'running') {
                return $this->toolError($call, 'This Academy MCP call is already executing.');
            }

            $claimed = $this->claimApprovedCall($call);
            if ($claimed === null) {
                $fresh = $call->fresh();
                if ($fresh->status === 'succeeded' && is_array($fresh->result)) {
                    return $this->toolSuccess($fresh, $fresh->result, replayed: true);
                }
                if ($fresh->status === 'failed') {
                    return $this->toolError($fresh, $fresh->error_message ?: 'This Academy MCP call previously failed.');
                }

                return $this->toolError($fresh, 'This Academy MCP call is already executing or no longer executable.');
            }
            $call = $claimed;
        } else {
            $call = $this->newCall($token, $user, $requestId, $tool, (string) $definition['risk'], $arguments, 'running');
        }

        try {
            $result = $this->executor->execute($user, $tool, $arguments, $call->receipt_id);
            $call->update(['status' => 'succeeded', 'result' => $result, 'executed_at' => now()]);

            return $this->toolSuccess($call->fresh(), $result);
        } catch (Throwable $error) {
            $call->update([
                'status' => 'failed',
                'error_message' => mb_substr($error->getMessage(), 0, 4000),
                'executed_at' => now(),
            ]);

            return $this->toolError($call->fresh(), $error->getMessage());
        }
    }

    private function claimApprovedCall(AcademyMcpCall $call): ?AcademyMcpCall
    {
        $claimed = AcademyMcpCall::query()
            ->whereKey($call->id)
            ->where('status', 'approved')
            ->update(['status' => 'running']);

        return $claimed === 1 ? $call->fresh() : null;
    }

    /** @param array<string, mixed> $arguments */
    private function newCall(AcademyMcpToken $token, User $user, string|int|null $requestId, string $tool, string $risk, array $arguments, string $status): AcademyMcpCall
    {
        return AcademyMcpCall::create([
            'receipt_id' => (string) Str::uuid(),
            'academy_mcp_token_id' => $token->id,
            'user_id' => $user->id,
            'request_id' => $requestId !== null ? mb_substr((string) $requestId, 0, 190) : null,
            'tool' => $tool,
            'risk' => $risk,
            'arguments' => $arguments,
            'status' => $status,
        ]);
    }

    /** @param array<string, mixed> $result @return array<string, mixed> */
    private function toolSuccess(AcademyMcpCall $call, array $result, bool $replayed = false): array
    {
        $structured = [
            'data' => $result,
            'receipt' => $this->receipt($call, $replayed),
        ];

        return $this->stamp([
            'resultType' => 'complete',
            'content' => [['type' => 'text', 'text' => json_encode($structured, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]],
            'structuredContent' => $structured,
            'isError' => false,
        ]);
    }

    /** @return array<string, mixed> */
    private function toolError(AcademyMcpCall $call, string $message): array
    {
        $structured = ['error' => mb_substr($message, 0, 4000), 'receipt' => $this->receipt($call, false)];

        return $this->stamp([
            'resultType' => 'complete',
            'content' => [['type' => 'text', 'text' => $structured['error']]],
            'structuredContent' => $structured,
            'isError' => true,
        ]);
    }

    /** @return array<string, mixed> */
    private function receipt(AcademyMcpCall $call, bool $replayed): array
    {
        return [
            'id' => $call->receipt_id,
            'tool' => $call->tool,
            'risk' => $call->risk,
            'status' => $call->status,
            'approvedAt' => $call->approved_at?->toIso8601String(),
            'executedAt' => $call->executed_at?->toIso8601String(),
            'replayed' => $replayed,
        ];
    }

    /** @param array<string, mixed> $result @return array<string, mixed> */
    private function stamp(array $result): array
    {
        $result['_meta'] = array_merge((array) ($result['_meta'] ?? []), [
            'io.modelcontextprotocol/serverInfo' => [
                'name' => 'num-academy-os',
                'version' => (string) config('academy.version', '0.10.0'),
            ],
        ]);

        return $result;
    }
}
