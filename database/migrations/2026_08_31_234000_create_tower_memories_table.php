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

        Schema::create('tower_memories', function (Blueprint $table): void {
            $table->id();
            $table->uuid('memory_uuid')->unique();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('thread_id')->nullable()->constrained('tower_chat_threads')->nullOnDelete();
            $table->foreignId('mission_id')->nullable()->constrained('tower_missions')->nullOnDelete();
            $table->foreignId('run_id')->nullable()->constrained('tower_runs')->nullOnDelete();
            $table->foreignId('source_message_id')->nullable()->constrained('tower_chat_messages')->nullOnDelete();
            $table->foreignId('supersedes_id')->nullable()->constrained('tower_memories')->nullOnDelete();
            $table->string('memory_key', 160);
            $table->string('category', 32);
            $table->string('scope', 24)->default('academy');
            $table->string('status', 24)->default('active');
            $table->longText('content');
            $table->unsignedTinyInteger('importance')->default(3);
            $table->boolean('pinned')->default(false);
            $table->string('source_type', 40)->default('chat');
            $table->json('metadata')->nullable();
            if (DB::connection()->getDriverName() !== 'pgsql') {
                $table->text('embedding')->nullable();
            }
            $table->unsignedInteger('access_count')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['owner_id', 'status', 'category']);
            $table->index(['owner_id', 'scope', 'memory_key']);
            $table->index(['owner_id', 'pinned', 'importance']);
            $table->index(['thread_id', 'status']);
            $table->index(['expires_at']);
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE tower_memories ADD COLUMN embedding vector(1536)');
            DB::statement('CREATE INDEX tower_memories_embedding_hnsw ON tower_memories USING hnsw (embedding vector_cosine_ops)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_memories');
    }
};
