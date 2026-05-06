"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronRight, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  description?: string
  badge?: string | number
}

interface SettingsNavigationProps {
  items: NavigationItem[]
  activeSection: string
  onSectionChange: (section: string) => void
  title?: string
  className?: string
}

export function SettingsNavigation({
  items,
  activeSection,
  onSectionChange,
  title = "Settings",
  className
}: SettingsNavigationProps) {
  return (
    <Card className={cn("lg:h-full", className)}>
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <nav className="flex lg:flex-col overflow-x-auto lg:space-y-1 gap-2 lg:gap-0 pb-2 lg:pb-0">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-2 lg:gap-3 px-3 py-2.5 text-sm rounded-md transition-colors whitespace-nowrap lg:w-full",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <div className="text-left flex-1">
                <span className="font-medium hidden sm:block">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs hidden lg:block opacity-70">
                    {item.description}
                  </span>
                )}
              </div>
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-xs font-medium rounded-full bg-primary/20">
                  {item.badge}
                </span>
              )}
              {activeSection === item.id && (
                <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:inline" />
              )}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}
