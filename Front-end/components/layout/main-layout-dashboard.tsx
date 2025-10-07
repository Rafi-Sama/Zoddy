"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarEnhanced } from "@/components/navigation/app-sidebar-enhanced"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "@/components/notifications"
import { CalendarWidget } from "@/components/calendar-widget"
import { WidgetSelectorDropdown } from "@/components/dashboard/widget-selector-dropdown"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
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
  onToggleEditMode
}: MainLayoutDashboardProps) {
  return (
    <SidebarProvider>
      <AppSidebarEnhanced />
      <main className="flex-1 overflow-auto">
        <header className="flex h-12 md:h-12 shrink-0 items-center gap-1 md:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 flex-1 min-w-0">
            <SidebarTrigger className="-ml-1 h-7 w-7 flex-shrink-0" />
            <Separator orientation="vertical" className="mr-1 md:mr-1.5 h-3.5 hidden sm:block" />
            {breadcrumbs && (
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbItem className="text-xs">
                        {breadcrumb.href ? (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
            {/* Mobile breadcrumb - show only current page */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <span className="sm:hidden text-xs font-medium truncate">
                {breadcrumbs[breadcrumbs.length - 1].label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 md:gap-1 px-2 md:px-3">
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
                  <Settings2 className="h-3.5 md:h-4 w-3.5 md:w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-0.5 md:mx-1.5 h-3.5 hidden sm:block" />
              </>
            )}
            <div className="hidden sm:flex items-center gap-0.5 md:gap-1">
              <CalendarWidget />
              <Notifications />
            </div>
            <ThemeToggle />
            {/* Mobile menu for Calendar and Notifications */}
            <div className="sm:hidden flex items-center">
              <Notifications />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 md:gap-3 p-2 md:p-3 pt-0 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}