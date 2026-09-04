<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->decimal('amount_paid', 10, 2)->nullable()->after('stripe_payment_intent_id');
            $table->string('currency', 3)->nullable()->after('amount_paid');
            $table->timestamp('paid_at')->nullable()->after('currency');

            $table->index(['course_id', 'paid_at']);
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropIndex(['course_id', 'paid_at']);
            $table->dropColumn(['amount_paid', 'currency', 'paid_at']);
        });
    }
};
