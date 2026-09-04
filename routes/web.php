<?php

use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/public.php';
require __DIR__.'/mcp.php';
require __DIR__.'/mission-tower.php';
require __DIR__.'/admin.php';
require __DIR__.'/trainer.php';
require __DIR__.'/student.php';
require __DIR__.'/settings.php';

Route::get('/dashboard', function () {
    $user = request()->user();
    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }
    if ($user->isTrainer()) {
        return redirect()->route('trainer.dashboard');
    }

    return app(StudentDashboardController::class)->index(request());
})->middleware(['auth', 'verified'])->name('dashboard');
