<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $mainPath = database_path('migrations');
        $paths = array_merge(
            [$mainPath],
            glob($mainPath.'/central/*', GLOB_ONLYDIR) ?: [],
            glob($mainPath.'/tenant/*', GLOB_ONLYDIR) ?: [],
        );

        $this->loadMigrationsFrom($paths);

        \App\Models\Tenant\Order\Order::observe(\App\Observers\OrderObserver::class);
    }
}
