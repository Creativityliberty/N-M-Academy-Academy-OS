<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tower_runs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('mission_id')->constrained('tower_missions')->cascadeOnDelete();
            $table->foreignId('triggered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 32)->default('queued')->index();
            $table->unsignedSmallInteger('attempt')->default(1);
            $table->text('summary')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['mission_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_runs');
    }
};
