<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('tower_compilations')) {
            return;
        }

        Schema::create('tower_compilations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mission_id')->nullable()->constrained('tower_missions')->nullOnDelete();
            $table->string('status', 32)->default('compiling')->index();
            $table->string('provider', 40)->nullable();
            $table->string('model', 160)->nullable();
            $table->text('prompt');
            $table->json('proposal')->nullable();
            $table->json('warnings')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();

            $table->index(['owner_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_compilations');
    }
};
