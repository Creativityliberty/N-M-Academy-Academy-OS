<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_assessments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->nullable()->constrained('modules')->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('kind', 32)->default('quiz');
            $table->unsignedTinyInteger('passing_score_percent')->default(70);
            $table->unsignedSmallInteger('max_attempts')->nullable();
            $table->boolean('shuffle_questions')->default(false);
            $table->boolean('shuffle_options')->default(false);
            $table->boolean('show_explanations')->default(true);
            $table->boolean('is_enabled')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index(['course_id', 'is_enabled', 'position']);
            $table->index(['module_id', 'position']);
            $table->index(['lesson_id', 'position']);
        });

        Schema::create('course_assessment_questions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('assessment_id')->constrained('course_assessments')->cascadeOnDelete();
            $table->string('type', 40);
            $table->text('prompt');
            $table->text('explanation')->nullable();
            $table->unsignedSmallInteger('points')->default(1);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index(['assessment_id', 'position']);
        });

        Schema::create('course_assessment_options', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('question_id')->constrained('course_assessment_questions')->cascadeOnDelete();
            $table->text('text');
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index(['question_id', 'position']);
        });

        Schema::create('course_assessment_attempts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('assessment_id')->constrained('course_assessments')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('attempt_number');
            $table->unsignedInteger('score_points')->default(0);
            $table->unsignedInteger('max_points')->default(0);
            $table->decimal('score_percent', 5, 2)->default(0);
            $table->boolean('passed')->default(false);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->unique(['assessment_id', 'user_id', 'attempt_number'], 'assessment_user_attempt_unique');
            $table->index(['assessment_id', 'user_id', 'completed_at']);
        });

        Schema::create('course_assessment_answers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('attempt_id')->constrained('course_assessment_attempts')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('course_assessment_questions')->cascadeOnDelete();
            $table->json('selected_option_ids');
            $table->boolean('is_correct');
            $table->unsignedInteger('awarded_points')->default(0);
            $table->text('feedback')->nullable();
            $table->timestamps();
            $table->unique(['attempt_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_assessment_answers');
        Schema::dropIfExists('course_assessment_attempts');
        Schema::dropIfExists('course_assessment_options');
        Schema::dropIfExists('course_assessment_questions');
        Schema::dropIfExists('course_assessments');
    }
};
