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
        Schema::create('customers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('phone', 20)->nullable();
            $table->string('phone_alt', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('fb_psid', 100)->nullable();
            $table->string('instagram_id', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('upazila', 100)->nullable();
            $table->jsonb('default_address')->nullable();
            $table->integer('total_orders')->default(0);
            $table->integer('total_spent')->default(0);
            $table->integer('cod_attempted')->default(0);
            $table->integer('cod_success')->default(0);
            $table->integer('cod_refused')->default(0);
            $table->smallInteger('risk_score')->default(0);
            $table->jsonb('tags')->default('[]');
            $table->text('notes')->nullable();
            $table->boolean('is_blacklisted')->default(false);
            $table->text('blacklist_reason')->nullable();
            $table->timestamp('blacklisted_at')->nullable();
            $table->foreignUlid('blacklisted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('source', 30)->default('manual');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'phone']);
            $table->index(['tenant_id', 'is_blacklisted']);
            $table->index(['tenant_id', 'risk_score']);
            $table->index(['tenant_id', 'fb_psid']);
            $table->index(['tenant_id', 'created_at']);
        });

        Schema::table('customers', function (Blueprint $table) {
            Illuminate\Support\Facades\DB::statement('CREATE INDEX idx_customers_blacklisted ON customers (tenant_id) WHERE is_blacklisted = TRUE;');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
