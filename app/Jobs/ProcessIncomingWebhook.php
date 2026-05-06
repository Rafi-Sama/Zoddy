<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Tenant\System\WebhookLog;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessIncomingWebhook implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public WebhookLog $webhookLog,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->webhookLog->update(['status' => 'processing']);

            // Logic to route webhook based on source
            match ($this->webhookLog->source) {
                'facebook' => $this->handleFacebook(),
                'pathao' => $this->handlePathao(),
                default => $this->webhookLog->update(['status' => 'ignored']),
            };

            $this->webhookLog->update([
                'status' => 'processed',
                'processed_at' => now(),
            ]);

        } catch (Exception $e) {
            Log::error('Webhook processing failed: '.$e->getMessage());
            $this->webhookLog->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }

    protected function handleFacebook(): void
    {
        // Facebook webhook logic
    }

    protected function handlePathao(): void
    {
        // Courier webhook logic
    }
}
