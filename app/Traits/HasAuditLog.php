<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\Tenant\System\AuditLog;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $tenant_id
 */
trait HasAuditLog
{
    protected static function bootHasAuditLog(): void
    {
        static::updated(function (Model $model) {
            self::logAction($model, 'updated');
        });

        static::created(function (Model $model) {
            self::logAction($model, 'created');
        });

        static::deleted(function (Model $model) {
            self::logAction($model, 'deleted');
        });
    }

    protected static function logAction(Model $model, string $action): void
    {
        if (! auth()->check() && ! app()->runningInConsole()) {
            return;
        }

        $changes = $model->getChanges();
        $old = array_intersect_key($model->getOriginal(), $changes);

        AuditLog::create([
            'tenant_id' => $model->tenant_id ?? (tenancy()->initialized ? tenant('id') : null),
            'user_id' => auth()->id(),
            'user_name' => auth()->check() ? auth()->user()->name : 'System',
            'action' => strtolower(class_basename($model)).'.'.$action,
            'model_type' => class_basename($model),
            'model_id' => (string) $model->getKey(),
            'old_values' => $action === 'updated' ? $old : null,
            'new_values' => $action === 'deleted' ? null : $model->getAttributes(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
