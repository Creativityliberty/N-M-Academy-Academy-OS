<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table): void {
            $table->text('target_audience')->nullable()->after('description');
            $table->string('level', 32)->default('all_levels')->after('target_audience');
            $table->string('language', 16)->default('fr')->after('level');
            $table->json('positioning')->nullable()->after('language');
            $table->string('thumbnail')->nullable()->after('image');
            $table->index('level');
            $table->index('language');
        });

        Schema::table('modules', function (Blueprint $table): void {
            $table->text('description')->nullable()->after('title');
            $table->json('objectives')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropColumn(['description', 'objectives']);
        });

        Schema::table('courses', function (Blueprint $table): void {
            $table->dropIndex(['level']);
            $table->dropIndex(['language']);
            $table->dropColumn(['target_audience', 'level', 'language', 'positioning', 'thumbnail']);
        });
    }
};
