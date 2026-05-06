<?php

declare(strict_types=1);

namespace App\Models\Tenant\Accounting;

use App\Models\Tenant\Auth\User;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $tenant_id
 * @property int $amount
 */
class Expense extends Model
{
    use \App\Traits\HasAuditLog;
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'category',
        'description',
        'amount',
        'payment_method',
        'expense_date',
        'receipt_path',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'integer',
        'expense_date' => 'date',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
