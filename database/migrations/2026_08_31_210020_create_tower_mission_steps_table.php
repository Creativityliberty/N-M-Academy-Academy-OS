<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tower_mission_steps', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('mission_id')->constrained('tower_missions')->cascadeOnDelete();
            $table->unsignedInteger('position');
            $table->string('title', 180);
            $table->string('tool', 190);
            $table->string('risk', 24)->default('read');
            $table->json('arguments')->nullable();
            $table->string('status', 32)->default('pending')->index();
            $table->json('result')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['mission_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_mission_steps');
    }
};
