<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant\Automation\AutomationLog;
use App\Models\Tenant\Automation\AutomationRule;
use Exception;
use Illuminate\Support\Facades\Log;

class AutomationService
{
    /**
     * @param array<string, mixed> $payload
     */
    public function evaluate(string $tenantId, string $event, array $payload): void
    {
        $rules = AutomationRule::where('tenant_id', $tenantId)
            ->where('trigger_event', $event)
            ->where('is_active', true)
            ->orderBy('priority')
            ->get();

        foreach ($rules as $rule) {
            if ($this->shouldRun($rule, $payload)) {
                $this->execute($rule, $payload);
            }
        }
    }

    /**
     * @param array<string, mixed> $payload
     */
    protected function shouldRun(AutomationRule $rule, array $payload): bool
    {
        // Simple condition evaluation logic (AND logic)
        foreach ($rule->conditions as $condition) {
            $field = $condition['field'];
            $operator = $condition['operator'];
            $value = $condition['value'];

            $actualValue = data_get($payload, $field);

            if (! $this->evaluateCondition($actualValue, $operator, $value)) {
                return false;
            }
        }

        return true;
    }

    protected function evaluateCondition(mixed $actual, string $operator, mixed $expected): bool
    {
        return match ($operator) {
            'equals' => $actual == $expected,
            'not_equals' => $actual != $expected,
            'contains' => str_contains((string) $actual, (string) $expected),
            'greater_than' => $actual > $expected,
            'less_than' => $actual < $expected,
            default => false,
        };
    }

    /**
     * @param array<string, mixed> $payload
     */
    public function execute(AutomationRule $rule, array $payload): void
    {
        try {
            $actionsTaken = [];
            foreach ($rule->actions as $action) {
                $actionsTaken[] = $this->performAction($action, $payload);
            }

            AutomationLog::create([
                'tenant_id' => $rule->tenant_id,
                'rule_id' => $rule->id,
                'trigger_ref_type' => $payload['ref_type'] ?? null,
                'trigger_ref_id' => $payload['ref_id'] ?? null,
                'result' => 'success',
                'actions_taken' => $actionsTaken,
            ]);

            $rule->increment('run_count');
            $rule->update(['last_run_at' => now()]);

        } catch (Exception $e) {
            Log::error('Automation error: '.$e->getMessage());

            AutomationLog::create([
                'tenant_id' => $rule->tenant_id,
                'rule_id' => $rule->id,
                'trigger_ref_type' => $payload['ref_type'] ?? null,
                'trigger_ref_id' => $payload['ref_id'] ?? null,
                'result' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * @param array<string, mixed> $action
     * @param array<string, mixed> $payload
     *
     * @return array<string, mixed>
     */
    protected function performAction(array $action, array $payload): array
    {
        // Action execution logic would go here
        // e.g. send message, tag customer, etc.
        return [
            'type' => $action['type'],
            'status' => 'executed_placeholder',
        ];
    }
}
