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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('order_id')->constrained()->onDelete('cascade');
            $table->ulid('tenant_id');
            $table->foreignUlid('product_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignUlid('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->string('product_name');
            $table->string('variant_name')->nullable();
            $table->string('sku', 100)->nullable();
            $table->integer('quantity')->default(1);
            $table->integer('unit_price');
            $table->integer('cost_price')->default(0);
            $table->integer('discount_amount')->default(0);
            $table->integer('total_price');
            $table->timestamps();

            $table->index('order_id');
            $table->index(['tenant_id', 'product_id']);
        });

        Illuminate\Support\Facades\DB::statement('ALTER TABLE order_items ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
