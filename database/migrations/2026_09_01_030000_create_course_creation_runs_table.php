<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_creation_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academy_ai_run_id')->nullable()->constrained('academy_ai_runs')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('page_id')->nullable()->constrained('academy_pages')->nullOnDelete();
            $table->foreignId('offer_id')->nullable()->constrained('course_offers')->nullOnDelete();
            $table->text('brief');
            $table->json('options')->nullable();
            $table->json('state')->nullable();
            $table->string('status', 24)->default('pending'); // pending|running|completed|failed
            $table->string('current_step', 32)->default('blueprint');
            $table->string('step_status', 24)->default('pending'); // pending|running|done|skipped
            $table->unsignedSmallInteger('progress_percent')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('step_started_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_creation_runs');
    }
};
