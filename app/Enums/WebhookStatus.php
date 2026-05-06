<?php

declare(strict_types=1);

namespace App\Enums;

enum WebhookStatus: string
{
    case PENDING = 'pending';
    case PROCESSED = 'processed';
    case FAILED = 'failed';
    case IGNORED = 'ignored';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::PROCESSED => 'Processed',
            self::FAILED => 'Failed',
            self::IGNORED => 'Ignored',
        };
    }
}
