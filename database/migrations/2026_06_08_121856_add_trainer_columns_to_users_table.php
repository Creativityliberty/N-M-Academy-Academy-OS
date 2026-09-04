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
        Schema::table('users', function (Blueprint $table) {
            $table->string('trainer_title')->nullable()->after('name');
            $table->text('trainer_bio')->nullable()->after('trainer_title');
            $table->string('trainer_avatar')->nullable()->after('trainer_bio');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['trainer_title', 'trainer_bio', 'trainer_avatar']);
        });
    }
};
