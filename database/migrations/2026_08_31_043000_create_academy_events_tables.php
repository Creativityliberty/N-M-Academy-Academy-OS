<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academy_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 180);
            $table->text('description');
            $table->timestampTz('starts_at');
            $table->timestampTz('ends_at');
            $table->string('timezone', 64)->default('UTC');
            $table->string('meeting_url', 2048)->nullable();
            $table->string('location', 255)->nullable();
            $table->unsignedInteger('capacity')->nullable();
            $table->unsignedInteger('reminder_minutes')->default(60);
            $table->boolean('is_published')->default(true);
            $table->boolean('is_cancelled')->default(false);
            $table->timestamps();

            $table->index(['is_published', 'is_cancelled', 'starts_at']);
        });

        Schema::create('event_registrations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('academy_event_id')->constrained('academy_events')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestampTz('registered_at');
            $table->timestampTz('reminder_sent_at')->nullable();
            $table->timestamps();

            $table->unique(['academy_event_id', 'user_id']);
            $table->index(['reminder_sent_at', 'registered_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('academy_events');
    }
};
