<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('course_assessments')) {
            return;
        }

        Schema::table('course_assessments', function (Blueprint $table): void {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['lesson_id']);
        });

        Schema::table('course_assessments', function (Blueprint $table): void {
            $table->foreign('module_id')->references('id')->on('modules')->restrictOnDelete();
            $table->foreign('lesson_id')->references('id')->on('lessons')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('course_assessments')) {
            return;
        }

        Schema::table('course_assessments', function (Blueprint $table): void {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['lesson_id']);
        });

        Schema::table('course_assessments', function (Blueprint $table): void {
            $table->foreign('module_id')->references('id')->on('modules')->cascadeOnDelete();
            $table->foreign('lesson_id')->references('id')->on('lessons')->cascadeOnDelete();
        });
    }
};
