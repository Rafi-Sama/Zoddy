"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StockMetric {
  id: string
  name: string
  sku?: string
  currentStock: number
  reorderLevel?: number
  action?: () => void
  actionLabel?: string
}

interface StockMetricsCardProps {
  title: string
  description?: string
  icon: LucideIcon
  value: number | string
  metrics?: StockMetric[]
  variant?: 'default' | 'warning' | 'danger' | 'success'
  gridSpan?: string
  className?: string
  onDismiss?: (id: string) => void
}

const variantStyles = {
  default: {
    iconColor: 'text-muted-foreground',
    titleColor: '',
    valueColor: ''
  },
  warning: {
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-600',
    valueColor: 'text-yellow-600'
  },
  danger: {
    iconColor: 'text-red-600',
    titleColor: 'text-red-600',
    valueColor: 'text-red-600'
  },
  success: {
    iconColor: 'text-green-600',
    titleColor: 'text-green-600',
    valueColor: 'text-green-600'
  }
}

export function StockMetricsCard({
  title,
  description,
  icon: Icon,
  value,
  metrics,
  variant = 'default',
  gridSpan,
  className,
  onDismiss
}: StockMetricsCardProps) {
  const styles = variantStyles[variant]

  // Simple metric card without list
  if (!metrics || metrics.length === 0) {
    return (
      <Card className={cn(gridSpan, className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <CardTitle className="text-xs font-medium">{title}</CardTitle>
          <Icon className={cn("h-2.5 w-2.5", styles.iconColor)} />
        </CardHeader>
        <CardContent>
          <div className={cn("text-lg font-bold", styles.valueColor)}>
            {typeof value === 'number' && value >= 0 ? value.toLocaleString() : value}
          </div>
          {description && (
            <p className="text-[10px] text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Full card with metrics list
  return (
    <Card className={cn(gridSpan, className)}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-1.5 text-sm", styles.titleColor)}>
          <Icon className="h-3.5 w-3.5" />
          {title} ({metrics.length})
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-1.5 max-h-[280px] overflow-y-auto">
        {metrics.length > 0 ? (
          <TooltipProvider>
            {metrics.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-1.5 border rounded">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs truncate">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {item.currentStock} left
                    {item.reorderLevel && ` (reorder at ${item.reorderLevel})`}
                  </div>
                </div>
                {item.action && item.actionLabel && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          "h-6 text-[10px] px-2 ml-2 flex-shrink-0",
                          variant === 'danger' && "bg-red-600 hover:bg-red-700"
                        )}
                        variant={variant === 'danger' ? 'default' : 'outline'}
                        onClick={() => {
                          item.action?.()
                          onDismiss?.(item.id)
                        }}
                      >
                        {item.actionLabel}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Done</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </TooltipProvider>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">
            {variant === 'warning' ? 'All items have healthy stock levels' : 'No items'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
