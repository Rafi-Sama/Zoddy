<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });

    Route::prefix('admin')->name('central.')->group(function () {
        Route::get('/tenants', [App\Http\Controllers\Central\Tenant\TenantController::class, 'index'])->name('tenants.index');
        Route::get('/tenants/{tenant}', [App\Http\Controllers\Central\Tenant\TenantController::class, 'show'])->name('tenants.show');
        Route::patch('/tenants/{tenant}/toggle', [App\Http\Controllers\Central\Tenant\TenantController::class, 'toggleStatus'])->name('tenants.toggle');

        Route::get('/plans', [App\Http\Controllers\Central\Tenant\PlanController::class, 'index'])->name('plans.index');
        Route::post('/plans', [App\Http\Controllers\Central\Tenant\PlanController::class, 'store'])->name('plans.store');

        Route::get('/couriers', [App\Http\Controllers\Central\Integration\CourierProviderController::class, 'index'])->name('couriers.index');
        Route::patch('/couriers/{provider}', [App\Http\Controllers\Central\Integration\CourierProviderController::class, 'update'])->name('couriers.update');
    });
});
