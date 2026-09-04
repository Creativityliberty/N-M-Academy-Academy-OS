<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\EnsureAcademyFeatureEnabled;
use App\Http\Middleware\CaptureAffiliateReferral;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Stripe\Exception\ApiErrorException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Trust Caddy reverse proxy headers (X-Forwarded-Proto, X-Forwarded-For)
        $middleware->trustProxies(at: '*');

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->preventRequestForgery(except: [
            'stripe/*',
            'mcp',
        ]);

        $middleware->web(append: [
            CaptureAffiliateReferral::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'feature' => EnsureAcademyFeatureEnabled::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->is('mcp'),
        );

        $exceptions->renderable(function (Throwable $e, Request $request) {
            if (
                $request->is('api/*')
                || $request->is('mcp')
                || ! $request->hasSession()
                || $e instanceof HttpResponseException
                || $e instanceof ValidationException
                || $e instanceof AuthenticationException
                || $e instanceof HttpException
            ) {
                return null;
            }

            $message = $e instanceof ApiErrorException
                ? 'Une erreur de paiement est survenue. Veuillez réessayer ou contacter le support.'
                : 'Une erreur inattendue est survenue. Veuillez réessayer.';

            return back()->withInput()->with('error', $message);
        });
    })->create();
