<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->unsignedInteger('platform_fee_bps')->nullable()->after('price');
        });

        Schema::create('trainer_commerce_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('platform_fee_bps')->default(1500);
            $table->unsignedInteger('default_affiliate_bps')->default(1000);
            $table->string('currency', 3)->default('EUR');
            $table->timestamps();
        });

        Schema::create('course_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('billing_type')->default('one_time'); // free|one_time|subscription
            $table->unsignedInteger('amount')->default(0); // minor units
            $table->string('currency', 3)->default('EUR');
            $table->string('interval')->nullable(); // month|year
            $table->unsignedSmallInteger('access_rank')->default(0);
            $table->unsignedSmallInteger('trial_days')->default(0);
            $table->string('stripe_product_id')->nullable();
            $table->string('stripe_price_id')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['course_id', 'slug']);
        });

        Schema::create('academy_coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('code');
            $table->string('discount_type'); // percent|fixed
            $table->unsignedInteger('discount_value'); // percent bps or minor units
            $table->string('currency', 3)->nullable();
            $table->unsignedInteger('max_redemptions')->nullable();
            $table->unsignedInteger('redemptions')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->string('stripe_coupon_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['trainer_id', 'code']);
        });

        Schema::create('affiliate_partners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('code');
            $table->unsignedInteger('commission_bps')->default(1000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['trainer_id', 'code']);
        });

        Schema::create('academy_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offer_id')->nullable()->constrained('course_offers')->nullOnDelete();
            $table->foreignId('coupon_id')->nullable()->constrained('academy_coupons')->nullOnDelete();
            $table->foreignId('affiliate_id')->nullable()->constrained('affiliate_partners')->nullOnDelete();
            $table->string('kind')->default('one_time');
            $table->string('status')->default('pending'); // pending|paid|partially_refunded|refunded|canceled|failed
            $table->string('currency', 3)->default('EUR');
            $table->unsignedBigInteger('subtotal_amount')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('gross_amount')->default(0);
            $table->unsignedBigInteger('platform_fee_amount')->default(0);
            $table->unsignedBigInteger('affiliate_commission_amount')->default(0);
            $table->unsignedBigInteger('refunded_amount')->default(0);
            $table->unsignedBigInteger('refunded_platform_fee_amount')->default(0);
            $table->string('stripe_checkout_session_id')->nullable()->unique();
            $table->string('stripe_payment_intent_id')->nullable()->index();
            $table->string('stripe_subscription_id')->nullable()->index();
            $table->string('stripe_invoice_id')->nullable()->index();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('academy_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('academy_orders')->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offer_id')->constrained('course_offers')->cascadeOnDelete();
            $table->string('stripe_subscription_id')->unique();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('recurring_amount')->default(0);
            $table->string('currency', 3)->default('EUR');
            $table->string('interval')->nullable();
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            $table->index(['course_id', 'status']);
        });

        Schema::create('affiliate_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained('affiliate_partners')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('academy_orders')->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('reversed_amount')->default(0);
            $table->string('currency', 3);
            $table->string('status')->default('accrued'); // accrued|void|paid
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->unique(['affiliate_id', 'order_id']);
        });

        Schema::create('academy_refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('academy_orders')->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('reversed_amount')->default(0);
            $table->string('currency', 3);
            $table->string('reason')->nullable();
            $table->string('status')->default('pending');
            $table->string('stripe_refund_id')->nullable()->unique();
            $table->string('receipt_id')->nullable()->index();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->foreignId('offer_id')->nullable()->after('course_id')->constrained('course_offers')->nullOnDelete();
            $table->unsignedSmallInteger('access_rank')->default(0)->after('offer_id');
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->unsignedSmallInteger('minimum_access_rank')->default(0)->after('duration');
        });
    }

    public function down(): void
    {
        Schema::table('modules', fn (Blueprint $table) => $table->dropColumn('minimum_access_rank'));
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('offer_id');
            $table->dropColumn('access_rank');
        });
        Schema::dropIfExists('academy_refunds');
        Schema::dropIfExists('affiliate_commissions');
        Schema::dropIfExists('academy_memberships');
        Schema::dropIfExists('academy_orders');
        Schema::dropIfExists('affiliate_partners');
        Schema::dropIfExists('academy_coupons');
        Schema::dropIfExists('course_offers');
        Schema::dropIfExists('trainer_commerce_settings');
        Schema::table('plans', fn (Blueprint $table) => $table->dropColumn('platform_fee_bps'));
    }
};
