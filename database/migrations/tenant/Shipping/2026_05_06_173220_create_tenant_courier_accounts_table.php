<?php

declare(strict_types=1);

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
        Schema::create('tenant_courier_accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('courier_provider_id')->constrained('courier_providers')->cascadeOnDelete();
            $table->string('account_name', 100);
            $table->jsonb('config'); // Encrypted credentials
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'courier_provider_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_courier_accounts');
    }
};
