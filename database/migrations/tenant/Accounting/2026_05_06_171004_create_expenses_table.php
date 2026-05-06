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
        Schema::create('expenses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->string('category', 100);
            $table->text('description')->nullable();
            $table->integer('amount');
            $table->string('payment_method', 30)->nullable();
            $table->date('expense_date');
            $table->string('receipt_path', 500)->nullable();
            $table->foreignUlid('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['tenant_id', 'category', 'expense_date']);
            $table->index(['tenant_id', 'expense_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
