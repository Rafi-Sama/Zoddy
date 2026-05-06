<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('warehouse_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('product_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('variant_id')->nullable()->constrained('product_variants')->onDelete('cascade');
            $table->integer('quantity_on_hand')->default(0);
            $table->integer('quantity_reserved')->default(0);
            $table->timestamp('updated_at')->useCurrent();

            $table->unique(['warehouse_id', 'product_id', 'variant_id']);
            $table->index(['tenant_id', 'product_id']);
            $table->index(['tenant_id', 'variant_id']);
        });

        DB::statement('ALTER TABLE inventory ADD CONSTRAINT check_inventory_quantities CHECK (quantity_on_hand >= 0 AND quantity_reserved >= 0 AND quantity_on_hand >= quantity_reserved)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
