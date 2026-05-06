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
        Schema::create('social_conversations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('social_account_id')->constrained()->onDelete('cascade');
            $table->string('platform_thread_id');
            $table->foreignUlid('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->string('sender_platform_id', 100);
            $table->string('sender_name')->nullable();
            $table->string('sender_avatar', 500)->nullable();
            $table->string('status', 20)->default('open');
            $table->foreignUlid('order_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('last_message_at')->nullable();
            $table->string('last_message_preview', 500)->nullable();
            $table->smallInteger('unread_count')->default(0);
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->unique(['social_account_id', 'platform_thread_id']);
            $table->index(['tenant_id', 'status', 'last_message_at']);
            $table->index(['tenant_id', 'customer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_conversations');
    }
};
