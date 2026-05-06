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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('user_name')->nullable();
            $table->string('action', 100);
            $table->string('model_type', 100);
            $table->string('model_id', 26);
            $table->jsonb('old_values')->nullable();
            $table->jsonb('new_values')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['tenant_id', 'model_type', 'model_id']);
            $table->index(['tenant_id', 'user_id', 'created_at']);
            $table->index(['tenant_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
