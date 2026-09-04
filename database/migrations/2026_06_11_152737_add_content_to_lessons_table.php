<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('type')->default('video_url')->after('is_free');
            $table->string('video_url')->nullable()->after('type');
            $table->string('audio_url')->nullable()->after('video_url');
            $table->string('pdf_url')->nullable()->after('audio_url');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['type', 'video_url', 'audio_url', 'pdf_url']);
        });
    }
};
