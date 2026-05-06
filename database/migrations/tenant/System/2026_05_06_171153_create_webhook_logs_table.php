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
        Schema::create('webhook_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->string('source', 50);
            $table->text('request_body');
            $table->text('request_headers');
            $table->string('status', 20);
            $table->text('response')->nullable();
            $table->string('processing_status', 20)->default('pending');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['tenant_id', 'source', 'created_at']);
            $table->index(['tenant_id', 'processing_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_logs');
    }
};
