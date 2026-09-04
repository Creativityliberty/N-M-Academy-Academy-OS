<?php

declare(strict_types=1);

namespace App\Http\Controllers\Mcp;

use App\Http\Controllers\Controller;
use App\Mcp\AcademyMcpGateway;
use App\Models\AcademyMcpToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Throwable;

class McpGatewayController extends Controller
{
    public function __construct(private readonly AcademyMcpGateway $gateway) {}

    public function __invoke(Request $request): JsonResponse
    {
        if (strlen($request->getContent()) > (int) config('academy.mcp.max_body_bytes', 1048576)) {
            return $this->protocolError(null, -32002, 'MCP request body is too large.', 413);
        }

        if (($origin = $request->headers->get('Origin')) !== null && ! $this->originAllowed($origin)) {
            return $this->protocolError(null, -32001, 'Origin is not allowed.', 403);
        }

        $payload = $request->json()->all();
        if (($payload['jsonrpc'] ?? null) !== '2.0' || ! array_key_exists('id', $payload) || ! is_string($payload['method'] ?? null)) {
            return $this->protocolError($payload['id'] ?? null, -32600, 'Invalid JSON-RPC request.', 400);
        }

        $id = $payload['id'];
        $method = (string) $payload['method'];
        $params = is_array($payload['params'] ?? null) ? $payload['params'] : [];

        if (($error = $this->validateModernHeaders($request, $method, $params)) !== null) {
            return $this->protocolError($id, -32020, $error, 400);
        }

        /** @var AcademyMcpToken $token */
        $token = $request->attributes->get('academy_mcp_token');
        $user = $request->user();

        try {
            $result = $this->gateway->dispatch($token, $user, $method, $params, is_string($id) || is_int($id) ? $id : null);
        } catch (InvalidArgumentException $error) {
            $code = str_starts_with($error->getMessage(), 'Unsupported MCP method') ? -32601 : -32602;

            return $this->protocolError($id, $code, $error->getMessage(), 400);
        } catch (Throwable $error) {
            report($error);

            return $this->protocolError($id, -32603, 'Internal MCP gateway error.', 500);
        }

        return response()->json(['jsonrpc' => '2.0', 'id' => $id, 'result' => $result]);
    }

    /** @param array<string, mixed> $params */
    private function validateModernHeaders(Request $request, string $method, array $params): ?string
    {
        if ($request->headers->get('MCP-Protocol-Version') !== AcademyMcpGateway::PROTOCOL) {
            return 'MCP-Protocol-Version must be 2026-07-28.';
        }
        if ($request->headers->get('Mcp-Method') !== $method) {
            return 'Mcp-Method header does not match the JSON-RPC method.';
        }
        if ($method === 'tools/call' && $request->headers->get('Mcp-Name') !== ($params['name'] ?? null)) {
            return 'Mcp-Name header does not match params.name.';
        }
        $meta = is_array($params['_meta'] ?? null) ? $params['_meta'] : [];
        if (isset($meta['io.modelcontextprotocol/protocolVersion']) && $meta['io.modelcontextprotocol/protocolVersion'] !== AcademyMcpGateway::PROTOCOL) {
            return 'Request _meta protocol version does not match the MCP-Protocol-Version header.';
        }

        return null;
    }

    private function originAllowed(string $origin): bool
    {
        $allowed = array_values(array_filter((array) config('academy.mcp.allowed_origins', [])));

        return in_array('*', $allowed, true) || in_array($origin, $allowed, true);
    }

    private function protocolError(mixed $id, int $code, string $message, int $status): JsonResponse
    {
        return response()->json([
            'jsonrpc' => '2.0',
            'id' => $id,
            'error' => ['code' => $code, 'message' => $message],
        ], $status);
    }
}
