<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private const LEGACY_MIGRATION = '2026_09_01_010200_create_course_review_proposals_table';

    public function up(): void
    {
        if (Schema::hasTable('course_review_proposals')) {
            return;
        }

        Schema::create('course_review_proposals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_creation_run_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('target_type', 60);
            $table->unsignedBigInteger('target_id')->nullable();
            $table->foreignId('academy_ai_run_id')->nullable()->constrained('academy_ai_runs')->nullOnDelete();
            $table->foreignId('media_generation_id')->nullable()->constrained('course_media_generations')->nullOnDelete();
            $table->text('instruction')->nullable();
            $table->json('before_payload');
            $table->json('after_payload');
            $table->string('status', 24)->default('pending');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
            $table->index(['course_creation_run_id', 'status']);
            $table->index(['course_id', 'target_type', 'target_id', 'status'], 'course_review_target_status_idx');
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('migrations') && DB::table('migrations')->where('migration', self::LEGACY_MIGRATION)->exists()) {
            return;
        }

        Schema::dropIfExists('course_review_proposals');
    }
};
