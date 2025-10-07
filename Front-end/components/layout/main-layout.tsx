"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarEnhanced } from "@/components/navigation/app-sidebar-enhanced"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "@/components/notifications"
import { CalendarWidget } from "@/components/calendar-widget"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
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
            <CalendarWidget />
            <Notifications />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-3 p-3 pt-0">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}