<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tower_evidence', function (Blueprint $table): void {
            $table->id();
            $table->uuid('evidence_uuid')->unique();
            $table->foreignId('mission_id')->constrained('tower_missions')->cascadeOnDelete();
            $table->foreignId('run_id')->nullable()->constrained('tower_runs')->cascadeOnDelete();
            $table->foreignId('step_id')->nullable()->constrained('tower_mission_steps')->cascadeOnDelete();
            $table->string('type', 32)->default('tool_receipt')->index();
            $table->string('status', 24)->default('recorded')->index();
            $table->string('source', 64)->default('academy_mcp');
            $table->string('receipt_id', 64)->nullable()->index();
            $table->text('summary')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->index(['mission_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_evidence');
    }
};
