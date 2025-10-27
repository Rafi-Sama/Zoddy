"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import GridLayout, { Layout } from "react-grid-layout"
import { Widget } from "@/types/dashboard"
import { WidgetFactory } from "./widget-factory"
import { Button } from "@/components/ui/button"
import { X, GripVertical } from "lucide-react"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "@/styles/dashboard-grid.css"

interface DashboardGridFixedProps {
  widgets: Widget[]
  onLayoutChange: (widgets: Widget[]) => void
  onRemoveWidget: (id: string) => void
  isEditMode?: boolean
}

export function DashboardGridFixed({
  widgets,
  onLayoutChange,
  onRemoveWidget,
  isEditMode = false
}: DashboardGridFixedProps) {
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate width after mount with debouncing for performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width
        setContainerWidth(width)
        setIsMobile(window.innerWidth < 768)
      }
    }

    // Debounced resize handler for better performance
    const debouncedUpdateWidth = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateWidth, 150)
    }

    setMounted(true)

    // Single initialization with requestAnimationFrame
    requestAnimationFrame(updateWidth)

    // Efficient resize handling with debounce
    window.addEventListener('resize', debouncedUpdateWidth)

    // Optimized ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateWidth, 100)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedUpdateWidth)
      resizeObserver.disconnect()
    }
  }, [])

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    if (!isDragging) return;

    const updatedWidgets = widgets.map(widget => {
      const layoutItem = layout.find(l => l.i === widget.id)
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: widget.w, // Keep original width
          h: widget.h  // Keep original height
        }
      }
      return widget
    })
    onLayoutChange(updatedWidgets)
  }, [widgets, onLayoutChange, isDragging])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragStop = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mobile layout - vertical stack
  if (isMobile && mounted) {
    return (
      <div ref={containerRef} className="w-full space-y-3">
        {widgets.map(widget => (
          <div key={widget.id} className="relative">
            {isEditMode && !widget.static && (
              <div className="absolute top-2 right-2 z-10 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6"
                  title="Drag to move"
                  disabled
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
            <div className="w-full">
              <WidgetFactory type={widget.type} data={widget.data} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Don't render grid until we have container width
  if (!mounted || containerWidth === null) {
    return (
      <div ref={containerRef} className="min-h-[600px] w-full">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-12">
          {widgets.map(widget => (
            <div
              key={widget.id}
              className="relative col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3"
              style={{
                minHeight: `${Math.min(widget.h * 90, 200)}px`
              }}
            >
              <WidgetFactory type={widget.type} data={widget.data} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-[600px] w-full">
      <GridLayout
        className="layout"
        layout={widgets.map(w => ({
          i: w.id,
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h,
          static: w.static || !isEditMode,
          isDraggable: isEditMode && !w.static,
          isResizable: false // Never allow resizing
        }))}
        cols={12}
        rowHeight={90}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        isDraggable={isEditMode}
        isResizable={false} // Disable resizing completely
        compactType={null} // Disable automatic compaction
        preventCollision={true} // Prevent widgets from pushing others
        draggableHandle=".drag-handle"
        useCSSTransforms={true}
        transformScale={1}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        autoSize={true}
      >
        {widgets.map(widget => (
          <div key={widget.id} className="relative group">
            {isEditMode && !widget.static && (
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6 drag-handle cursor-move touch-none"
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
    </div>
  )
}