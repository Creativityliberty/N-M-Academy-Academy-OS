<?php

use App\Http\Controllers\MissionTower\OverviewController;
use App\MissionTower\Http\Controllers\ApprovalController;
use App\MissionTower\Http\Controllers\EvidenceController;
use App\MissionTower\Http\Controllers\MissionController;
use App\MissionTower\Http\Controllers\MemoryController;
use App\MissionTower\Http\Controllers\InsightsController;
use App\MissionTower\Http\Controllers\MissionCompilerController;
use App\MissionTower\Http\Controllers\RunController;
use App\MissionTower\Http\Controllers\TowerChatController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:trainer|admin|super-admin', 'feature:tower'])
    ->prefix('tower')
    ->name('tower.')
    ->group(function () {
        Route::get('/', [OverviewController::class, 'index'])->name('overview');

        Route::get('/chat', [TowerChatController::class, 'index'])->name('chat.index');
        Route::post('/chat/messages', [TowerChatController::class, 'sendNew'])->name('chat.message');
        Route::get('/chat/{thread}', [TowerChatController::class, 'show'])->name('chat.show');
        Route::post('/chat/{thread}/messages', [TowerChatController::class, 'send'])->name('chat.thread.message');
        Route::post('/chat/{thread}/approvals/{approval}/decision', [TowerChatController::class, 'decide'])->name('chat.approval');

        Route::get('/memory', [MemoryController::class, 'index'])->name('memory.index');
        Route::post('/memory/{memory}/pin', [MemoryController::class, 'pin'])->name('memory.pin');
        Route::post('/memory/{memory}/forget', [MemoryController::class, 'forget'])->name('memory.forget');

        Route::get('/compiler', [MissionCompilerController::class, 'index'])->name('compiler.index');
        Route::post('/compiler', [MissionCompilerController::class, 'compile'])->name('compiler.compile');
        Route::get('/compiler/{compilation}', [MissionCompilerController::class, 'show'])->name('compiler.show');
        Route::post('/compiler/{compilation}/apply', [MissionCompilerController::class, 'apply'])->name('compiler.apply');

        Route::get('/missions', [MissionController::class, 'index'])->name('missions.index');
        Route::post('/missions', [MissionController::class, 'store'])->name('missions.store');
        Route::get('/missions/{mission}', [MissionController::class, 'show'])->name('missions.show');
        Route::post('/missions/{mission}/run', [MissionController::class, 'run'])->name('missions.run');

        Route::get('/approvals', [ApprovalController::class, 'index'])->name('approvals.index');
        Route::post('/approvals/{approval}/decision', [ApprovalController::class, 'decide'])->name('approvals.decide');

        Route::get('/runs', [RunController::class, 'index'])->name('runs.index');
        Route::get('/evidence', [EvidenceController::class, 'index'])->name('evidence.index');

        Route::get('/insights', [InsightsController::class, 'index'])->name('insights.index');
        Route::post('/insights/observe', [InsightsController::class, 'observe'])->name('insights.observe');
        Route::post('/insights/{insight}/mission', [InsightsController::class, 'mission'])->name('insights.mission');
    });
