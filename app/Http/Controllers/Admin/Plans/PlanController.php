<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Plans;

use App\Actions\Admin\Plans\CreatePlanAction;
use App\Actions\Admin\Plans\DeletePlanAction;
use App\Actions\Admin\Plans\UpdatePlanAction;
use App\Enums\PlanCurrencyEnum;
use App\Enums\PlanIntervalEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Plans\StorePlanRequest;
use App\Http\Requests\Admin\Plans\UpdatePlanRequest;
use App\Http\Resources\Admin\PlanResource;
use App\Models\Plan;
use App\Repositories\Admin\Plans\PlanRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function __construct(
        private readonly PlanRepository $repository,
        private readonly CreatePlanAction $createAction,
        private readonly UpdatePlanAction $updateAction,
        private readonly DeletePlanAction $deleteAction,
    ) {}

    #[Authorize('viewAny', Plan::class)]
    public function index(): Response
    {
        return Inertia::render('admin/plans/index', [
            'plans' => $this->repository->paginate(15)->through(
                fn (Plan $plan) => PlanResource::make($plan)->resolve(),
            ),
        ]);
    }

    #[Authorize('create', Plan::class)]
    public function create(): Response
    {
        return Inertia::render('admin/plans/create', [
            'currencies' => array_map(fn (PlanCurrencyEnum $c) => ['value' => $c->value, 'label' => $c->label()], PlanCurrencyEnum::cases()),
            'intervals' => array_map(fn (PlanIntervalEnum $i) => ['value' => $i->value, 'label' => $i->label()], PlanIntervalEnum::cases()),
        ]);
    }

    #[Authorize('create', Plan::class)]
    public function store(StorePlanRequest $request): RedirectResponse
    {
        $this->createAction->handle($request->validated());

        return redirect()->route('admin.plans.index')->with('success', 'Plan créé et synchronisé avec Stripe.');
    }

    #[Authorize('update', 'plan')]
    public function edit(Plan $plan): Response
    {
        return Inertia::render('admin/plans/edit', [
            'plan' => PlanResource::make($plan)->resolve(),
            'currencies' => array_map(fn (PlanCurrencyEnum $c) => ['value' => $c->value, 'label' => $c->label()], PlanCurrencyEnum::cases()),
            'intervals' => array_map(fn (PlanIntervalEnum $i) => ['value' => $i->value, 'label' => $i->label()], PlanIntervalEnum::cases()),
        ]);
    }

    #[Authorize('update', 'plan')]
    public function update(UpdatePlanRequest $request, Plan $plan): RedirectResponse
    {
        $this->updateAction->handle($plan, $request->validated());

        return redirect()->route('admin.plans.index')->with('success', 'Plan mis à jour et synchronisé avec Stripe.');
    }

    #[Authorize('delete', 'plan')]
    public function destroy(Plan $plan): RedirectResponse
    {
        $this->deleteAction->handle($plan);

        return redirect()->route('admin.plans.index')->with('success', 'Plan supprimé et archivé sur Stripe.');
    }
}
