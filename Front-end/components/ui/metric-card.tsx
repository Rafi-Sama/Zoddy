"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowRight,
  Info,
  AlertCircle
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export interface TrendConfig {
  value: number
  direction?: 'up' | 'down' | 'neutral'
  period?: string
  showIcon?: boolean
}

export interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ElementType
  trend?: TrendConfig
  description?: string
  iconColor?: string
  valueColor?: string
  size?: 'sm' | 'md' | 'lg'
  format?: 'currency' | 'number' | 'percentage' | 'custom'
  currencySymbol?: string
  progress?: {
    value: number
    max?: number
    showLabel?: boolean
    color?: string
  }
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  tooltip?: string
  className?: string
  onClick?: () => void
  loading?: boolean
  error?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  iconColor = 'text-muted-foreground',
  valueColor,
  size = 'md',
  format = 'custom',
  currencySymbol = '৳',
  progress,
  badge,
  tooltip,
  className,
  onClick,
  loading = false,
  error
}: MetricCardProps) {
  // Format value based on type
  const formatValue = (val: string | number): string => {
    if (loading) return '---'
    if (error) return 'Error'

    const numValue = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : val

    switch (format) {
      case 'currency':
        return `${currencySymbol}${numValue.toLocaleString()}`
      case 'number':
        return numValue.toLocaleString()
      case 'percentage':
        return `${numValue}%`
      default:
        return val.toString()
    }
  }

  // Get trend icon and color
  const getTrendIcon = () => {
    if (!trend) return null

    const iconClass = size === 'sm' ? 'h-2.5 w-2.5' : size === 'md' ? 'h-3 w-3' : 'h-3.5 w-3.5'

    switch (trend.direction) {
      case 'up':
        return <TrendingUp className={iconClass} />
      case 'down':
        return <TrendingDown className={iconClass} />
      default:
        return <Minus className={iconClass} />
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''

    if (trend.direction === 'up') {
      return trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }
    if (trend.direction === 'down') {
      return trend.value >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
    }
    return 'text-muted-foreground'
  }

  // Size configurations
  const sizeConfigs = {
    sm: {
      card: 'p-3',
      header: 'pb-1.5',
      title: 'text-xs',
      value: 'text-lg',
      trend: 'text-[10px]',
      icon: 'h-3.5 w-3.5',
      description: 'text-[10px]'
    },
    md: {
      card: 'p-4',
      header: 'pb-2',
      title: 'text-sm',
      value: 'text-2xl',
      trend: 'text-xs',
      icon: 'h-4 w-4',
      description: 'text-xs'
    },
    lg: {
      card: 'p-6',
      header: 'pb-3',
      title: 'text-base',
      value: 'text-3xl',
      trend: 'text-sm',
      icon: 'h-5 w-5',
      description: 'text-sm'
    }
  }

  const config = sizeConfigs[size]

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "transition-all",
          onClick && "cursor-pointer hover:shadow-md",
          loading && "opacity-60",
          error && "border-destructive",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", config.header)}>
          <div className="flex items-center gap-2">
            <CardTitle className={cn(config.title, "font-medium text-muted-foreground")}>
              {title}
            </CardTitle>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {badge && (
              <Badge variant={badge.variant as "default" | "secondary" | "destructive" | "outline" | undefined} className="ml-2 text-[10px] px-1.5 py-0">
                {badge.label}
              </Badge>
            )}
          </div>
          {Icon && (
            <Icon className={cn(config.icon, iconColor)} />
          )}
        </CardHeader>
        <CardContent className={config.card}>
          {error ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-destructive">{error}</span>
            </div>
          ) : (
            <>
              <div className={cn(config.value, "font-bold", valueColor)}>
                {formatValue(value)}
              </div>

              {trend && (
                <div className={cn("flex items-center gap-1 mt-1", config.trend, getTrendColor())}>
                  {trend.showIcon !== false && getTrendIcon()}
                  <span className="font-medium">
                    {trend.value > 0 ? '+' : ''}{trend.value}%
                  </span>
                  {trend.period && (
                    <span className="text-muted-foreground ml-1">
                      {trend.period}
                    </span>
                  )}
                </div>
              )}

              {description && (
                <p className={cn(config.description, "text-muted-foreground mt-1")}>
                  {description}
                </p>
              )}

              {progress && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {progress.showLabel && (
                      <>
                        <span>{progress.value}</span>
                        <span>{progress.max || 100}</span>
                      </>
                    )}
                  </div>
                  <Progress
                    value={(progress.value / (progress.max || 100)) * 100}
                    className={cn("h-1.5", progress.color)}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

// Preset metric cards for common use cases
export function RevenueMetricCard({
  value,
  trend,
  onClick
}: {
  value: number
  trend?: TrendConfig
  onClick?: () => void
}) {
  return (
    <MetricCard
      title="Total Revenue"
      value={value}
      icon={ArrowUp}
      iconColor="text-green-600"
      format="currency"
      trend={trend}
      onClick={onClick}
    />
  )
}

export function OrdersMetricCard({
  value,
  trend,
  onClick
}: {
  value: number
  trend?: TrendConfig
  onClick?: () => void
}) {
  return (
    <MetricCard
      title="Total Orders"
      value={value}
      icon={ArrowRight}
      iconColor="text-blue-600"
      format="number"
      trend={trend}
      onClick={onClick}
    />
  )
}

export function CustomersMetricCard({
  value,
  trend,
  onClick
}: {
  value: number
  trend?: TrendConfig
  onClick?: () => void
}) {
  return (
    <MetricCard
      title="Total Customers"
      value={value}
      icon={ArrowUp}
      iconColor="text-purple-600"
      format="number"
      trend={trend}
      onClick={onClick}
    />
  )
}

export function ConversionMetricCard({
  value,
  trend,
  onClick
}: {
  value: number
  trend?: TrendConfig
  onClick?: () => void
}) {
  return (
    <MetricCard
      title="Conversion Rate"
      value={value}
      icon={TrendingUp}
      iconColor="text-orange-600"
      format="percentage"
      trend={trend}
      onClick={onClick}
    />
  )
}