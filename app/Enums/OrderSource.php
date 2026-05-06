<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderSource: string
{
    case FACEBOOK_MESSENGER = 'facebook_messenger';
    case INSTAGRAM_DM = 'instagram_dm';
    case MANUAL = 'manual';
    case WEBSITE = 'website';
    case WHATSAPP = 'whatsapp';

    public function label(): string
    {
        return match ($this) {
            self::FACEBOOK_MESSENGER => 'Facebook Messenger',
            self::INSTAGRAM_DM => 'Instagram DM',
            self::MANUAL => 'Manual',
            self::WEBSITE => 'Website',
            self::WHATSAPP => 'WhatsApp',
        };
    }
}
