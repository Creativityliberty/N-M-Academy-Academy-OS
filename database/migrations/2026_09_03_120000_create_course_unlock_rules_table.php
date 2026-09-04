<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_unlock_rules', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('target_type', 32);
            $table->unsignedBigInteger('target_id');
            $table->string('rule_type', 48);
            $table->string('source_type', 32)->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedSmallInteger('delay_days')->nullable();
            $table->timestampTz('available_at')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index(['course_id', 'target_type', 'target_id', 'is_enabled'], 'course_unlock_target_idx');
            $table->index(['course_id', 'source_type', 'source_id'], 'course_unlock_source_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_unlock_rules');
    }
};
