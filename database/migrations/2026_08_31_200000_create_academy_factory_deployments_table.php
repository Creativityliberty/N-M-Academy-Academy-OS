<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academy_factory_deployments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->uuid('receipt_id')->unique();
            $table->string('client_name');
            $table->string('slug')->unique();
            $table->string('template_key');
            $table->string('domain')->unique();
            $table->string('status')->default('draft')->index();
            $table->string('phase')->default('draft');
            $table->json('blueprint');
            $table->text('secrets')->nullable();
            $table->json('steps')->nullable();
            $table->string('coolify_project_uuid')->nullable();
            $table->string('coolify_environment_uuid')->nullable();
            $table->string('coolify_application_uuid')->nullable();
            $table->string('coolify_deployment_uuid')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamp('last_health_check_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academy_factory_deployments');
    }
};
