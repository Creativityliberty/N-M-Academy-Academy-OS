<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\AcademyMcpToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAcademyMcpToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $plain = $request->bearerToken();
        if (! is_string($plain) || $plain === '') {
            return response()->json(['error' => 'MCP bearer token required.'], 401);
        }

        $token = AcademyMcpToken::query()
            ->with('user.roles')
            ->where('token_hash', hash('sha256', $plain))
            ->first();

        if (! $token || ! $token->isActive() || ! $token->user?->hasAnyRole(['trainer', 'admin', 'super-admin'])) {
            return response()->json(['error' => 'Invalid or revoked MCP token.'], 401);
        }

        if ($token->user->email_verified_at === null) {
            return response()->json(['error' => 'MCP user email must be verified.'], 403);
        }

        $token->forceFill(['last_used_at' => now()])->save();
        $request->attributes->set('academy_mcp_token', $token);
        $request->setUserResolver(fn () => $token->user);

        return $next($request);
    }
}
