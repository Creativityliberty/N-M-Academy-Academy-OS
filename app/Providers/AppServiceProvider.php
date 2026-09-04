<?php

namespace App\Providers;

use App\Http\Responses\LoginResponse;
use App\MissionTower\Bridge\AcademyMcpHttpGateway;
use App\MissionTower\Contracts\AcademyGateway;
use App\Http\Responses\RegisterResponse;
use App\Repositories\Admin\Courses\CourseRepository as AdminCourseRepository;
use App\Repositories\Admin\Courses\EloquentCourseRepository as AdminEloquentCourseRepository;
use App\Repositories\Admin\Plans\EloquentPlanRepository;
use App\Repositories\Admin\Plans\PlanRepository;
use App\Repositories\Public\Categories\CategoryRepository;
use App\Repositories\Public\Categories\EloquentCategoryRepository;
use App\Repositories\Public\Courses\CourseRepository;
use App\Repositories\Public\Courses\EloquentCourseRepository;
use App\Repositories\Trainer\Courses\CourseRepository as TrainerCourseRepository;
use App\Repositories\Trainer\Courses\EloquentCourseRepository as TrainerEloquentCourseRepository;
use Carbon\CarbonImmutable;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use ImageKit\ImageKit;
use Inertia\ExceptionResponse;
use Inertia\Inertia;
use Laravel\Cashier\Cashier;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use League\Flysystem\Filesystem;
use TaffoVelikoff\ImageKitAdapter\ImagekitAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Cashier::ignoreRoutes();

        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
        $this->app->singleton(RegisterResponseContract::class, RegisterResponse::class);

        $this->app->bind(CourseRepository::class, EloquentCourseRepository::class);
        $this->app->bind(PlanRepository::class, EloquentPlanRepository::class);
        $this->app->bind(CategoryRepository::class, EloquentCategoryRepository::class);
        $this->app->bind(AdminCourseRepository::class, AdminEloquentCourseRepository::class);
        $this->app->bind(TrainerCourseRepository::class, TrainerEloquentCourseRepository::class);
        $this->app->bind(AcademyGateway::class, AcademyMcpHttpGateway::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureStorage();
        $this->configureErrorHandling();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureStorage(): void
    {
        Storage::extend('imagekit', function ($app, $config) {
            $adapter = new ImagekitAdapter(
                new ImageKit(
                    $config['public_key'],
                    $config['private_key'],
                    $config['endpoint_url'],
                ),
            );

            return new FilesystemAdapter(
                new Filesystem($adapter, $config),
                $adapter,
                $config,
            );
        });
    }

    protected function configureErrorHandling(): void
    {
        if (! app()->isProduction()) {
            return;
        }

        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            if (in_array($response->statusCode(), [403, 404, 500, 503])) {
                return $response->render('error-page', [
                    'status' => $response->statusCode(),
                ])->withSharedData();
            }
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null,
        );
    }
}
