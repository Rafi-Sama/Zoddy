'use client'

import { createContext, useContext, useMemo, useCallback, ReactNode } from 'react'
import { useData } from '@/hooks/use-database-ultra'
import type { Order, Customer, Product } from '@/types/database'

interface DashboardDataContextType {
  // Shared data
  orders: Order[] | null
  customers: Customer[] | null
  products: Product[] | null

  // Loading states
  ordersLoading: boolean
  customersLoading: boolean
  productsLoading: boolean

  // Errors
  ordersError: Error | null
  customersError: Error | null
  productsError: Error | null

  // Computed aggregates (cached computations)
  aggregates: {
    totalOrders: number
    pendingOrders: number
    completedOrders: number
    totalRevenue: number
    averageOrderValue: number
    totalCustomers: number
    activeCustomers: number
    totalProducts: number
    lowStockProducts: number
    conversionRate: number
    ordersByStatus: Record<string, number>
    ordersByChannel: Record<string, number>
    topProducts: Array<{ name: string; quantity: number; revenue: number }>
    recentOrders: Order[]
    cashFlow: {
      pending: number
      received: number
    }
  }

  // Refresh functions
  refetchOrders: () => Promise<void>
  refetchCustomers: () => Promise<void>
  refetchProducts: () => Promise<void>
  refetchAll: () => Promise<void>

  // Cache stats for monitoring
  cacheStats: { size: number; entries: Array<{ key: string; age: number; subscribers: number }> }
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined)

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  // Single fetch for all orders with optimized select - only essential fields
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders
  } = useData<'orders', Order[]>({
    table: 'orders',
    select: 'id,order_number,customer_name,total_amount,status,payment_status,created_at,channel,items',
    orderBy: { column: 'created_at', ascending: false },
    realtime: false, // Disabled to prevent excessive API requests - data refreshes on page reload only
    staleTime: 10 * 60 * 1000, // 10 minutes for dashboard data
    dedupKey: 'dashboard-orders' // Ensure all widgets share this query
  })

  // Single fetch for customers - only essential fields
  const {
    data: customers,
    loading: customersLoading,
    error: customersError,
    refetch: refetchCustomers
  } = useData<'customers', Customer[]>({
    table: 'customers',
    select: 'id,name,phone,email,city,status,total_orders,total_spent,created_at,last_order_date',
    orderBy: { column: 'created_at', ascending: false },
    realtime: false, // Disabled to prevent excessive API requests - data refreshes on page reload only
    staleTime: 10 * 60 * 1000,
    dedupKey: 'dashboard-customers'
  })

  // Single fetch for products - only essential fields
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useData<'products', Product[]>({
    table: 'products',
    select: 'id,name,sku,category,current_stock,selling_price,status,reorder_level',
    orderBy: { column: 'name', ascending: true },
    realtime: false, // Disabled to prevent excessive API requests - data refreshes on page reload only
    staleTime: 10 * 60 * 1000,
    dedupKey: 'dashboard-products'
  })

  // Compute all aggregates client-side from cached data
  const aggregates = useMemo(() => {
    const ordersArray = orders || []
    const customersArray = customers || []
    const productsArray = products || []

    // Orders aggregates
    const totalOrders = ordersArray.length
    const pendingOrders = ordersArray.filter(o => o.payment_status === 'pending').length
    const completedOrders = ordersArray.filter(o => o.status === 'delivered').length

    const totalRevenue = ordersArray
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, order) => sum + (order.total_amount || 0), 0)

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Customers aggregates
    const totalCustomers = customersArray.length
    // Active customers = those with orders in last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const activeCustomers = customersArray.filter(c =>
      c.last_order_date && new Date(c.last_order_date) >= ninetyDaysAgo
    ).length

    // Products aggregates
    const totalProducts = productsArray.length
    const lowStockProducts = productsArray.filter(p =>
      p.current_stock <= p.reorder_level
    ).length

    // Conversion rate (orders to completed)
    const conversionRate = totalOrders > 0
      ? (completedOrders / totalOrders) * 100
      : 0

    // Orders by status
    const ordersByStatus = ordersArray.reduce((acc, order) => {
      const status = order.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Orders by channel
    const ordersByChannel = ordersArray.reduce((acc, order) => {
      const channel = order.source || 'unknown'
      acc[channel] = (acc[channel] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top products from order items
    const productStats = new Map<string, { name: string; quantity: number; revenue: number }>()

    ordersArray.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const existing = productStats.get(item.product_name) || {
            name: item.product_name,
            quantity: 0,
            revenue: 0
          }
          existing.quantity += item.quantity || 0
          existing.revenue += item.total || 0
          productStats.set(item.product_name, existing)
        })
      }
    })

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Recent orders (last 10)
    const recentOrders = ordersArray.slice(0, 10)

    // Cash flow
    const cashFlow = {
      pending: ordersArray
        .filter(o => o.payment_status === 'pending')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0),
      received: ordersArray
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0)
    }

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers,
      activeCustomers,
      totalProducts,
      lowStockProducts,
      conversionRate,
      ordersByStatus,
      ordersByChannel,
      topProducts,
      recentOrders,
      cashFlow
    }
  }, [orders, customers, products])

  // Cache stats for monitoring (can be extended later for debugging)
  const cacheStats = useMemo(() => ({
    size: 0,
    entries: [] as Array<{ key: string; age: number; subscribers: number }>
  }), [])

  // REMOVED: 5-second polling interval that was causing 5000+ req/min to Supabase
  // Cache stats can be fetched on-demand instead of polling
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCacheStats(dbCache.getStats())
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  // Refetch all data
  const refetchAll = useCallback(async () => {
    await Promise.all([
      refetchOrders(),
      refetchCustomers(),
      refetchProducts()
    ])
  }, [refetchOrders, refetchCustomers, refetchProducts])

  // Memoize context value to prevent unnecessary re-renders of all consumers
  const value = useMemo(() => ({
    orders,
    customers,
    products,
    ordersLoading,
    customersLoading,
    productsLoading,
    ordersError,
    customersError,
    productsError,
    aggregates,
    refetchOrders,
    refetchCustomers,
    refetchProducts,
    refetchAll,
    cacheStats
  } as DashboardDataContextType), [
    orders,
    customers,
    products,
    ordersLoading,
    customersLoading,
    productsLoading,
    ordersError,
    customersError,
    productsError,
    aggregates,
    refetchOrders,
    refetchCustomers,
    refetchProducts,
    refetchAll,
    cacheStats
  ])

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  )
}

