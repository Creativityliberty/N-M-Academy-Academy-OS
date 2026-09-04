<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tower_insights', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('snapshot_id')->nullable()->constrained('tower_observatory_snapshots')->nullOnDelete();
            $table->string('fingerprint', 160);
            $table->string('rule', 80);
            $table->string('domain', 40);
            $table->string('severity', 16);
            $table->string('status', 24)->default('open');
            $table->string('title', 220);
            $table->text('summary');
            $table->string('metric_key', 120)->nullable();
            $table->decimal('current_value', 18, 4)->nullable();
            $table->decimal('baseline_value', 18, 4)->nullable();
            $table->decimal('delta_percent', 10, 2)->nullable();
            $table->json('context')->nullable();
            $table->json('mission_blueprint')->nullable();
            $table->foreignId('mission_id')->nullable()->constrained('tower_missions')->nullOnDelete();
            $table->timestamp('first_seen_at');
            $table->timestamp('last_seen_at');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->unique(['owner_id', 'fingerprint']);
            $table->index(['owner_id', 'status', 'severity']);
            $table->index(['owner_id', 'domain', 'last_seen_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_insights');
    }
};
