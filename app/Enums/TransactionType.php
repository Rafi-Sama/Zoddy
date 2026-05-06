<?php

declare(strict_types=1);

namespace App\Enums;

enum TransactionType: string
{
    case SALE = 'sale';
    case COD_COLLECTION = 'cod_collection';
    case COD_REFUND = 'cod_refund';
    case SHIPPING_FEE = 'shipping_fee';
    case RETURN_DEDUCTION = 'return_deduction';
    case ADJUSTMENT = 'adjustment';
    case EXPENSE = 'expense';
    case AD_SPEND = 'ad_spend';

    public function label(): string
    {
        return match ($this) {
            self::SALE => 'Sale',
            self::COD_COLLECTION => 'COD Collection',
            self::COD_REFUND => 'COD Refund',
            self::SHIPPING_FEE => 'Shipping Fee',
            self::RETURN_DEDUCTION => 'Return Deduction',
            self::ADJUSTMENT => 'Adjustment',
            self::EXPENSE => 'Expense',
            self::AD_SPEND => 'Ad Spend',
        };
    }
}
