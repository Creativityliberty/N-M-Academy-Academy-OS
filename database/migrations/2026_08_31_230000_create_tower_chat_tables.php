<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tower_chat_threads', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 180);
            $table->string('status', 30)->default('active');
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();
            $table->index(['owner_id', 'status', 'last_message_at']);
        });

        Schema::create('tower_chat_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('thread_id')->constrained('tower_chat_threads')->cascadeOnDelete();
            $table->string('role', 20);
            $table->string('type', 40)->default('text');
            $table->string('status', 30)->default('complete');
            $table->longText('content');
            $table->foreignId('compilation_id')->nullable()->constrained('tower_compilations')->nullOnDelete();
            $table->foreignId('mission_id')->nullable()->constrained('tower_missions')->nullOnDelete();
            $table->foreignId('run_id')->nullable()->constrained('tower_runs')->nullOnDelete();
            $table->foreignId('approval_id')->nullable()->constrained('tower_approvals')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['thread_id', 'created_at']);
            $table->index(['approval_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tower_chat_messages');
        Schema::dropIfExists('tower_chat_threads');
    }
};
