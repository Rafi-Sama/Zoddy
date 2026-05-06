"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToggleItem {
  key: string
  label: string
  description?: string
  icon?: LucideIcon
  disabled?: boolean
}

interface ToggleListProps {
  title?: string
  items: ToggleItem[]
  values: Record<string, boolean>
  onToggle: (key: string, value: boolean) => void
  className?: string
  compact?: boolean
}

export function ToggleList({
  title,
  items,
  values,
  onToggle,
  className,
  compact = false
}: ToggleListProps) {
  const content = (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      {items.map((item) => (
        <div
          key={item.key}
          className={cn(
            "flex items-center justify-between",
            compact ? "py-1" : "py-1.5",
            item.description && "items-start"
          )}
        >
          <div className="flex items-center gap-2.5 flex-1">
            {item.icon && (
              <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <div className="flex-1">
              <Label
                className={cn(
                  "cursor-pointer",
                  compact ? "text-sm font-normal" : "text-sm font-normal"
                )}
              >
                {item.label}
              </Label>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </div>
          <Switch
            checked={values[item.key] || false}
            onCheckedChange={(checked) => onToggle(item.key, checked)}
            disabled={item.disabled}
            className="shrink-0"
          />
        </div>
      ))}
    </div>
  )

  if (title) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    )
  }

  return <div className={className}>{content}</div>
}
