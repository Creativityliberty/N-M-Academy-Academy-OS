<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        foreach (['success', 'error', 'warning', 'info'] as $type) {
            if ($message = session($type)) {
                Inertia::flash('toast', ['type' => $type, 'message' => $message]);
            }
        }

        return [
            ...parent::share($request),
            'name' => config('academy.name'),
            'academy' => [
                'name' => config('academy.name'),
                'shortName' => config('academy.short_name'),
                'descriptor' => config('academy.descriptor'),
                'logoUrl' => config('academy.logo_url'),
                'features' => config('academy.features'),
                'factoryEnabled' => (bool) config('factory.enabled'),
                'theme' => [
                    'preset' => config('academy.theme.preset'),
                    'primary' => config('academy.theme.primary'),
                    'primaryHover' => config('academy.theme.primary_hover'),
                    'primarySoft' => config('academy.theme.primary_soft'),
                    'primarySurface' => config('academy.theme.primary_surface'),
                    'secondary' => config('academy.theme.secondary'),
                    'accent' => config('academy.theme.accent'),
                    'radius' => config('academy.theme.radius'),
                    'density' => config('academy.theme.density'),
                ],
            ],
            'auth' => [
                'user' => $request->user() ? array_merge(
                    $request->user()->toArray(),
                    [
                        'is_admin' => $request->user()->isAdmin(),
                        'is_trainer' => $request->user()->isTrainer(),
                        'is_student' => $request->user()->isStudent(),
                    ],
                ) : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
