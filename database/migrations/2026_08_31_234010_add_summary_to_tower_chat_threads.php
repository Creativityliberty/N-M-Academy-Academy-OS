<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tower_chat_threads', function (Blueprint $table): void {
            $table->longText('summary')->nullable()->after('status');
            $table->foreignId('summary_message_id')->nullable()->after('summary')->constrained('tower_chat_messages')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tower_chat_threads', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('summary_message_id');
            $table->dropColumn('summary');
        });
    }
};
