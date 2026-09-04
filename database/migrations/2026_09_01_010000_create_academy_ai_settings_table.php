<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('academy_ai_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('scope', 40)->default('academy')->unique();
            $table->string('text_provider', 40)->nullable();
            $table->string('text_model', 160)->nullable();
            $table->string('image_provider', 40)->nullable();
            $table->string('image_model', 160)->nullable();
            $table->string('image_size', 16)->nullable();
            $table->string('image_prompt_preset', 80)->nullable();
            $table->boolean('respect_branding')->default(true);
            $table->boolean('avoid_embedded_text')->default(true);
            $table->string('tts_provider', 40)->nullable();
            $table->string('tts_model', 160)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academy_ai_settings');
    }
};
