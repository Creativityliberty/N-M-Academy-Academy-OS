<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('academy_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->string('page_type')->default('landing');
            $table->string('status')->default('draft');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->unique('slug');
            $table->index(['trainer_id', 'status']);
        });

        Schema::create('academy_page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academy_page_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('variant')->default('default');
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('settings')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            $table->index(['academy_page_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academy_page_sections');
        Schema::dropIfExists('academy_pages');
    }
};
