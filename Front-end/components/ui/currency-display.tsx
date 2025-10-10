"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CurrencyDisplayProps {
  value: number | string
  currency?: 'BDT' | 'USD' | 'EUR' | 'GBP'
  symbol?: string
  locale?: string
  decimals?: number
  showSign?: boolean
  compact?: boolean
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'default' | 'success' | 'danger' | 'warning' | 'muted'
  showTooltip?: boolean
  tooltipContent?: string
  prefix?: string
  suffix?: string
}

const currencySymbols = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£'
}

const currencyLocales = {
  BDT: 'bn-BD',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB'
}

export function CurrencyDisplay({
  value,
  currency = 'BDT',
  symbol,
  locale,
  decimals = 0,
  showSign = false,
  compact = false,
  className,
  size = 'md',
  color = 'default',
  showTooltip = false,
  tooltipContent,
  prefix,
  suffix
}: CurrencyDisplayProps) {
  // Parse value to number
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value

  // Check if value is negative
  const isNegative = numValue < 0
  const absValue = Math.abs(numValue)

  // Format number
  const formatNumber = (num: number): string => {
    if (compact) {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B'
      } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
    }

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }

    const selectedLocale = locale || currencyLocales[currency] || 'en-US'
    return new Intl.NumberFormat(selectedLocale, options).format(num)
  }

  const formattedValue = formatNumber(absValue)
  const displaySymbol = symbol || currencySymbols[currency] || currency

  // Build display string
  let displayValue = formattedValue
  if (showSign && numValue > 0) {
    displayValue = '+' + displayValue
  }
  if (isNegative) {
    displayValue = '-' + displayValue
  }

  const fullDisplay = `${prefix || ''}${displaySymbol}${displayValue}${suffix || ''}`

  // Size classes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  // Color classes
  const colorClasses = {
    default: '',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    muted: 'text-muted-foreground'
  }

  const content = (
    <span className={cn(
      sizeClasses[size],
      colorClasses[color],
      isNegative && color === 'default' && 'text-red-600 dark:text-red-400',
      className
    )}>
      {fullDisplay}
    </span>
  )

  if (showTooltip) {
    const tooltip = tooltipContent || `${displaySymbol}${numValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

// Preset currency displays for common use cases
export function BDTDisplay({ value, ...props }: Omit<CurrencyDisplayProps, 'currency'>) {
  return <CurrencyDisplay value={value} currency="BDT" {...props} />
}

export function USDDisplay({ value, ...props }: Omit<CurrencyDisplayProps, 'currency'>) {
  return <CurrencyDisplay value={value} currency="USD" decimals={2} {...props} />
}

export function PercentageDisplay({
  value,
  showSign = true,
  decimals = 1,
  ...props
}: Omit<CurrencyDisplayProps, 'currency' | 'symbol' | 'suffix'>) {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
  return (
    <CurrencyDisplay
      value={value}
      symbol=""
      suffix="%"
      showSign={showSign}
      decimals={decimals}
      color={numValue > 0 ? 'success' : numValue < 0 ? 'danger' : 'default'}
      {...props}
    />
  )
}