"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
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
  Layers,
  Check,
  MousePointer
} from "lucide-react"

const WIDGET_ICONS: Record<WidgetType, React.ReactNode> = {
  revenue: <DollarSign className="h-3.5 w-3.5" />,
  orders: <ShoppingCart className="h-3.5 w-3.5" />,
  'conversion-rate': <MousePointer className="h-3.5 w-3.5" />,
  'sales-category': <PieChart className="h-3.5 w-3.5" />,
  'pending-payments': <Clock className="h-3.5 w-3.5" />,
  'low-stock': <AlertTriangle className="h-3.5 w-3.5" />,
  insights: <BarChart3 className="h-3.5 w-3.5" />,
  'revenue-chart': <TrendingUp className="h-3.5 w-3.5" />,
  'recent-activity': <Activity className="h-3.5 w-3.5" />,
  'cash-flow': <CreditCard className="h-3.5 w-3.5" />,
  'top-product': <Package className="h-3.5 w-3.5" />,
  'time-saved': <Clock className="h-3.5 w-3.5" />,
  'best-customer': <Star className="h-3.5 w-3.5" />,
  'retention-alert': <Users className="h-3.5 w-3.5" />,
  'quick-actions': <Layers className="h-3.5 w-3.5" />,
  custom: <PieChart className="h-3.5 w-3.5" />
}

const WIDGET_CATEGORIES = {
  'Key Metrics': ['revenue', 'orders', 'conversion-rate', 'pending-payments', 'low-stock'],
  'Analytics': ['insights', 'revenue-chart', 'sales-category', 'cash-flow'],
  'Activity': ['recent-activity', 'top-product'],
  'Alerts': ['retention-alert'],
  'Actions': ['quick-actions'],
  'Custom': ['custom']
}

interface WidgetSelectorDropdownProps {
  onAddWidget: (type: WidgetType) => void
  existingWidgets: WidgetType[]
}

export function WidgetSelectorDropdown({ onAddWidget, existingWidgets }: WidgetSelectorDropdownProps) {
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

  // Get available widgets count
  const availableCount = Object.values(WIDGET_CATEGORIES)
    .flat()
    .filter(w => !isWidgetAdded(w as WidgetType)).length

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 relative"
          title="Add Dashboard Widget"
        >
          <Plus className="h-4 w-4" />
          {availableCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full text-[8px] flex items-center justify-center font-bold">
              {availableCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] max-h-[500px] overflow-y-auto">
        <DropdownMenuLabel className="font-normal">
          <div>
            <div className="text-sm font-medium">Add Widget</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Choose a widget to add to your dashboard
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {Object.entries(WIDGET_CATEGORIES).map(([category, widgets]) => {
          const hasAvailable = widgets.some(w => !isWidgetAdded(w as WidgetType))

          if (!hasAvailable && category !== 'Custom') return null

          return (
            <DropdownMenuSub key={category}>
              <DropdownMenuSubTrigger className="text-xs">
                <span className="flex-1">{category}</span>
                <Badge variant="secondary" className="ml-2 h-4 px-1 text-[10px]">
                  {widgets.filter(w => !isWidgetAdded(w as WidgetType)).length}
                </Badge>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[240px]">
                {widgets.map((widgetType) => {
                  const widget = WIDGET_DEFINITIONS[widgetType as WidgetType]
                  const added = isWidgetAdded(widgetType as WidgetType)

                  return (
                    <DropdownMenuItem
                      key={widgetType}
                      onClick={() => !added && handleAddWidget(widgetType as WidgetType)}
                      disabled={added}
                      className="flex items-start gap-2 py-2 cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {WIDGET_ICONS[widgetType as WidgetType]}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium">{widget.title}</div>
                        {widget.description && (
                          <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            {widget.description}
                          </div>
                        )}
                      </div>
                      {added && (
                        <Check className="h-3 w-3 text-muted-foreground" />
                      )}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        })}

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="text-[10px] text-muted-foreground">
            Tip: Drag widgets to reorder them
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}