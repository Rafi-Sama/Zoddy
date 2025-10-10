"use client"

import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type VariantProps } from 'class-variance-authority'
import {
  Loader2,
  Edit,
  Trash2,
  Eye,
  Plus,
  Save,
  X,
  RefreshCw,
  Download,
  Share2,
  Copy
} from 'lucide-react'

interface ActionButtonProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof buttonVariants> {
  icon?: React.ElementType
  tooltip?: string
  loading?: boolean
  loadingText?: string
  badge?: string | number
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  iconPosition?: 'left' | 'right'
  iconClassName?: string
  children?: React.ReactNode
  asChild?: boolean
}

export function ActionButton({
  icon: Icon,
  tooltip,
  loading = false,
  loadingText = "Loading...",
  badge,
  badgeVariant = 'secondary',
  tooltipSide = 'top',
  iconPosition = 'left',
  iconClassName,
  children,
  disabled,
  className,
  variant,
  size,
  asChild,
  ...props
}: ActionButtonProps) {
  const isDisabled = disabled || loading

  const iconSizes = {
    default: 'h-4 w-4',
    sm: 'h-3.5 w-3.5',
    lg: 'h-5 w-5',
    icon: 'h-4 w-4'
  }

  const iconSize = iconSizes[size || 'default']

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className={cn(iconSize, 'animate-spin', iconClassName)} />
    }
    if (Icon) {
      return <Icon className={cn(iconSize, iconClassName)} />
    }
    return null
  }

  const renderBadge = () => {
    if (!badge) return null

    const badgeColors = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border text-foreground'
    }

    return (
      <span className={cn(
        "ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full",
        badgeColors[badgeVariant]
      )}>
        {badge}
      </span>
    )
  }

  const buttonContent = (
    <>
      {iconPosition === 'left' && renderIcon()}
      {loading && loadingText ? (
        <span className={Icon ? (iconPosition === 'left' ? 'ml-2' : 'mr-2') : ''}>
          {loadingText}
        </span>
      ) : (
        children && (
          <span className={Icon ? (iconPosition === 'left' ? 'ml-2' : 'mr-2') : ''}>
            {children}
          </span>
        )
      )}
      {iconPosition === 'right' && renderIcon()}
      {renderBadge()}
    </>
  )

  const button = (
    <Button
      disabled={isDisabled}
      className={className}
      variant={variant}
      size={size}
      asChild={asChild}
      {...props}
    >
      {buttonContent}
    </Button>
  )

  if (tooltip && !loading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

// Preset action buttons for common use cases
export function EditButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={props.children ? undefined : Edit}
      tooltip="Edit"
      variant="ghost"
      size="icon"
      {...props}
    />
  )
}

export function DeleteButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={props.children ? undefined : Trash2}
      tooltip="Delete"
      variant="ghost"
      size="icon"
      className="hover:text-destructive"
      {...props}
    />
  )
}

export function ViewButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={props.children ? undefined : Eye}
      tooltip="View"
      variant="ghost"
      size="icon"
      {...props}
    />
  )
}

export function AddButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={Plus}
      iconPosition="left"
      {...props}
    >
      {props.children || "Add"}
    </ActionButton>
  )
}

export function SaveButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={Save}
      iconPosition="left"
      {...props}
    >
      {props.children || "Save"}
    </ActionButton>
  )
}

export function CancelButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={X}
      variant="outline"
      iconPosition="left"
      {...props}
    >
      {props.children || "Cancel"}
    </ActionButton>
  )
}

export function RefreshButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={RefreshCw}
      tooltip="Refresh"
      variant="ghost"
      size="icon"
      {...props}
    />
  )
}

export function DownloadButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={Download}
      tooltip="Download"
      variant="ghost"
      size="icon"
      {...props}
    />
  )
}

export function ShareButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={Share2}
      tooltip="Share"
      variant="ghost"
      size="icon"
      {...props}
    />
  )
}

export function CopyButton(props: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton
      icon={Copy}
      tooltip="Copy"
      variant="ghost"
      size="icon"
      {...props}
    />
  )
}