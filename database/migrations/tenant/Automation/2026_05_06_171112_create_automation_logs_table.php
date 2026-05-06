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
        Schema::create('automation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('rule_id')->constrained('automation_rules')->onDelete('cascade');
            $table->string('trigger_ref_type', 50)->nullable();
            $table->string('trigger_ref_id', 26)->nullable();
            $table->string('result', 20);
            $table->jsonb('actions_taken')->default('[]');
            $table->text('error_message')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['rule_id', 'created_at']);
            $table->index(['tenant_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('automation_logs');
    }
};
