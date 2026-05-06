<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Shipping;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Shipping\TenantCourierAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function index(): \Inertia\Response
    {
        $accounts = TenantCourierAccount::with('courierProvider')->get();

        return Inertia::render('Tenant/Shipping/Index', [
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'courier_provider_id' => 'required|exists:courier_providers,id',
            'api_key' => 'required|string',
            'api_secret' => 'nullable|string',
            'store_id' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        TenantCourierAccount::create([
            'tenant_id' => tenant('id'),
            ...$validated,
        ]);

        return back()->with('success', 'Courier account connected.');
    }
}
