"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Pause,
  PlayCircle,
  Archive,
  CreditCard,
  CheckSquare,
  RefreshCw,
  User,
  UserCheck,
  UserX,
  Star,
  Truck,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusType = 'order' | 'payment' | 'stock' | 'customer' | 'campaign' | 'notification'

interface StatusConfig {
  label: string
  color: string
  icon?: React.ElementType
}

const statusConfigs: Record<StatusType, Record<string, StatusConfig>> = {
  order: {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
    returned: { label: 'Returned', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: RefreshCw },
    on_hold: { label: 'On Hold', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', icon: Pause },
  },
  payment: {
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle2 },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
    partial: { label: 'Partial', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', icon: CreditCard },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
    refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: RefreshCw },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: AlertCircle },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckSquare },
  },
  stock: {
    in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle2 },
    low_stock: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: AlertCircle },
    out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
    discontinued: { label: 'Discontinued', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: Archive },
    reordering: { label: 'Reordering', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: RefreshCw },
  },
  customer: {
    active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: UserCheck },
    inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: User },
    new: { label: 'New', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Star },
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: Star },
    blocked: { label: 'Blocked', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: UserX },
    returning: { label: 'Returning', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400', icon: RefreshCw },
  },
  campaign: {
    active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: PlayCircle },
    paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Pause },
    ended: { label: 'Ended', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: CheckCircle2 },
    scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock },
    draft: { label: 'Draft', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', icon: Archive },
  },
  notification: {
    unread: { label: 'Unread', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Eye },
    read: { label: 'Read', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: EyeOff },
    important: { label: 'Important', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: AlertCircle },
    archived: { label: 'Archived', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: Archive },
  }
}

interface StatusBadgeProps {
  status: string
  type?: StatusType
  showIcon?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'destructive'
}

export function StatusBadge({
  status,
  type = 'order',
  showIcon = true,
  size = 'sm',
  className,
  variant
}: StatusBadgeProps) {
  const config = statusConfigs[type]?.[status.toLowerCase()] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  const Icon = config.icon

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0 h-4',
    sm: 'text-[10px] px-2 py-0.5 h-5',
    md: 'text-xs px-2.5 py-1 h-6',
    lg: 'text-sm px-3 py-1.5 h-7'
  }

  const iconSizes = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  }

  return (
    <Badge
      className={cn(
        config.color,
        sizeClasses[size],
        'font-medium',
        className
      )}
      variant={variant as "default" | "outline" | "secondary" | "destructive" | undefined}
    >
      {showIcon && Icon && (
        <Icon className={cn(iconSizes[size], 'mr-1')} />
      )}
      <span className="capitalize">{config.label}</span>
    </Badge>
  )
}

// Helper function to get status color for custom use cases
export function getStatusColor(status: string, type: StatusType = 'order'): string {
  return statusConfigs[type]?.[status.toLowerCase()]?.color || 'bg-gray-100 text-gray-800'
}

// Helper function to get status icon for custom use cases
export function getStatusIcon(status: string, type: StatusType = 'order'): React.ElementType | undefined {
  return statusConfigs[type]?.[status.toLowerCase()]?.icon
}