"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Package,
  Users,
  ShoppingCart,
  Search,
  Filter,
  Inbox,
  AlertCircle
} from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ElementType
  iconSize?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'search' | 'filter' | 'error'
  className?: string
}

const variantConfigs = {
  default: {
    icon: Inbox,
    title: "No data found",
    description: "There's nothing to display at the moment"
  },
  search: {
    icon: Search,
    title: "No search results",
    description: "Try adjusting your search terms or filters"
  },
  filter: {
    icon: Filter,
    title: "No matching items",
    description: "Try changing or clearing your filters"
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description: "Unable to load data. Please try again"
  }
}

export function EmptyState({
  icon,
  iconSize = 'md',
  title,
  description,
  action,
  variant = 'default',
  className
}: EmptyStateProps) {
  const config = variantConfigs[variant]
  const Icon = icon || config.icon
  const displayTitle = title || config.title
  const displayDescription = description || config.description

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizes = {
    sm: { title: 'text-sm', description: 'text-xs' },
    md: { title: 'text-base', description: 'text-sm' },
    lg: { title: 'text-lg', description: 'text-base' },
    xl: { title: 'text-xl', description: 'text-base' }
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-8 px-4 text-center",
      className
    )}>
      <Icon className={cn(
        iconSizes[iconSize],
        "text-muted-foreground mb-3 opacity-50"
      )} />

      {displayTitle && (
        <h3 className={cn(
          "font-medium text-foreground mb-1",
          textSizes[iconSize].title
        )}>
          {displayTitle}
        </h3>
      )}

      {displayDescription && (
        <p className={cn(
          "text-muted-foreground mb-4 max-w-sm",
          textSizes[iconSize].description
        )}>
          {displayDescription}
        </p>
      )}

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}

// Preset empty states for common use cases
export function OrdersEmptyState({ onCreateOrder }: { onCreateOrder?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No orders yet"
      description="Start by creating your first order"
      action={
        onCreateOrder && (
          <Button onClick={onCreateOrder}>
            Create Order
          </Button>
        )
      }
    />
  )
}

export function CustomersEmptyState({ onAddCustomer }: { onAddCustomer?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No customers yet"
      description="Add your first customer to get started"
      action={
        onAddCustomer && (
          <Button onClick={onAddCustomer}>
            Add Customer
          </Button>
        )
      }
    />
  )
}

export function InventoryEmptyState({ onAddProduct }: { onAddProduct?: () => void }) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="No products in inventory"
      description="Add your products to start tracking inventory"
      action={
        onAddProduct && (
          <Button onClick={onAddProduct}>
            Add Product
          </Button>
        )
      }
    />
  )
}

export function SearchEmptyState({ onClearSearch }: { onClearSearch?: () => void }) {
  return (
    <EmptyState
      variant="search"
      action={
        onClearSearch && (
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        )
      }
    />
  )
}

export function FilterEmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      variant="filter"
      action={
        onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )
      }
    />
  )
}