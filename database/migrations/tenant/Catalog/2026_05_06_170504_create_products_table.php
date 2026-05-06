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
        Schema::create('products', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('sku', 100);
            $table->text('description')->nullable();
            $table->integer('cost_price')->default(0);
            $table->integer('selling_price')->default(0);
            $table->integer('weight_gram')->nullable();
            $table->jsonb('images')->default('[]');
            $table->boolean('has_variants')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('low_stock_alert')->default(5);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'sku']);
            $table->index(['tenant_id', 'is_active']);
            $table->index(['tenant_id', 'has_variants']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
