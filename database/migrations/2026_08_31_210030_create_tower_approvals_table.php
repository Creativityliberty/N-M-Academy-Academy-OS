<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tower_approvals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('mission_id')->constrained('tower_missions')->cascadeOnDelete();
            $table->foreignId('step_id')->constrained('tower_mission_steps')->cascadeOnDelete();
            $table->foreignId('run_id')->constrained('tower_runs')->cascadeOnDelete();
            $table->foreignId('requested_for_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('decided_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tool', 190);
            $table->string('risk', 24);
            $table->string('status', 24)->default('pending')->index();
            $table->text('message');
            $table->text('request_state');
            $table->string('required_phrase', 255)->nullable();
            $table->json('requested_schema')->nullable();
            $table->json('arguments')->nullable();
            $table->string('receipt_id', 64)->nullable()->index();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->unique(['run_id', 'step_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_approvals');
    }
};
