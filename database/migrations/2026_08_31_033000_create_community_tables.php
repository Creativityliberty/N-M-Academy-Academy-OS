<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_spaces', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('community_posts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('community_space_id')->constrained('community_spaces')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title', 180);
            $table->text('body');
            $table->boolean('is_pinned')->default(false)->index();
            $table->boolean('is_locked')->default(false);
            $table->boolean('is_hidden')->default(false)->index();
            $table->timestamp('hidden_at')->nullable();
            $table->foreignId('hidden_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['community_space_id', 'created_at']);
        });

        Schema::create('community_comments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('community_post_id')->constrained('community_posts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->boolean('is_hidden')->default(false)->index();
            $table->timestamp('hidden_at')->nullable();
            $table->foreignId('hidden_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['community_post_id', 'created_at']);
        });

        Schema::create('community_reactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('reactionable');
            $table->string('type', 24);
            $table->timestamps();
            $table->unique(['user_id', 'reactionable_type', 'reactionable_id', 'type'], 'community_reaction_unique');
        });

        Schema::create('community_attachments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('community_post_id')->constrained('community_posts')->cascadeOnDelete();
            $table->string('disk', 32)->default('public');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size');
            $table->timestamps();
        });

        DB::table('community_spaces')->insert([
            [
                'name' => 'Général',
                'slug' => 'general',
                'description' => 'Présentations, questions et échanges ouverts à toute la communauté.',
                'position' => 10,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Apprentissage',
                'slug' => 'apprentissage',
                'description' => 'Questions sur les cours, exercices et méthodes de progression.',
                'position' => 20,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Projets & retours',
                'slug' => 'projets-retours',
                'description' => 'Partagez vos réalisations et recevez des retours constructifs.',
                'position' => 30,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Opportunités',
                'slug' => 'opportunites',
                'description' => 'Collaborations, missions, idées et opportunités utiles aux membres.',
                'position' => 40,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('community_attachments');
        Schema::dropIfExists('community_reactions');
        Schema::dropIfExists('community_comments');
        Schema::dropIfExists('community_posts');
        Schema::dropIfExists('community_spaces');
    }
};
