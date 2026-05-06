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
        Schema::create('social_messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('conversation_id')->constrained('social_conversations')->onDelete('cascade');
            $table->string('platform_message_id');
            $table->text('message_text')->nullable();
            $table->jsonb('attachments')->nullable();
            $table->string('sender_platform_id', 100);
            $table->boolean('is_from_customer');
            $table->foreignUlid('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('sent_at');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->unique(['conversation_id', 'platform_message_id']);
            $table->index(['conversation_id', 'sent_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_messages');
    }
};
