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
        Schema::create('courier_providers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 50);
            $table->string('code', 20)->unique();
            $table->string('description')->nullable();
            $table->jsonb('required_config');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courier_providers');
    }
};
