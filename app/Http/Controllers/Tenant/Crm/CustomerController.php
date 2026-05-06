<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Crm;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Crm\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $customers = Customer::orderBy('name')
            ->paginate(20);

        return Inertia::render('Tenant/Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function show(Customer $customer): \Inertia\Response
    {
        $customer->load(['orders', 'addresses', 'noteLogs']);

        return Inertia::render('Tenant/Customers/Show', [
            'customer' => $customer,
        ]);
    }
}
