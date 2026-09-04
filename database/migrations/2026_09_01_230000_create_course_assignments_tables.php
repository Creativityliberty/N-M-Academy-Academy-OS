<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_assignments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->nullable()->constrained('modules')->restrictOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->restrictOnDelete();
            $table->string('title');
            $table->text('instructions');
            $table->string('kind', 32)->default('assignment');
            $table->string('deliverable_type', 32)->default('mixed');
            $table->boolean('is_enabled')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index(['course_id', 'is_enabled', 'position']);
            $table->index(['module_id', 'position']);
            $table->index(['lesson_id', 'position']);
        });

        Schema::create('course_assignment_rubric_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('assignment_id')->constrained('course_assignments')->cascadeOnDelete();
            $table->string('criterion');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('max_points')->default(1);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index(['assignment_id', 'position']);
        });

        Schema::create('course_assignment_submissions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('assignment_id')->constrained('course_assignments')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('version')->default(1);
            $table->string('status', 32)->default('submitted');
            $table->longText('text_content')->nullable();
            $table->text('link_url')->nullable();
            $table->json('rubric_scores')->nullable();
            $table->decimal('score_percent', 5, 2)->nullable();
            $table->text('review_feedback')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->unique(['assignment_id', 'user_id', 'version'], 'assignment_user_version_unique');
            $table->index(['assignment_id', 'user_id', 'status']);
        });

        Schema::create('course_assignment_submission_files', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')->constrained('course_assignment_submissions')->cascadeOnDelete();
            $table->string('disk')->default('assignments');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->timestamps();
            $table->index('submission_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_assignment_submission_files');
        Schema::dropIfExists('course_assignment_submissions');
        Schema::dropIfExists('course_assignment_rubric_items');
        Schema::dropIfExists('course_assignments');
    }
};
