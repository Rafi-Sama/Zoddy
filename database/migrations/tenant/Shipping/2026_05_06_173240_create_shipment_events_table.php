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
        Schema::create('shipment_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('shipment_id')->constrained()->cascadeOnDelete();
            $table->string('status', 50);
            $table->string('location', 255)->nullable();
            $table->string('description', 500)->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();

            $table->index('shipment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_events');
    }
};
