"use client"

import React, { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ActionButton } from '@/components/ui/action-button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  Upload,
  Download,
  Plus,
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ElementType
}

export interface PageAction {
  label: string
  onClick?: () => void
  href?: string
  icon?: React.ElementType
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  primary?: boolean
  loading?: boolean
  disabled?: boolean
  tooltip?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ElementType
  breadcrumbs?: BreadcrumbItem[]
  actions?: PageAction[]
  moreActions?: PageAction[]
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  tabs?: ReactNode
  children?: ReactNode
  className?: string
  separator?: boolean
  compact?: boolean
  sticky?: boolean
  maxActionsVisible?: number
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions = [],
  moreActions = [],
  badge,
  tabs,
  children,
  className,
  separator = true,
  compact = false,
  sticky = false,
  maxActionsVisible = 3
}: PageHeaderProps) {
  // Determine which actions to show and which to put in dropdown
  const visibleActions = actions.slice(0, maxActionsVisible)
  const overflowActions = [...actions.slice(maxActionsVisible), ...moreActions]

  const renderAction = (action: PageAction, index: number) => {
    const ActionIcon = action.icon

    if (action.href) {
      return (
        <a key={index} href={action.href}>
          <Button
            variant={action.primary ? 'default' : action.variant || 'outline'}
            size={compact ? 'sm' : 'default'}
            disabled={action.disabled}
            className={compact ? 'h-8' : 'h-9'}
          >
            {ActionIcon && <ActionIcon className={cn("mr-2", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />}
            {action.label}
          </Button>
        </a>
      )
    }

    return (
      <ActionButton
        key={index}
        variant={action.primary ? 'default' : action.variant || 'outline'}
        size={compact ? 'sm' : 'default'}
        onClick={action.onClick}
        icon={ActionIcon}
        loading={action.loading}
        disabled={action.disabled}
        tooltip={action.tooltip}
        className={compact ? 'h-8' : 'h-9'}
      >
        {action.label}
      </ActionButton>
    )
  }

  return (
    <div className={cn(
      "bg-background",
      sticky && "sticky top-0 z-10",
      className
    )}>
      <div className={cn(
        "space-y-3",
        compact ? "py-3 px-4" : "py-4 px-6"
      )}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const ItemIcon = item.icon
                const isLast = index === breadcrumbs.length - 1

                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="flex items-center gap-1.5">
                          {ItemIcon && <ItemIcon className="h-3.5 w-3.5" />}
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href} className="flex items-center gap-1.5">
                          {ItemIcon && <ItemIcon className="h-3.5 w-3.5" />}
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Main header content */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon className={cn(
                  "text-muted-foreground",
                  compact ? "h-5 w-5" : "h-6 w-6"
                )} />
              )}
              <h1 className={cn(
                "font-semibold",
                compact ? "text-lg" : "text-2xl"
              )}>
                {title}
              </h1>
              {badge && (
                <Badge variant={badge.variant as "default" | "secondary" | "destructive" | "outline" | undefined}>
                  {badge.label}
                </Badge>
              )}
            </div>
            {description && (
              <p className={cn(
                "text-muted-foreground",
                compact ? "text-xs" : "text-sm"
              )}>
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          {(visibleActions.length > 0 || overflowActions.length > 0) && (
            <div className="flex items-center gap-2">
              {visibleActions.map(renderAction)}

              {overflowActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={compact ? "h-8 w-8" : "h-9 w-9"}
                    >
                      <MoreHorizontal className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {overflowActions.map((action, index) => {
                      const ActionIcon = action.icon
                      return (
                        <DropdownMenuItem
                          key={index}
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className={action.variant === 'destructive' ? 'text-destructive' : ''}
                        >
                          {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                          {action.label}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        {/* Custom children content */}
        {children}

        {/* Tabs */}
        {tabs}
      </div>

      {/* Separator */}
      {separator && <Separator />}
    </div>
  )
}

// Preset page headers for common use cases
export function ListPageHeader({
  title,
  description,
  onAdd,
  onImport,
  onExport,
  additionalActions = [],
  ...props
}: {
  title: string
  description?: string
  onAdd?: () => void
  onImport?: () => void
  onExport?: () => void
  additionalActions?: PageAction[]
} & Omit<PageHeaderProps, 'actions' | 'title' | 'description'>) {
  const actions: PageAction[] = [
    ...additionalActions,
    ...(onImport ? [{
      label: 'Import',
      onClick: onImport,
      icon: Upload,
      variant: 'outline' as const
    }] : []),
    ...(onExport ? [{
      label: 'Export',
      onClick: onExport,
      icon: Download,
      variant: 'outline' as const
    }] : []),
    ...(onAdd ? [{
      label: 'Add New',
      onClick: onAdd,
      icon: Plus,
      primary: true
    }] : [])
  ]

  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      {...props}
    />
  )
}

export function DetailPageHeader({
  title,
  description,
  onEdit,
  onDelete,
  onBack,
  additionalActions = [],
  ...props
}: {
  title: string
  description?: string
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
  additionalActions?: PageAction[]
} & Omit<PageHeaderProps, 'actions' | 'title' | 'description'>) {
  const actions: PageAction[] = [
    ...(onBack ? [{
      label: 'Back',
      onClick: onBack,
      icon: ArrowLeft,
      variant: 'ghost' as const
    }] : []),
    ...additionalActions,
    ...(onEdit ? [{
      label: 'Edit',
      onClick: onEdit,
      icon: Edit,
      variant: 'outline' as const
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      onClick: onDelete,
      icon: Trash2,
      variant: 'destructive' as const
    }] : [])
  ]

  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      {...props}
    />
  )
}