// Hook to use dashboard data
export function useDashboardData() {
  const context = useContext(DashboardDataContext)
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardDataProvider')
  }
  return context
}

// Specialized hooks for specific widget data needs
export function useOrdersWidgetData() {
  const { orders, ordersLoading, aggregates } = useDashboardData()
  return {
    orders,
    loading: ordersLoading,
    totalOrders: aggregates.totalOrders,
    pendingOrders: aggregates.pendingOrders,
    completedOrders: aggregates.completedOrders,
    ordersByStatus: aggregates.ordersByStatus,
    ordersByChannel: aggregates.ordersByChannel,
    recentOrders: aggregates.recentOrders
  }
}

export function useRevenueWidgetData() {
  const { orders, ordersLoading, aggregates } = useDashboardData()
  return {
    orders,
    loading: ordersLoading,
    totalRevenue: aggregates.totalRevenue,
    averageOrderValue: aggregates.averageOrderValue,
    cashFlow: aggregates.cashFlow
  }
}

export function useCustomersWidgetData() {
  const { customers, customersLoading, aggregates } = useDashboardData()
  return {
    customers,
    loading: customersLoading,
    totalCustomers: aggregates.totalCustomers,
    activeCustomers: aggregates.activeCustomers,
    conversionRate: aggregates.conversionRate
  }
}

export function useInventoryWidgetData() {
  const { products, productsLoading, aggregates } = useDashboardData()
  return {
    products,
    loading: productsLoading,
    totalProducts: aggregates.totalProducts,
    lowStockProducts: aggregates.lowStockProducts,
    topProducts: aggregates.topProducts
  }
}

// Export types
export type { DashboardDataContextType }