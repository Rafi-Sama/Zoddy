<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTenantsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('logo_path')->nullable();
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->timestamp('plan_started_at')->nullable();
            $table->timestamp('plan_expires_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->string('status', 30)->default('trial');
            $table->jsonb('settings')->default('{}');
            $table->smallInteger('onboarding_step')->default(0);
            $table->string('timezone', 50)->default('Asia/Dhaka');
            $table->char('currency', 3)->default('BDT');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('plan_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
}
