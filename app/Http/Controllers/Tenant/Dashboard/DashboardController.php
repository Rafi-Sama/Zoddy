<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Crm\Customer;
use App\Models\Tenant\Order\Order;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $tenantId = tenant('id');

        $stats = Cache::remember("tenant:{$tenantId}:dashboard", now()->addMinutes(5), function () {
            return [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_customers' => Customer::count(),
                'revenue' => Order::where('status', 'delivered')->sum('total_amount'),
                'recent_orders' => Order::with('customer')->orderBy('created_at', 'desc')->take(5)->get(),
            ];
        });

        return Inertia::render('Tenant/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
