"use client"

import { useState, useEffect, useCallback } from "react"
import { MainLayoutDashboard } from "@/components/layout/main-layout-dashboard"
import { DashboardGridFixed } from "@/components/dashboard/dashboard-grid-fixed"
import { Widget, WidgetType, WIDGET_DEFINITIONS } from "@/types/dashboard"
import { findOptimalPosition, resolveOverlaps, adjustToGridBounds } from "@/lib/dashboard-utils"
import { v4 as uuidv4 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"

// Default layout configuration
const DEFAULT_WIDGETS: Widget[] = [
  {
    id: "revenue-1",
    type: "revenue",
    title: "Total Revenue",
    x: 0,
    y: 0,
    w: 3,
    h: 2
  },
  {
    id: "orders-1",
    type: "orders",
    title: "Orders",
    x: 3,
    y: 0,
    w: 3,
    h: 2
  },
  {
    id: "pending-payments-1",
    type: "pending-payments",
    title: "Pending Payments",
    x: 6,
    y: 0,
    w: 3,
    h: 2
  },
  {
    id: "low-stock-1",
    type: "low-stock",
    title: "Low Stock Alert",
    x: 9,
    y: 0,
    w: 3,
    h: 2
  },
  {
    id: "quick-actions-1",
    type: "quick-actions",
    title: "Quick Actions",
    x: 0,
    y: 2,
    w: 12,
    h: 1,
    static: true
  },
  {
    id: "insights-1",
    type: "insights",
    title: "Business Insights",
    description: "Your day-1 ROI dashboard",
    x: 0,
    y: 3,
    w: 6,
    h: 3
  },
  {
    id: "recent-activity-1",
    type: "recent-activity",
    title: "Recent Activity",
    description: "Last 5 orders",
    x: 9,
    y: 3,
    w: 3,
    h: 4
  },
  {
    id: "revenue-chart-1",
    type: "revenue-chart",
    title: "Revenue Trend",
    description: "Daily revenue for the last 30 days",
    x: 0,
    y: 6,
    w: 6,
    h: 4
  },
  {
    id: "cash-flow-1",
    type: "cash-flow",
    title: "Cash Flow Forecast",
    description: "Your real wealth calculation",
    x: 6,
    y: 3,
    w: 3,
    h: 3
  },
  {
    id: "top-product-1",
    type: "top-product",
    title: "Top Product",
    x: 6,
    y: 6,
    w: 3,
    h: 2
  }
]

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [savedWidgets, setSavedWidgets] = useState<Widget[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load widgets from localStorage on mount
  useEffect(() => {
    const loadWidgets = () => {
      const stored = localStorage.getItem('dashboardWidgets')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setWidgets(parsed)
          setSavedWidgets(parsed)
        } catch (e) {
          console.error('Failed to load dashboard layout:', e)
          setWidgets(DEFAULT_WIDGETS)
          setSavedWidgets(DEFAULT_WIDGETS)
        }
      } else {
        setWidgets(DEFAULT_WIDGETS)
        setSavedWidgets(DEFAULT_WIDGETS)
      }
    }

    loadWidgets()
  }, [])

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(widgets) !== JSON.stringify(savedWidgets)
    setHasUnsavedChanges(hasChanges)
  }, [widgets, savedWidgets])

  const handleAddWidget = useCallback((type: WidgetType) => {
    const definition = WIDGET_DEFINITIONS[type]
    if (!definition) return

    // Find optimal position for the new widget
    const { x, y } = findOptimalPosition(
      widgets,
      definition.w || 3,
      definition.h || 2
    )

    const newWidget: Widget = {
      id: `${type}-${uuidv4()}`,
      type,
      title: definition.title!,
      description: definition.description,
      x,
      y,
      w: definition.w || 3,
      h: definition.h || 2,
      static: definition.static
    }

    // Add widget and resolve any potential overlaps
    const updatedWidgets = resolveOverlaps([...widgets, newWidget])
    setWidgets(updatedWidgets)
  }, [widgets])

  const handleLayoutChange = useCallback((updatedWidgets: Widget[]) => {
    // Ensure all widgets are within bounds and not overlapping
    const adjustedWidgets = updatedWidgets.map(w => adjustToGridBounds(w))
    setWidgets(adjustedWidgets)
  }, [])

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id))
  }, [])

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev)
  }, [])

  const handleSaveLayout = useCallback(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets))
    setSavedWidgets(widgets)
    setHasUnsavedChanges(false)
  }, [widgets])

  const handleResetLayout = useCallback(() => {
    const confirmReset = window.confirm('Are you sure you want to reset to the default layout? This will remove all customizations.')
    if (confirmReset) {
      setWidgets(DEFAULT_WIDGETS)
      setSavedWidgets(DEFAULT_WIDGETS)
      localStorage.setItem('dashboardWidgets', JSON.stringify(DEFAULT_WIDGETS))
      setIsEditMode(false)
    }
  }, [])

  return (
    <MainLayoutDashboard
      breadcrumbs={[{ label: "Dashboard" }]}
      onAddWidget={handleAddWidget}
      existingWidgets={widgets.map(w => w.type)}
      isEditMode={isEditMode}
      onToggleEditMode={handleToggleEditMode}
      onSaveLayout={handleSaveLayout}
      onResetLayout={handleResetLayout}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {isEditMode && (
        <div className="bg-muted/50 border border-dashed rounded-lg p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            <span className="hidden sm:inline">Edit Mode: Drag widgets to reorder • Click X to remove • Click Save when done</span>
            <span className="sm:hidden">Edit Mode: Drag to reorder, X to remove</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            {hasUnsavedChanges && (
              <Button
                variant="default"
                size="sm"
                className="h-7 px-2 gap-1"
                onClick={handleSaveLayout}
              >
                <Save className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1"
              onClick={handleResetLayout}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        <DashboardGridFixed
          widgets={widgets}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={handleRemoveWidget}
          isEditMode={isEditMode}
        />
      </div>
    </MainLayoutDashboard>
  )
}