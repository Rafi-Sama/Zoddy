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
        Schema::create('orders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->string('order_number', 30);
            $table->foreignUlid('customer_id')->constrained()->onDelete('cascade');
            $table->string('source', 30)->default('manual');
            $table->string('source_ref')->nullable();
            $table->integer('subtotal')->default(0);
            $table->string('discount_type', 20)->nullable();
            $table->integer('discount_value')->default(0);
            $table->integer('discount_amount')->default(0);
            $table->integer('shipping_charge')->default(0);
            $table->integer('total_amount')->default(0);
            $table->integer('cod_amount')->default(0);
            $table->string('payment_method', 30)->default('cod');
            $table->string('payment_status', 30)->default('pending');
            $table->string('shipping_name');
            $table->string('shipping_phone', 20);
            $table->text('shipping_address');
            $table->string('shipping_district', 100);
            $table->string('shipping_upazila', 100)->nullable();
            $table->string('status', 30)->default('pending');
            $table->smallInteger('priority')->default(0);
            $table->text('notes')->nullable();
            $table->text('internal_notes')->nullable();
            $table->foreignUlid('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('processing_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('returned_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancelled_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'order_number']);
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'customer_id']);
            $table->index(['tenant_id', 'payment_status']);
            $table->index(['tenant_id', 'created_at']);
            $table->index(['tenant_id', 'assigned_to']);
            $table->index(['tenant_id', 'source']);
        });

        Schema::table('orders', function (Blueprint $table) {
            Illuminate\Support\Facades\DB::statement("CREATE INDEX idx_orders_pending ON orders (tenant_id, created_at) WHERE status = 'pending'");
            Illuminate\Support\Facades\DB::statement("CREATE INDEX idx_orders_unpaid ON orders (tenant_id, created_at) WHERE payment_status = 'pending' AND payment_method = 'cod'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
