"use client"

import { useState, useCallback, useEffect } from "react"
import GridLayout, { Layout } from "react-grid-layout"
import { Widget } from "@/types/dashboard"
import { WidgetFactory } from "./widget-factory"
import { Button } from "@/components/ui/button"
import { X, GripVertical } from "lucide-react"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "@/styles/dashboard-grid.css"

interface DashboardGridProps {
  widgets: Widget[]
  onLayoutChange: (widgets: Widget[]) => void
  onRemoveWidget: (id: string) => void
  isEditMode?: boolean
}

export function DashboardGrid({
  widgets,
  onLayoutChange,
  onRemoveWidget,
  isEditMode = false
}: DashboardGridProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    const updatedWidgets = widgets.map(widget => {
      const layoutItem = layout.find(l => l.i === widget.id)
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h
        }
      }
      return widget
    })
    onLayoutChange(updatedWidgets)
  }, [widgets, onLayoutChange])


  if (!mounted) {
    return (
      <div className="grid gap-3 lg:grid-cols-12">
        {widgets.map(widget => (
          <div
            key={widget.id}
            className="relative"
            style={{
              gridColumn: `span ${widget.w}`,
              gridRow: `span ${widget.h}`
            }}
          >
            <WidgetFactory type={widget.type} data={widget.data} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <GridLayout
      className="layout"
      layout={widgets.map(w => ({
        i: w.id,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        static: w.static,
        isDraggable: w.isDraggable !== false && !w.static,
        isResizable: false
      }))}
      cols={12}
      rowHeight={80}
      width={1200}
      onLayoutChange={handleLayoutChange}
      isDraggable={isEditMode}
      isResizable={false}
      compactType="vertical"
      preventCollision={false}
      draggableHandle=".drag-handle"
      useCSSTransforms={true}
      transformScale={1}
      margin={[12, 12]}
    >
      {widgets.map(widget => (
        <div key={widget.id} className="relative group">
          {isEditMode && !widget.static && (
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 drag-handle cursor-move"
                title="Drag to move"
              >
                <GripVertical className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveWidget(widget.id)}
                title="Remove widget"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="h-full">
            <WidgetFactory type={widget.type} data={widget.data} />
          </div>
        </div>
      ))}
    </GridLayout>
  )
}