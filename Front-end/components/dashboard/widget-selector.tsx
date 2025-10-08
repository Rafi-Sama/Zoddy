"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { WIDGET_DEFINITIONS, WidgetType } from "@/types/dashboard"
import {
  Plus,
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  CreditCard,
  Package,
  Star,
  Users,
  BarChart3,
  PieChart,
  Layers
} from "lucide-react"

const WIDGET_ICONS: Record<WidgetType, React.ReactNode> = {
  revenue: <DollarSign className="h-4 w-4" />,
  orders: <ShoppingCart className="h-4 w-4" />,
  'conversion-rate': <TrendingUp className="h-4 w-4" />,
  'sales-category': <PieChart className="h-4 w-4" />,
  'pending-payments': <Clock className="h-4 w-4" />,
  'low-stock': <AlertTriangle className="h-4 w-4" />,
  insights: <BarChart3 className="h-4 w-4" />,
  'revenue-chart': <TrendingUp className="h-4 w-4" />,
  'recent-activity': <Activity className="h-4 w-4" />,
  'cash-flow': <CreditCard className="h-4 w-4" />,
  'top-product': <Package className="h-4 w-4" />,
  'time-saved': <Clock className="h-4 w-4" />,
  'best-customer': <Star className="h-4 w-4" />,
  'retention-alert': <Users className="h-4 w-4" />,
  'quick-actions': <Layers className="h-4 w-4" />,
  custom: <PieChart className="h-4 w-4" />
}

const WIDGET_CATEGORIES = {
  'Key Metrics': ['revenue', 'orders', 'conversion-rate', 'pending-payments', 'low-stock'],
  'Analytics': ['insights', 'revenue-chart', 'sales-category', 'cash-flow'],
  'Activity': ['recent-activity', 'top-product'],
  'Alerts': ['retention-alert'],
  'Actions': ['quick-actions'],
  'Custom': ['custom']
}

interface WidgetSelectorProps {
  onAddWidget: (type: WidgetType) => void
  existingWidgets: WidgetType[]
}

export function WidgetSelector({ onAddWidget, existingWidgets }: WidgetSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleAddWidget = (type: WidgetType) => {
    onAddWidget(type)
    setOpen(false)
  }

  const isWidgetAdded = (type: WidgetType) => {
    // Allow multiple custom widgets
    if (type === 'custom') return false
    return existingWidgets.includes(type)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title="Add Dashboard Widget"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Dashboard Widget</DialogTitle>
          <DialogDescription>
            Select a widget to add to your dashboard. You can drag and resize them after adding.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {Object.entries(WIDGET_CATEGORIES).map(([category, widgets]) => (
              <div key={category}>
                <h3 className="text-sm font-medium mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {widgets.map((widgetType) => {
                    const widget = WIDGET_DEFINITIONS[widgetType as WidgetType]
                    const added = isWidgetAdded(widgetType as WidgetType)

                    return (
                      <Button
                        key={widgetType}
                        variant="outline"
                        className="h-auto p-4 justify-start relative"
                        onClick={() => handleAddWidget(widgetType as WidgetType)}
                        disabled={added}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="mt-0.5">
                            {WIDGET_ICONS[widgetType as WidgetType]}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">{widget.title}</div>
                            {widget.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {widget.description}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary" className="text-[10px]">
                                {widget.w}x{widget.h}
                              </Badge>
                              {added && (
                                <Badge variant="default" className="text-[10px]">
                                  Added
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}