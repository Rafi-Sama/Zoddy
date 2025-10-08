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