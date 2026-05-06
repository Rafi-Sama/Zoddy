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
        Schema::create('tenant_sequences', function (Blueprint $table) {
            $table->ulid('tenant_id')->primary();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->bigInteger('order_sequence')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_sequences');
    }
};
