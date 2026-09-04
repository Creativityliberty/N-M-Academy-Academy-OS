<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academy_mcp_tokens', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 120);
            $table->string('token_hash', 64)->unique();
            $table->json('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();
        });

        Schema::create('academy_mcp_calls', function (Blueprint $table): void {
            $table->id();
            $table->uuid('receipt_id')->unique();
            $table->foreignId('academy_mcp_token_id')->nullable()->constrained('academy_mcp_tokens')->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('request_id', 190)->nullable()->index();
            $table->string('tool', 120)->index();
            $table->string('risk', 24);
            $table->json('arguments')->nullable();
            $table->string('status', 32)->index();
            $table->json('result')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('executed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academy_mcp_calls');
        Schema::dropIfExists('academy_mcp_tokens');
    }
};
