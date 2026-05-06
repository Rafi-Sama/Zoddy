import { CheckCircle, Clock, Truck, Package, DollarSign, AlertTriangle, XCircle } from "lucide-react"
import { ReactNode } from "react"

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "partial" | "failed" | "refunded"

interface StatusConfig {
  color: string
  icon: ReactNode
  label: string
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    color: "bg-gray-100 text-gray-800",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Pending"
  },
  confirmed: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <Package className="h-3.5 w-3.5" />,
    label: "Confirmed"
  },
  shipped: {
    color: "bg-blue-100 text-blue-800",
    icon: <Truck className="h-3.5 w-3.5" />,
    label: "Shipped"
  },
  delivered: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "Delivered"
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Cancelled"
  }
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  pending: {
    color: "bg-orange-100 text-orange-800",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Pending"
  },
  paid: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "Paid"
  },
  partial: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <DollarSign className="h-3.5 w-3.5" />,
    label: "Partial"
  },
  failed: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Failed"
  },
  refunded: {
    color: "bg-purple-100 text-purple-800",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    label: "Refunded"
  }
}

export function getOrderStatusConfig(status: string): StatusConfig {
  return ORDER_STATUS_CONFIG[status as OrderStatus] || ORDER_STATUS_CONFIG.pending
}

export function getPaymentStatusConfig(status: string): StatusConfig {
  return PAYMENT_STATUS_CONFIG[status as PaymentStatus] || PAYMENT_STATUS_CONFIG.pending
}

// Helper functions for status colors (used across multiple pages)
export function getStatusColor(status: string): string {
  const config = getOrderStatusConfig(status)
  return config.color
}

export function getPaymentStatusColor(status: string): string {
  const config = getPaymentStatusConfig(status)
  return config.color
}

export function getStatusIcon(status: string): ReactNode {
  const config = getOrderStatusConfig(status)
  return config.icon
}

export function getPaymentStatusIcon(status: string): ReactNode {
  const config = getPaymentStatusConfig(status)
  return config.icon
}

// Customer status types and helpers
export type CustomerStatus = "vip" | "regular" | "new" | "inactive"

export const CUSTOMER_STATUS_CONFIG: Record<CustomerStatus, StatusConfig> = {
  vip: {
    color: "bg-purple-100 text-purple-800",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "VIP"
  },
  regular: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "Regular"
  },
  new: {
    color: "bg-blue-100 text-blue-800",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "New"
  },
  inactive: {
    color: "bg-gray-100 text-gray-800",
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Inactive"
  }
}

export function getCustomerStatusConfig(status: string): StatusConfig {
  return CUSTOMER_STATUS_CONFIG[status as CustomerStatus] || CUSTOMER_STATUS_CONFIG.regular
}

export function getCustomerStatusColor(status: string): string {
  const config = getCustomerStatusConfig(status)
  return config.color
}

export function getCustomerStatusIcon(status: string): ReactNode {
  const config = getCustomerStatusConfig(status)
  return config.icon
}

// Inventory/Stock status helpers
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export function getStockStatus(product: { current_stock: number; reorder_level: number }): StockStatus {
  if (product.current_stock === 0) return "out_of_stock"
  if (product.current_stock <= product.reorder_level) return "low_stock"
  return "in_stock"
}

export const STOCK_STATUS_CONFIG: Record<StockStatus, StatusConfig> = {
  in_stock: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "In Stock"
  },
  low_stock: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    label: "Low Stock"
  },
  out_of_stock: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Out of Stock"
  }
}

export function getStockStatusConfig(status: StockStatus): StatusConfig {
  return STOCK_STATUS_CONFIG[status]
}

export function getStockStatusColor(product: { current_stock: number; reorder_level: number }): string {
  const status = getStockStatus(product)
  return STOCK_STATUS_CONFIG[status].color
}

export function getStockStatusIcon(product: { current_stock: number; reorder_level: number }): ReactNode {
  const status = getStockStatus(product)
  return STOCK_STATUS_CONFIG[status].icon
}