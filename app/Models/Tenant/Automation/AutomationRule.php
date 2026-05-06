<?php

declare(strict_types=1);

namespace App\Models\Tenant\Automation;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $tenant_id
 */
class AutomationRule extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'trigger_event',
        'conditions',
        'actions',
        'is_active',
        'priority',
        'run_count',
        'last_run_at',
    ];

    protected $casts = [
        'conditions' => 'json',
        'actions' => 'json',
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    /**
     * @return HasMany<AutomationLog, $this>
     */
    public function logs(): HasMany
    {
        return $this->hasMany(AutomationLog::class, 'rule_id');
    }
}
