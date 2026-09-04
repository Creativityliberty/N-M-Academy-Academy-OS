<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_assessments', function (Blueprint $table): void {
            $table->boolean('is_required_for_completion')->default(false)->after('is_enabled');
            $table->index(['course_id', 'is_enabled', 'is_required_for_completion'], 'assessments_completion_required_idx');
        });

        Schema::table('course_assignments', function (Blueprint $table): void {
            $table->boolean('is_required_for_completion')->default(false)->after('is_enabled');
            $table->index(['course_id', 'is_enabled', 'is_required_for_completion'], 'assignments_completion_required_idx');
        });

        Schema::create('course_completion_policies', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->unique()->constrained()->cascadeOnDelete();
            $table->boolean('require_all_accessible_lessons')->default(true);
            $table->boolean('certificate_enabled')->default(true);
            $table->string('certificate_title')->nullable();
            $table->string('issuer_name')->nullable();
            $table->timestamps();
        });

        Schema::create('course_completions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->foreignId('enrollment_id')->nullable()->constrained()->nullOnDelete();
            $table->json('evidence_snapshot');
            $table->timestamp('completed_at');
            $table->timestamps();
            $table->unique(['course_id', 'user_id'], 'course_user_completion_unique');
            $table->index(['user_id', 'completed_at']);
        });

        Schema::create('course_certificates', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('completion_id')->unique()->constrained('course_completions')->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->uuid('verification_code')->unique();
            $table->string('recipient_name');
            $table->string('course_title');
            $table->string('issuer_name');
            $table->string('certificate_title');
            $table->string('document_hash', 64);
            $table->timestamp('issued_at');
            $table->timestamp('revoked_at')->nullable();
            $table->foreignId('revoked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('revocation_reason')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'issued_at']);
            $table->index(['course_id', 'issued_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_certificates');
        Schema::dropIfExists('course_completions');
        Schema::dropIfExists('course_completion_policies');

        Schema::table('course_assignments', function (Blueprint $table): void {
            $table->dropIndex('assignments_completion_required_idx');
            $table->dropColumn('is_required_for_completion');
        });

        Schema::table('course_assessments', function (Blueprint $table): void {
            $table->dropIndex('assessments_completion_required_idx');
            $table->dropColumn('is_required_for_completion');
        });
    }
};
