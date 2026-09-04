<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Models\AcademyMcpCall;
use App\Models\AcademyMcpToken;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use RuntimeException;

class AcademyMcpApprovalService
{
    /** @param array<string, mixed> $arguments @return array<string, mixed> */
    public function inputRequired(AcademyMcpCall $call, AcademyMcpToken $token, User $user, string $tool, string $risk, array $arguments): array
    {
        $sensitive = $risk === AcademyMcpToolRegistry::SENSITIVE;
        $phrase = $sensitive ? $this->sensitivePhrase($tool, $arguments) : null;
        $state = Crypt::encryptString(json_encode([
            'call_id' => $call->id,
            'token_id' => $token->id,
            'user_id' => $user->id,
            'tool' => $tool,
            'risk' => $risk,
            'arguments_hash' => $this->argumentsHash($arguments),
            'phrase' => $phrase,
            'expires_at' => now()->addMinutes(15)->timestamp,
        ], JSON_THROW_ON_ERROR));

        $schema = $sensitive
            ? [
                'type' => 'object',
                'properties' => ['phrase' => ['type' => 'string', 'const' => $phrase]],
                'required' => ['phrase'],
                'additionalProperties' => false,
            ]
            : [
                'type' => 'object',
                'properties' => ['confirm' => ['type' => 'boolean', 'const' => true]],
                'required' => ['confirm'],
                'additionalProperties' => false,
            ];

        return [
            'resultType' => 'input_required',
            'inputRequests' => [
                'approval' => [
                    'method' => 'elicitation/create',
                    'params' => [
                        'mode' => 'form',
                        'message' => $sensitive
                            ? "Sensitive Academy action. Type exactly: {$phrase}"
                            : "Approve Academy action '{$tool}'?",
                        'requestedSchema' => $schema,
                    ],
                ],
            ],
            'requestState' => $state,
            '_meta' => ['com.numtema.academy/receiptId' => $call->receipt_id],
        ];
    }

    /**
     * @param array<string, mixed> $arguments
     * @param array<string, mixed> $inputResponses
     * @return array{call: AcademyMcpCall, approved: bool, declined: bool}
     */
    public function verifyRetry(
        AcademyMcpToken $token,
        User $user,
        string $tool,
        array $arguments,
        string $requestState,
        array $inputResponses,
    ): array {
        try {
            $state = json_decode(Crypt::decryptString($requestState), true, flags: JSON_THROW_ON_ERROR);
        } catch (\Throwable) {
            throw new RuntimeException('Invalid or tampered MCP requestState.');
        }

        if (! is_array($state)
            || ($state['token_id'] ?? null) !== $token->id
            || ($state['user_id'] ?? null) !== $user->id
            || ($state['tool'] ?? null) !== $tool
            || ($state['arguments_hash'] ?? null) !== $this->argumentsHash($arguments)
            || (int) ($state['expires_at'] ?? 0) < now()->timestamp) {
            throw new RuntimeException('MCP approval state is invalid or expired.');
        }

        $call = AcademyMcpCall::query()->find((int) ($state['call_id'] ?? 0));
        if (! $call || $call->academy_mcp_token_id !== $token->id || $call->user_id !== $user->id || $call->tool !== $tool) {
            throw new RuntimeException('MCP approval call cannot be resolved.');
        }

        if (in_array($call->status, ['approved', 'running', 'succeeded', 'failed', 'rejected'], true)) {
            return [
                'call' => $call,
                'approved' => in_array($call->status, ['approved', 'running', 'succeeded'], true),
                'declined' => $call->status === 'rejected',
            ];
        }

        $response = $inputResponses['approval'] ?? null;
        if (! is_array($response) || ($response['action'] ?? null) !== 'accept') {
            $fresh = $this->transitionApprovalRequired($call, 'rejected', ['executed_at' => now()]);

            return [
                'call' => $fresh,
                'approved' => in_array($fresh->status, ['approved', 'running', 'succeeded'], true),
                'declined' => $fresh->status === 'rejected',
            ];
        }

        $content = is_array($response['content'] ?? null) ? $response['content'] : [];
        $risk = (string) ($state['risk'] ?? '');
        $approved = $risk === AcademyMcpToolRegistry::SENSITIVE
            ? hash_equals((string) ($state['phrase'] ?? ''), (string) ($content['phrase'] ?? ''))
            : ($content['confirm'] ?? false) === true;

        if (! $approved) {
            $fresh = $this->transitionApprovalRequired($call, 'rejected', ['executed_at' => now()]);

            return [
                'call' => $fresh,
                'approved' => in_array($fresh->status, ['approved', 'running', 'succeeded'], true),
                'declined' => $fresh->status === 'rejected',
            ];
        }

        $fresh = $this->transitionApprovalRequired($call, 'approved', ['approved_at' => now()]);

        return [
            'call' => $fresh,
            'approved' => in_array($fresh->status, ['approved', 'running', 'succeeded'], true),
            'declined' => $fresh->status === 'rejected',
        ];
    }

    /** @param array<string, mixed> $attributes */
    private function transitionApprovalRequired(AcademyMcpCall $call, string $status, array $attributes = []): AcademyMcpCall
    {
        AcademyMcpCall::query()
            ->whereKey($call->id)
            ->where('status', 'approval_required')
            ->update(array_merge(['status' => $status], $attributes));

        return $call->fresh();
    }

    /** @param array<string, mixed> $arguments */
    private function sensitivePhrase(string $tool, array $arguments): string
    {
        return match ($tool) {
            'courses.publish' => 'PUBLISH COURSE '.(int) ($arguments['course_id'] ?? 0),
            'sales.refund' => 'REFUND ORDER '.(int) ($arguments['order_id'] ?? 0).' AMOUNT '.(int) ($arguments['amount'] ?? 0),
            default => 'APPROVE '.strtoupper(str_replace('.', ' ', $tool)),
        };
    }

    /** @param array<string, mixed> $arguments */
    private function argumentsHash(array $arguments): string
    {
        $canonical = $this->canonicalize($arguments);

        return hash('sha256', json_encode($canonical, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    private function canonicalize(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }
        if (array_is_list($value)) {
            return array_map(fn ($item) => $this->canonicalize($item), $value);
        }
        ksort($value);
        foreach ($value as $key => $item) {
            $value[$key] = $this->canonicalize($item);
        }

        return $value;
    }
}
