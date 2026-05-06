<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Tenant\Order\Order;
use App\Services\CourierService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DispatchToCourierJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     *
     * @param array<string, mixed> $params
     */
    public function __construct(
        public Order $order,
        public string $providerSlug,
        public array $params,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(CourierService $courierService): void
    {
        try {
            // Tenancy is already initialized by QueueTenancyBootstrapper when the job is processed
            $courierService->dispatch($this->order, $this->providerSlug, $this->params);
        } catch (Exception $e) {
            Log::error('Failed to dispatch order to courier: '.$e->getMessage());
            $this->fail($e);
        }
    }
}
