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
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('customer_id')->constrained()->onDelete('cascade');
            $table->string('label', 50)->default('Home');
            $table->string('address_line1', 500);
            $table->string('address_line2', 500)->nullable();
            $table->string('district', 100);
            $table->string('upazila', 100)->nullable();
            $table->string('landmark', 255)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};
