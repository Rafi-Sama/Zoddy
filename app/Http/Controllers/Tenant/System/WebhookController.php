<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\System;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessIncomingWebhook;
use App\Models\Tenant\System\WebhookLog;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    /**
     * Handle incoming webhooks.
     */
    public function handle(Request $request, string $source): \Symfony\Component\HttpFoundation\Response|string
    {
        $payload = $request->all();
        $headers = $request->headers->all();

        // FB verification logic if source is facebook
        if ($source === 'facebook' && $request->has('hub_challenge')) {
            return $this->verifyFacebook($request);
        }

        $log = WebhookLog::create([
            'tenant_id' => tenant('id'),
            'source' => $source,
            'event_type' => $request->header('X-Event-Type') ?? 'unknown',
            'payload' => $payload,
            'headers' => $headers,
            'status' => 'pending',
        ]);

        // Dispatch job for async processing
        ProcessIncomingWebhook::dispatch($log);

        return response()->json(['status' => 'received']);
    }

    protected function verifyFacebook(Request $request): \Symfony\Component\HttpFoundation\Response|string
    {
        $verifyToken = config('services.facebook.verify_token');
        if ($request->get('hub_verify_token') === $verifyToken) {
            return $request->get('hub_challenge');
        }

        return response('Unauthorized', 403);
    }
}
