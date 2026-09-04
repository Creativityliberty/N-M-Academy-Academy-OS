<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector');
        }

        Schema::create('academy_knowledge_documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->nullable()->constrained('modules')->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->string('source_type', 40);
            $table->string('source_ref')->nullable();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->char('checksum', 64);
            $table->string('visibility', 24)->default('enrolled');
            $table->string('index_status', 24)->default('pending');
            $table->text('index_error')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('indexed_at')->nullable();
            $table->timestamps();
            $table->index(['course_id', 'source_type']);
            $table->unique(['source_type', 'source_ref'], 'academy_knowledge_source_unique');
        });

        Schema::create('academy_knowledge_chunks', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('document_id')->constrained('academy_knowledge_documents')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->unsignedInteger('chunk_index');
            $table->text('content');
            $table->unsignedInteger('token_count')->default(0);
            if (DB::connection()->getDriverName() !== 'pgsql') {
                $table->text('embedding')->nullable();
            }
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->unique(['document_id', 'chunk_index']);
            $table->index(['course_id', 'lesson_id']);
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE academy_knowledge_chunks ADD COLUMN embedding vector(1536)');
            DB::statement('CREATE INDEX academy_knowledge_chunks_embedding_hnsw ON academy_knowledge_chunks USING hnsw (embedding vector_cosine_ops)');
        }

        Schema::create('academy_tutor_settings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete()->unique();
            $table->boolean('enabled')->default(true);
            $table->string('provider', 24)->default('inherit');
            $table->string('model')->nullable();
            $table->string('premium_model')->nullable();
            $table->string('personality', 24)->default('helpful');
            $table->string('outside_content_policy', 24)->default('never');
            $table->unsignedInteger('daily_limit')->default(20);
            $table->unsignedInteger('monthly_budget_cents')->default(0);
            $table->json('allowed_course_ids')->nullable();
            $table->timestamps();
        });

        Schema::create('academy_tutor_threads', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->string('title')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'course_id']);
        });

        Schema::create('academy_tutor_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('thread_id')->constrained('academy_tutor_threads')->cascadeOnDelete();
            $table->string('role', 16);
            $table->longText('content');
            $table->json('sources')->nullable();
            $table->string('provider', 32)->nullable();
            $table->string('model')->nullable();
            $table->string('premium_model')->nullable();
            $table->unsignedInteger('input_tokens')->default(0);
            $table->unsignedInteger('output_tokens')->default(0);
            $table->timestamps();
        });

        Schema::create('academy_tutor_runs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('thread_id')->nullable()->constrained('academy_tutor_threads')->nullOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->string('capability', 40);
            $table->string('provider', 32)->nullable();
            $table->string('model')->nullable();
            $table->string('premium_model')->nullable();
            $table->longText('question');
            $table->json('retrieved_chunk_ids')->nullable();
            $table->string('status', 24)->default('pending');
            $table->unsignedInteger('input_tokens')->default(0);
            $table->unsignedInteger('output_tokens')->default(0);
            $table->unsignedInteger('estimated_cost_cents')->default(0);
            $table->unsignedInteger('latency_ms')->default(0);
            $table->text('error')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
        });

        Schema::create('tutor_quiz_sessions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->string('title');
            $table->json('questions');
            $table->unsignedInteger('score')->nullable();
            $table->unsignedInteger('max_score')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('tutor_quiz_answers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('session_id')->constrained('tutor_quiz_sessions')->cascadeOnDelete();
            $table->unsignedInteger('question_index');
            $table->text('answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
            $table->unique(['session_id', 'question_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutor_quiz_answers');
        Schema::dropIfExists('tutor_quiz_sessions');
        Schema::dropIfExists('academy_tutor_runs');
        Schema::dropIfExists('academy_tutor_messages');
        Schema::dropIfExists('academy_tutor_threads');
        Schema::dropIfExists('academy_tutor_settings');
        Schema::dropIfExists('academy_knowledge_chunks');
        Schema::dropIfExists('academy_knowledge_documents');
    }
};
