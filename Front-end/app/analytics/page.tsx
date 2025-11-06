'use client'

import { useMemo } from 'react'
import { useDashboardData, DashboardDataProvider } from '@/contexts/dashboard-data-context'
// Types are inferred from dashboard data context
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Activity
} from 'lucide-react'

// Type for order item
interface OrderItem {
  product_name: string
  quantity?: number
  total?: number
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon: React.ReactNode
  loading?: boolean
}

function MetricCard({ title, value, trend, trendLabel, icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-32 mt-4" />
          <Skeleton className="h-4 w-20 mt-2" />
        </CardContent>
      </Card>
    )
  }

  const isTrendPositive = trend !== undefined && trend >= 0

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isTrendPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  isTrendPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(trend).toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-sm text-muted-foreground ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Chart Data Card Component
interface ChartDataCardProps {
  title: string
  description?: string
  data: Array<{ label: string; value: number; color?: string }>
  loading?: boolean
  type?: 'bar' | 'list'
}

function ChartDataCard({ title, description, data, loading, type = 'list' }: ChartDataCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value.toLocaleString()}</span>
                </div>
                {type === 'bar' && (
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{
                        width: `${(item.value / maxValue) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Time Series Chart Component
interface TimeSeriesChartProps {
  title: string
  description?: string
  data: Array<{ date: string; value: number }>
  loading?: boolean
  valueFormatter?: (value: number) => string
}

function TimeSeriesChart({ title, description, data, loading, valueFormatter = (v) => v.toString() }: TimeSeriesChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data available for this period</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2 h-64">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full bg-primary rounded-t-md min-h-[4px] transition-all hover:opacity-80"
                      style={{ height: `${(item.value / maxValue) * 100}%` }}
                      title={`${item.date}: ${valueFormatter(item.value)}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Total: {valueFormatter(data.reduce((sum, item) => sum + item.value, 0))}
              </span>
              <span className="text-sm text-muted-foreground">
                Avg: {valueFormatter(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Inner component that uses the shared dashboard data
function AnalyticsContent() {
  // Use shared dashboard data instead of 3 separate API calls
  const {
    orders: allOrders,
    customers: allCustomers,
    products: allProducts,
    ordersLoading,
    customersLoading,
    productsLoading,
    ordersError,
    customersError,
    productsError
  } = useDashboardData()

  const loading = ordersLoading || customersLoading || productsLoading
  const error = ordersError || customersError || productsError

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    if (!allOrders || !allCustomers || !allProducts) {
      return null
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Filter orders by time period
    const last30DaysOrders = allOrders.filter(
      (order) => new Date(order.created_at) >= thirtyDaysAgo
    )
    const previous30DaysOrders = allOrders.filter(
      (order) =>
        new Date(order.created_at) >= sixtyDaysAgo &&
        new Date(order.created_at) < thirtyDaysAgo
    )

    // Revenue metrics (only from paid orders)
    const paidOrders = last30DaysOrders.filter((order) => order.payment_status === 'paid')
    const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
    const previousRevenue = previous30DaysOrders
      .filter((order) => order.payment_status === 'paid')
      .reduce((sum, order) => sum + Number(order.total_amount), 0)
    const revenueTrend = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Order metrics
    const totalOrders = last30DaysOrders.length
    const previousOrderCount = previous30DaysOrders.length
    const orderTrend = previousOrderCount > 0 ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 0

    const pendingOrders = allOrders.filter((order) => order.status === 'pending').length
    const completedOrders = allOrders.filter(
      (order) => order.status === 'delivered'
    ).length

    // Customer metrics
    const totalCustomers = allCustomers.length
    const newCustomers = allCustomers.filter(
      (customer) => new Date(customer.created_at) >= thirtyDaysAgo
    ).length
    const previousNewCustomers = allCustomers.filter(
      (customer) =>
        new Date(customer.created_at) >= sixtyDaysAgo &&
        new Date(customer.created_at) < thirtyDaysAgo
    ).length
    const customerTrend = previousNewCustomers > 0 ? ((newCustomers - previousNewCustomers) / previousNewCustomers) * 100 : 0

    // Returning customers (customers with more than one order)
    const customerOrderCounts = new Map<string, number>()
    allOrders.forEach((order) => {
      if (order.customer_id) {
        customerOrderCounts.set(
          order.customer_id,
          (customerOrderCounts.get(order.customer_id) || 0) + 1
        )
      }
    })
    const returningCustomers = Array.from(customerOrderCounts.values()).filter((count) => count > 1).length
    const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0

    // Product metrics
    const totalProducts = allProducts.length
    const activeProducts = allProducts.filter((product) => product.status === 'active').length
    const lowStockProducts = allProducts.filter(
      (product) => product.current_stock > 0 && product.current_stock <= product.reorder_level
    ).length
    const outOfStockProducts = allProducts.filter((product) => product.current_stock === 0).length

    // Average order value
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

    // Conversion rate (completed orders / total orders)
    const conversionRate = totalOrders > 0 ? (completedOrders / allOrders.length) * 100 : 0

    return {
      revenue: {
        total: totalRevenue,
        trend: revenueTrend,
        averageOrderValue
      },
      orders: {
        total: totalOrders,
        trend: orderTrend,
        pending: pendingOrders,
        completed: completedOrders,
        conversionRate
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
        trend: customerTrend,
        returning: returningCustomers,
        retentionRate
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      }
    }
  }, [allOrders, allCustomers, allProducts])

  // Generate revenue chart data (last 30 days)
  const revenueChartData = useMemo(() => {
    if (!allOrders) return []

    const now = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    return last30Days.map((date) => {
      const dayOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0]
        return orderDate === date && order.payment_status === 'paid'
      })
      const revenue = dayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
      return { date, value: revenue }
    })
  }, [allOrders])

  // Generate orders chart data (last 30 days)
  const ordersChartData = useMemo(() => {
    if (!allOrders) return []

    const now = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    return last30Days.map((date) => {
      const count = allOrders.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0]
        return orderDate === date
      }).length
      return { date, value: count }
    })
  }, [allOrders])

  // Payment method breakdown
  const paymentMethodData = useMemo(() => {
    if (!allOrders) return []

    const methods = allOrders.reduce((acc, order) => {
      if (order.payment_method && order.payment_status === 'paid') {
        acc[order.payment_method] = (acc[order.payment_method] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const colors: Record<string, string> = {
      cash: '#10b981',
      bkash: '#e91e63',
      nagad: '#ff9800',
      rocket: '#9c27b0',
      bank: '#2196f3',
      card: '#3f51b5',
      upay: '#00bcd4',
      cellfin: '#4caf50'
    }

    return Object.entries(methods)
      .map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value,
        color: colors[label] || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value)
  }, [allOrders])

  // Geographic distribution (by city)
  const geographicData = useMemo(() => {
    if (!allCustomers) return []

    const cities = allCustomers.reduce((acc, customer) => {
      const city = customer.city || 'Unknown'
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(cities)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 cities
  }, [allCustomers])

  // Top selling products
  const topProductsData = useMemo(() => {
    if (!allOrders) return []

    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>()

    allOrders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: OrderItem) => {
          const existing = productSales.get(item.product_name) || {
            name: item.product_name,
            quantity: 0,
            revenue: 0
          }
          existing.quantity += item.quantity || 0
          existing.revenue += Number(item.total || 0)
          productSales.set(item.product_name, existing)
        })
      }
    })

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((product) => ({
        label: product.name,
        value: product.revenue
      }))
  }, [allOrders])

  // Customer acquisition chart (last 30 days)
  const customerAcquisitionData = useMemo(() => {
    if (!allCustomers) return []

    const now = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    return last30Days.map((date) => {
      const count = allCustomers.filter((customer) => {
        const customerDate = new Date(customer.created_at).toISOString().split('T')[0]
        return customerDate === date
      }).length
      return { date, value: count }
    })
  }, [allCustomers])

  // Order status distribution
  const orderStatusData = useMemo(() => {
    if (!allOrders) return []

    const statuses = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const colors: Record<string, string> = {
      pending: '#fbbf24',
      confirmed: '#60a5fa',
      processing: '#a78bfa',
      shipped: '#34d399',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#f97316'
    }

    return Object.entries(statuses)
      .map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value,
        color: colors[label] || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value)
  }, [allOrders])

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
          <p className="text-destructive font-semibold">Failed to load analytics data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights into your business performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue (30d)"
          value={`৳${metrics?.revenue.total.toLocaleString() || 0}`}
          trend={metrics?.revenue.trend}
          trendLabel="vs previous 30d"
          icon={<DollarSign className="h-5 w-5" />}
          loading={loading}
        />
        <MetricCard
          title="Orders (30d)"
          value={metrics?.orders.total.toLocaleString() || 0}
          trend={metrics?.orders.trend}
          trendLabel="vs previous 30d"
          icon={<ShoppingCart className="h-5 w-5" />}
          loading={loading}
        />
        <MetricCard
          title="Total Customers"
          value={metrics?.customers.total.toLocaleString() || 0}
          trend={metrics?.customers.trend}
          trendLabel="new this month"
          icon={<Users className="h-5 w-5" />}
          loading={loading}
        />
        <MetricCard
          title="Active Products"
          value={metrics?.products.active.toLocaleString() || 0}
          icon={<Package className="h-5 w-5" />}
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Avg Order Value"
          value={`৳${metrics?.revenue.averageOrderValue.toFixed(0) || 0}`}
          icon={<BarChart3 className="h-5 w-5" />}
          loading={loading}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics?.orders.conversionRate.toFixed(1) || 0}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          loading={loading}
        />
        <MetricCard
          title="Customer Retention"
          value={`${metrics?.customers.retentionRate.toFixed(1) || 0}%`}
          icon={<Activity className="h-5 w-5" />}
          loading={loading}
        />
        <MetricCard
          title="Low Stock Items"
          value={metrics?.products.lowStock.toLocaleString() || 0}
          icon={<Package className="h-5 w-5" />}
          loading={loading}
        />
      </div>

      {/* Time Series Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TimeSeriesChart
          title="Revenue Trend"
          description="Daily revenue for the last 30 days"
          data={revenueChartData}
          loading={loading}
          valueFormatter={(v) => `৳${v.toLocaleString()}`}
        />
        <TimeSeriesChart
          title="Order Volume"
          description="Daily orders for the last 30 days"
          data={ordersChartData}
          loading={loading}
          valueFormatter={(v) => v.toString()}
        />
      </div>

      {/* Customer Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TimeSeriesChart
          title="Customer Acquisition"
          description="New customers per day (last 30 days)"
          data={customerAcquisitionData}
          loading={loading}
        />
        <ChartDataCard
          title="Top Locations"
          description="Customers by city"
          data={geographicData}
          loading={loading}
          type="bar"
        />
      </div>

      {/* Order and Payment Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartDataCard
          title="Order Status Distribution"
          description="Current order statuses"
          data={orderStatusData}
          loading={loading}
          type="bar"
        />
        <ChartDataCard
          title="Payment Methods"
          description="Paid orders by payment method"
          data={paymentMethodData}
          loading={loading}
          type="bar"
        />
      </div>

      {/* Top Products */}
      <ChartDataCard
        title="Top Selling Products"
        description="Best performing products by revenue"
        data={topProductsData}
        loading={loading}
        type="bar"
      />

      {/* Additional Insights Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending Orders</span>
                  <span className="text-sm font-semibold">{metrics?.orders.pending || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Orders</span>
                  <span className="text-sm font-semibold">{metrics?.orders.completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                  <span className="text-sm font-semibold">{allOrders?.length || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Customers</span>
                  <span className="text-sm font-semibold">{metrics?.customers.new || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Returning Customers</span>
                  <span className="text-sm font-semibold">{metrics?.customers.returning || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Retention Rate</span>
                  <span className="text-sm font-semibold">
                    {metrics?.customers.retentionRate.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Products</span>
                  <span className="text-sm font-semibold">{metrics?.products.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Low Stock</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {metrics?.products.lowStock || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Out of Stock</span>
                  <span className="text-sm font-semibold text-red-600">
                    {metrics?.products.outOfStock || 0}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main exported component with provider wrapper
export default function AnalyticsPage() {
  return (
    <DashboardDataProvider>
      <AnalyticsContent />
    </DashboardDataProvider>
  )
}
