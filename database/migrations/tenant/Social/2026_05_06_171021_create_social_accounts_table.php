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
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->string('platform', 20);
            $table->string('platform_id', 100);
            $table->string('name');
            $table->string('username', 100)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->text('access_token');
            $table->timestamp('token_expires_at')->nullable();
            $table->boolean('webhook_verified')->default(false);
            $table->jsonb('subscribed_fields')->default('[]');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['tenant_id', 'platform', 'platform_id']);
            $table->index(['tenant_id', 'platform']);
            $table->index(['platform', 'platform_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_accounts');
    }
};
