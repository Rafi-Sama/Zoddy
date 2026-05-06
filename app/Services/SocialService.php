<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant\Crm\Customer;
use App\Models\Tenant\Social\SocialConversation;
use App\Models\Tenant\Social\SocialMessage;
use Illuminate\Support\Facades\DB;

class SocialService
{
    /**
     * @param array<string, mixed> $data
     */
    public function receiveMessage(array $data): SocialMessage
    {
        return DB::transaction(function () use ($data) {
            $conversation = SocialConversation::firstOrCreate(
                [
                    'social_account_id' => $data['social_account_id'],
                    'platform_thread_id' => $data['thread_id'],
                ],
                [
                    'tenant_id' => tenant('id'),
                    'sender_platform_id' => $data['sender_id'],
                    'sender_name' => $data['sender_name'],
                ],
            );

            /** @var SocialMessage $message */
            $message = $conversation->messages()->create([
                'tenant_id' => tenant('id'),
                'platform_message_id' => $data['message_id'],
                'direction' => 'inbound',
                'message_type' => $data['type'] ?? 'text',
                'content' => $data['text'] ?? null,
                'attachments' => $data['attachments'] ?? [],
                'sent_at' => now(),
            ]);

            $conversation->update([
                'last_message_at' => now(),
                'last_message_preview' => substr((string) $message->content, 0, 100),
                'unread_count' => $conversation->unread_count + 1,
            ]);

            return $message;
        });
    }

    public function sendMessage(SocialConversation $conversation, string $text, ?string $userId = null): SocialMessage
    {
        // Logic to call FB/IG API would go here

        /** @var SocialMessage $message */
        $message = $conversation->messages()->create([
            'tenant_id' => $conversation->tenant_id,
            'platform_message_id' => 'OUT-'.uniqid(),
            'direction' => 'outbound',
            'content' => $text,
            'sent_by' => $userId,
            'sent_at' => now(),
        ]);

        return $message;
    }

    public function linkCustomer(SocialConversation $conversation, Customer $customer): void
    {
        $conversation->update(['customer_id' => $customer->id]);

        // Also update customer's social IDs if missing
        if ($conversation->socialAccount->platform === 'facebook' && ! $customer->fb_psid) {
            $customer->update(['fb_psid' => $conversation->sender_platform_id]);
        }
    }
}
