<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant\Crm\Customer;
use Illuminate\Support\Facades\DB;
use stdClass;

class CustomerService
{
    public function updateMetrics(Customer $customer): void
    {
        $stats = DB::table('orders')
            ->where('customer_id', $customer->id)
            ->whereNull('deleted_at')
            ->selectRaw('
                COUNT(*) as total_orders,
                SUM(total_amount) as total_spent,
                COUNT(CASE WHEN payment_method = "cod" THEN 1 END) as cod_attempted,
                COUNT(CASE WHEN status = "delivered" AND payment_method = "cod" THEN 1 END) as cod_success,
                COUNT(CASE WHEN status = "returned" AND payment_method = "cod" THEN 1 END) as cod_refused
            ')
            ->first();

        $customer->update([
            'total_orders' => $stats->total_orders ?? 0,
            'total_spent' => $stats->total_spent ?? 0,
            'cod_attempted' => $stats->cod_attempted ?? 0,
            'cod_success' => $stats->cod_success ?? 0,
            'cod_refused' => $stats->cod_refused ?? 0,
            'risk_score' => $this->calculateRiskScore($stats),
        ]);
    }

    protected function calculateRiskScore(?stdClass $stats): int
    {
        if (! $stats || $stats->cod_attempted === 0) {
            return 0;
        }

        $refusalRate = $stats->cod_refused / $stats->cod_attempted;

        return (int) round($refusalRate * 100);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function findOrCreate(array $data): Customer
    {
        return Customer::firstOrCreate(
            ['tenant_id' => tenant('id'), 'phone' => $data['phone']],
            [
                'name' => $data['name'] ?? 'New Customer',
                'email' => $data['email'] ?? null,
                'source' => $data['source'] ?? 'manual',
                'fb_psid' => $data['fb_psid'] ?? null,
                'instagram_id' => $data['instagram_id'] ?? null,
            ],
        );
    }
}
