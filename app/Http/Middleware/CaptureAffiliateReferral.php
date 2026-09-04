<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CaptureAffiliateReferral
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $ref = trim((string) $request->query('ref', ''));
        if ($ref !== '' && preg_match('/^[a-zA-Z0-9_-]{2,64}$/', $ref)) {
            $response->headers->setCookie(cookie('academy_ref', strtolower($ref), 60 * 24 * 30, '/', null, true, true, false, 'lax'));
        }
        return $response;
    }
}
