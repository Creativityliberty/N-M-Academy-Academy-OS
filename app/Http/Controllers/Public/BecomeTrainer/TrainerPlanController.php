<?php

namespace App\Http\Controllers\Public\BecomeTrainer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PlanResource;
use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class TrainerPlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home/become-trainer/index', [
            'plans' => PlanResource::collection(
                Plan::query()->where('is_active', true)->orderBy('order')->get()
            )->resolve(),
        ]);
    }
}
