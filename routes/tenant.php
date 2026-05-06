<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
    App\Http\Middleware\EnsureTenantActive::class,
])->group(function () {
    Route::get('/login', [App\Http\Controllers\Tenant\Auth\AuthController::class, 'create'])->name('login');
    Route::post('/login', [App\Http\Controllers\Tenant\Auth\AuthController::class, 'store']);
    Route::post('/logout', [App\Http\Controllers\Tenant\Auth\AuthController::class, 'destroy'])->name('logout');

    Route::get('/', [App\Http\Controllers\Tenant\Dashboard\DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Order\OrderController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\Tenant\Order\OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [App\Http\Controllers\Tenant\Order\OrderController::class, 'show'])->name('show');
        Route::patch('/{order}/status', [App\Http\Controllers\Tenant\Order\OrderController::class, 'updateStatus'])->name('update-status');
    });

    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Catalog\ProductController::class, 'index'])->name('index');
        Route::get('/{product}', [App\Http\Controllers\Tenant\Catalog\ProductController::class, 'show'])->name('show');
    });

    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Crm\CustomerController::class, 'index'])->name('index');
        Route::get('/{customer}', [App\Http\Controllers\Tenant\Crm\CustomerController::class, 'show'])->name('show');
    });

    Route::prefix('shipping')->name('shipping.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Shipping\ShippingController::class, 'index'])->name('index');
        Route::post('/accounts', [App\Http\Controllers\Tenant\Shipping\ShippingController::class, 'store'])->name('accounts.store');
    });

    Route::prefix('social')->name('social.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Social\SocialController::class, 'index'])->name('index');
        Route::get('/{conversation}', [App\Http\Controllers\Tenant\Social\SocialController::class, 'show'])->name('show');
        Route::post('/{conversation}/reply', [App\Http\Controllers\Tenant\Social\SocialController::class, 'reply'])->name('reply');
    });

    Route::prefix('automation')->name('automation.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Automation\AutomationController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\Tenant\Automation\AutomationController::class, 'store'])->name('store');
        Route::patch('/{rule}/toggle', [App\Http\Controllers\Tenant\Automation\AutomationController::class, 'toggle'])->name('toggle');
    });

    Route::prefix('accounting')->name('accounting.')->group(function () {
        Route::get('/transactions', [App\Http\Controllers\Tenant\Accounting\AccountingController::class, 'index'])->name('transactions.index');
        Route::get('/expenses', [App\Http\Controllers\Tenant\Accounting\AccountingController::class, 'expenses'])->name('expenses.index');
        Route::post('/expenses', [App\Http\Controllers\Tenant\Accounting\AccountingController::class, 'storeExpense'])->name('expenses.store');
    });

    Route::prefix('inventory')->name('inventory.')->group(function () {
        Route::get('/', [App\Http\Controllers\Tenant\Inventory\InventoryController::class, 'index'])->name('index');
        Route::get('/{inventory}/logs', [App\Http\Controllers\Tenant\Inventory\InventoryController::class, 'logs'])->name('logs');
        Route::post('/{inventory}/adjust', [App\Http\Controllers\Tenant\Inventory\InventoryController::class, 'adjust'])->name('adjust');

        Route::get('/warehouses', [App\Http\Controllers\Tenant\Inventory\WarehouseController::class, 'index'])->name('warehouses.index');
        Route::post('/warehouses', [App\Http\Controllers\Tenant\Inventory\WarehouseController::class, 'store'])->name('warehouses.store');
    });

    Route::prefix('catalog')->name('catalog.')->group(function () {
        Route::get('/categories', [App\Http\Controllers\Tenant\Catalog\CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [App\Http\Controllers\Tenant\Catalog\CategoryController::class, 'store'])->name('categories.store');
        Route::patch('/categories/{category}', [App\Http\Controllers\Tenant\Catalog\CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [App\Http\Controllers\Tenant\Catalog\CategoryController::class, 'destroy'])->name('categories.destroy');
    });

    Route::prefix('system')->name('system.')->group(function () {
        Route::get('/notifications', [App\Http\Controllers\Tenant\System\NotificationController::class, 'index'])->name('notifications.index');
        Route::patch('/notifications/{notification}/read', [App\Http\Controllers\Tenant\System\NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [App\Http\Controllers\Tenant\System\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        Route::get('/audit-logs', [App\Http\Controllers\Tenant\System\AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('/audit-logs/{log}', [App\Http\Controllers\Tenant\System\AuditLogController::class, 'show'])->name('audit-logs.show');
    });

    // Public API / Webhooks
    Route::post('/webhooks/{source}', [App\Http\Controllers\Tenant\System\WebhookController::class, 'handle'])->name('webhooks.handle');
});
