"use client"

import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { X, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface DetailsSection {
  id?: string
  title?: string
  content: ReactNode
  icon?: React.ElementType
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface DetailsAction {
  label: string
  onClick: () => void
  icon?: React.ElementType
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
}

export interface DetailsTab {
  id: string
  label: string
  icon?: React.ElementType
  content: ReactNode
  badge?: string | number
}

interface DetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  sections?: DetailsSection[]
  tabs?: DetailsTab[]
  actions?: DetailsAction[]
  moreActions?: DetailsAction[]
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  type?: 'dialog' | 'sheet'
  position?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  contentClassName?: string
  showCloseButton?: boolean
  footer?: ReactNode
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

export function DetailsModal({
  open,
  onOpenChange,
  title,
  description,
  sections = [],
  tabs = [],
  actions = [],
  moreActions = [],
  size = 'lg',
  type = 'dialog',
  position = 'right',
  className,
  contentClassName,
  showCloseButton = true,
  footer,
  badge
}: DetailsModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  }

  const sheetSizeClasses = {
    sm: 'w-[400px] sm:w-[540px]',
    md: 'w-[500px] sm:w-[640px]',
    lg: 'w-[600px] sm:w-[740px]',
    xl: 'w-[800px] sm:w-[940px]',
    full: 'w-screen'
  }

  const renderHeader = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {badge && (
            <Badge variant={badge.variant as "default" | "secondary" | "destructive" | "outline" | undefined}>
              {badge.label}
            </Badge>
          )}
        </div>
        {showCloseButton && type === 'dialog' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </>
  )

  const renderActions = () => {
    if (actions.length === 0 && moreActions.length === 0) return null

    return (
      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className="h-9"
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {action.loading ? 'Loading...' : action.label}
            </Button>
          )
        })}

        {moreActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }

  const renderContent = () => {
    if (tabs.length > 0) {
      return (
        <Tabs defaultValue={tabs[0].id} className="flex-1">
          <TabsList className="w-full justify-start">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
                  {tab.badge && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1">
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      )
    }

    if (sections.length > 0) {
      return (
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={section.id || index}>
                {section.title && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                      <h3 className="text-sm font-medium">{section.title}</h3>
                    </div>
                    <Separator className="mb-3" />
                  </>
                )}
                <div className={cn(contentClassName)}>
                  {section.content}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  if (type === 'sheet') {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={position as 'left' | 'right' | 'top' | 'bottom'}
          className={cn(sheetSizeClasses[size], className)}
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>

          <ScrollArea className="flex-1 py-4 -mx-6 px-6">
            {renderContent()}
          </ScrollArea>

          {(footer || actions.length > 0) && (
            <SheetFooter className="mt-6">
              {footer || renderActions()}
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], "max-h-[90vh] flex flex-col", className)}>
        <DialogHeader>
          <DialogTitle asChild>
            {renderHeader()}
          </DialogTitle>
          {description && !badge && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 py-4">
          {renderContent()}
        </ScrollArea>

        {(footer || actions.length > 0) && (
          <DialogFooter>
            {footer || renderActions()}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper component for common detail layouts
export function DetailField({
  label,
  value,
  icon: Icon,
  className
}: {
  label: string
  value: ReactNode
  icon?: React.ElementType
  className?: string
}) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium">{value || '-'}</div>
    </div>
  )
}

export function DetailGrid({
  children,
  columns = 2,
  className
}: {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(`grid gap-4 ${gridCols[columns]}`, className)}>
      {children}
    </div>
  )
}