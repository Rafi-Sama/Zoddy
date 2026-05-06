<?php

declare(strict_types=1);

namespace App\Enums;

enum SocialPlatform: string
{
    case FACEBOOK = 'facebook';
    case INSTAGRAM = 'instagram';
    case WHATSAPP = 'whatsapp';

    public function label(): string
    {
        return match ($this) {
            self::FACEBOOK => 'Facebook',
            self::INSTAGRAM => 'Instagram',
            self::WHATSAPP => 'WhatsApp',
        };
    }
}
