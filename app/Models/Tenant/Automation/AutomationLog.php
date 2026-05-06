<?php

declare(strict_types=1);

namespace App\Models\Tenant\Automation;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $tenant_id
 */
class AutomationLog extends Model
{
    protected $fillable = [
        'tenant_id',
        'rule_id',
        'trigger_ref_type',
        'trigger_ref_id',
        'result',
        'actions_taken',
        'error_message',
    ];

    protected $casts = [
        'actions_taken' => 'json',
    ];

    /**
     * @return BelongsTo<AutomationRule, $this>
     */
    public function rule(): BelongsTo
    {
        return $this->belongsTo(AutomationRule::class, 'rule_id');
    }
}
