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
        Schema::create('transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('order_id')->nullable()->constrained()->onDelete('set null');
            $table->string('type', 40);
            $table->char('direction', 2); // 'in', 'out'
            $table->integer('amount'); // paisa
            $table->string('payment_method', 30)->nullable();
            $table->string('gateway_txn_id')->nullable();
            $table->string('reference_type', 50)->nullable();
            $table->string('reference_id', 26)->nullable();
            $table->text('note')->nullable();
            $table->date('transaction_date');
            $table->foreignUlid('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->index(['tenant_id', 'type']);
            $table->index(['tenant_id', 'transaction_date']);
            $table->index(['tenant_id', 'order_id']);
            $table->index(['tenant_id', 'direction', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
