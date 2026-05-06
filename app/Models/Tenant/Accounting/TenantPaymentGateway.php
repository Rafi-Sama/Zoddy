<?php

declare(strict_types=1);

namespace App\Models\Tenant\Accounting;

use App\Models\Central\Integration\PaymentGateway;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $tenant_id
 */
class TenantPaymentGateway extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'payment_gateway_id',
        'config',
        'is_active',
    ];

    protected $casts = [
        'config' => 'encrypted:json',
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<PaymentGateway, $this>
     */
    public function paymentGateway(): BelongsTo
    {
        return $this->belongsTo(PaymentGateway::class);
    }
}
