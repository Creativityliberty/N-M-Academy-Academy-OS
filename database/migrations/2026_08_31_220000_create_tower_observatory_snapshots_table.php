<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tower_observatory_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->uuid('snapshot_uuid')->unique();
            $table->string('status', 24)->default('completed');
            $table->json('sources');
            $table->json('metrics');
            $table->json('errors')->nullable();
            $table->timestamp('captured_at');
            $table->timestamps();
            $table->index(['owner_id', 'captured_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_observatory_snapshots');
    }
};
