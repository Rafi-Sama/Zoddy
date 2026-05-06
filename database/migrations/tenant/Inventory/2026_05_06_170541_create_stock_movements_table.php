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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->ulid('tenant_id');
            $table->foreignId('inventory_id')->constrained('inventory')->onDelete('cascade');
            $table->string('type', 30);
            $table->integer('quantity');
            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->string('reference_type', 50)->nullable();
            $table->string('reference_id', 26)->nullable();
            $table->text('note')->nullable();
            $table->foreignUlid('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['tenant_id', 'inventory_id']);
            $table->index(['tenant_id', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
        });

        Illuminate\Support\Facades\DB::statement('ALTER TABLE stock_movements ADD CONSTRAINT check_quantity_not_zero CHECK (quantity != 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
