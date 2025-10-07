"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarEnhanced } from "@/components/navigation/app-sidebar-enhanced"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "@/components/notifications"
import { CalendarWidget } from "@/components/calendar-widget"
import { WidgetSelectorDropdown } from "@/components/dashboard/widget-selector-dropdown"
import { Button } from "@/components/ui/button"
import { Settings2, Save, RotateCcw } from "lucide-react"
import { WidgetType } from "@/types/dashboard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface MainLayoutDashboardProps {
  children: React.ReactNode
  breadcrumbs?: {
    label: string
    href?: string
  }[]
  onAddWidget?: (type: WidgetType) => void
  existingWidgets?: WidgetType[]
  isEditMode?: boolean
  onToggleEditMode?: () => void
  onSaveLayout?: () => void
  onResetLayout?: () => void
  hasUnsavedChanges?: boolean
}

export function MainLayoutDashboard({
  children,
  breadcrumbs,
  onAddWidget,
  existingWidgets = [],
  isEditMode = false,
  onToggleEditMode,
  onSaveLayout,
  onResetLayout,
  hasUnsavedChanges = false
}: MainLayoutDashboardProps) {
  return (
    <SidebarProvider>
      <AppSidebarEnhanced />
      <main className="flex-1 overflow-auto">
        <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-2 px-3 flex-1">
            <SidebarTrigger className="-ml-1 h-7 w-7" />
            <Separator orientation="vertical" className="mr-1.5 h-3.5" />
            {breadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbItem className="hidden md:block text-xs">
                        {breadcrumb.href ? (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          <div className="flex items-center gap-1 px-3">
            {/* Dashboard Controls - Only show on dashboard page */}
            {onAddWidget && (
              <>
                <WidgetSelectorDropdown
                  onAddWidget={onAddWidget}
                  existingWidgets={existingWidgets}
                />
                <Button
                  variant={isEditMode ? "default" : "ghost"}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={onToggleEditMode}
                  title={isEditMode ? "Exit edit mode" : "Edit dashboard layout"}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
                {isEditMode && (
                  <>
                    {hasUnsavedChanges && (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-7 px-2 gap-1"
                        onClick={onSaveLayout}
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 gap-1"
                      onClick={onResetLayout}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </Button>
                  </>
                )}
                <Separator orientation="vertical" className="mx-1.5 h-3.5" />
              </>
            )}
            <CalendarWidget />
            <Notifications />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-3 p-3 pt-0 w-full max-w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}