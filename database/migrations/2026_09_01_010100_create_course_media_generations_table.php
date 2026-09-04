<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_media_generations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->string('purpose', 80);
            $table->string('provider', 40);
            $table->string('model', 160);
            $table->longText('compiled_prompt');
            $table->text('user_prompt')->nullable();
            $table->string('aspect_ratio', 16)->nullable();
            $table->string('image_size', 16)->nullable();
            $table->text('asset_url');
            $table->string('mime_type', 120)->nullable();
            $table->string('status', 24)->default('candidate');
            $table->timestamp('applied_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
            $table->index(['course_id', 'purpose', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_media_generations');
    }
};
