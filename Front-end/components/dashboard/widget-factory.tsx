import { memo, useMemo } from "react"
import { WidgetType } from "@/types/dashboard"
import { RevenueWidget } from "./widgets/revenue-widget"
import { OrdersWidget } from "./widgets/orders-widget"
import { InsightsWidget } from "./widgets/insights-widget"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Clock,
  AlertTriangle,
  Package,
  Plus,
  MessageSquare,
  Search,
  Eye,
  Edit,
  CheckCircle,
  TrendingDown,
  MousePointer,
  PieChart
} from "lucide-react"
import { useDashboardData } from "@/contexts/dashboard-data-context"
import { Product } from "@/types/database"

// Define type for order item
interface OrderItem {
  id?: string
  product_id?: string
  product_name: string
  quantity: number
  price: number
  total: number
  metadata?: {
    category?: string
    [key: string]: unknown
  }
}

interface WidgetFactoryProps {
  type: WidgetType
  data?: {
    title?: string;
    description?: string;
    content?: string;
    [key: string]: unknown;
  }
}

// Conversion Rate Widget Component
const ConversionRateWidget = memo(function ConversionRateWidget() {
  // Use shared dashboard data instead of individual API call
  const { orders, ordersLoading } = useDashboardData()

  const metrics = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { conversionRate: 0, ordersCount: 0, estimatedVisitors: 0, trend: 0 }
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    }).length

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
    }).length

    // Estimate conversion rate (assuming average 3% conversion)
    const estimatedVisitors = Math.round(currentMonthOrders / 0.034)
    const conversionRate = currentMonthOrders > 0 ? (currentMonthOrders / estimatedVisitors) * 100 : 0

    const lastMonthVisitors = Math.round(lastMonthOrders / 0.034)
    const lastMonthRate = lastMonthOrders > 0 ? (lastMonthOrders / lastMonthVisitors) * 100 : 0
    const trend = lastMonthRate > 0 ? ((conversionRate - lastMonthRate) / lastMonthRate) * 100 : 0

    return { conversionRate, ordersCount: currentMonthOrders, estimatedVisitors, trend }
  }, [orders])

  if (ordersLoading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-16 mb-2" />
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
        <CardTitle className="text-xs font-medium">Conversion Rate</CardTitle>
        <MousePointer className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
        <div className={`flex items-center text-[10px] ${metrics.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingDown className={`h-2.5 w-2.5 mr-1 ${metrics.trend >= 0 ? 'rotate-180' : ''}`} />
          {metrics.trend >= 0 ? '+' : ''}{metrics.trend.toFixed(1)}% from last month
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          {metrics.ordersCount.toLocaleString()} orders / {metrics.estimatedVisitors.toLocaleString()} visitors
        </div>
      </CardContent>
    </Card>
  )
})

// Sales by Category Widget Component
const SalesCategoryWidget = memo(function SalesCategoryWidget() {
  // Use shared dashboard data instead of individual API call
  const { orders, ordersLoading: loading } = useDashboardData()

  const categoryData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return []
    }

    const paidOrders = orders.filter(order => order.payment_status === 'paid')
    const categoryTotals = new Map<string, number>()
    let totalRevenue = 0

    paidOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: OrderItem) => {
          // Try to extract category from product metadata or use 'Other'
          const category = item.metadata?.category || 'Other'
          const itemTotal = item.total || 0
          categoryTotals.set(category, (categoryTotals.get(category) || 0) + itemTotal)
          totalRevenue += itemTotal
        })
      }
    })

    // Convert to array and calculate percentages
    const categories = Array.from(categoryTotals.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4) // Top 4 categories

    return categories
  }, [orders])

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-1.5">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-8 w-full mt-2" />
        </CardContent>
      </Card>
    )
  }

  const colors = ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-muted']

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-1.5">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <PieChart className="h-3.5 w-3.5" />
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1.5">
          {categoryData.length > 0 ? (
            categoryData.map((cat, index) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2 h-2 ${colors[index] || 'bg-muted'} rounded-full`} />
                  <span className="text-xs">{cat.name}</span>
                </div>
                <div className="text-xs font-medium">
                  ৳{cat.amount.toLocaleString('en-BD', { maximumFractionDigits: 0 })} ({cat.percentage.toFixed(0)}%)
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">No sales data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

// Pending Payments Widget Component
const PendingPaymentsWidget = memo(function PendingPaymentsWidget() {
  // Use shared dashboard data and filter client-side instead of separate API call
  const { orders, ordersLoading: loading } = useDashboardData()

  const metrics = useMemo(() => {
    const pendingOrders = orders?.filter(o => o.payment_status === 'pending') || []
    if (pendingOrders.length === 0) {
      return { totalAmount: 0, customerCount: 0 }
    }

    const totalAmount = pendingOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const uniqueCustomers = new Set(pendingOrders.map(o => o.customer_id).filter(Boolean))

    return { totalAmount, customerCount: uniqueCustomers.size }
  }, [orders])

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-24 mb-1" />
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
        <CardTitle className="text-xs font-medium">Pending Payments</CardTitle>
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-orange-600">
          ৳{metrics.totalAmount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {metrics.customerCount} customer{metrics.customerCount !== 1 ? 's' : ''}
        </div>
        <Button variant="outline" size="sm" className="mt-1.5 h-6 text-[10px] px-2">
          Send Reminders
        </Button>
      </CardContent>
    </Card>
  )
})

// Low Stock Widget Component
const LowStockWidget = memo(function LowStockWidget() {
  // Use shared dashboard data instead of individual API call
  const { products, productsLoading: loading } = useDashboardData()

  const lowStockCount = useMemo(() => {
    if (!products || products.length === 0) return 0

    return products.filter(product =>
      product.status === 'active' &&
      product.current_stock <= (product.reorder_level || 5)
    ).length
  }, [products])

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-16 mb-1" />
          <Skeleton className="h-3 w-32 mb-2" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
        <CardTitle className="text-xs font-medium">Low Stock Alert</CardTitle>
        <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-red-600">{lowStockCount}</div>
        <div className="text-[10px] text-muted-foreground">
          Product{lowStockCount !== 1 ? 's' : ''} need restock
        </div>
        <Button variant="outline" size="sm" className="mt-1.5 h-6 text-[10px] px-2">
          View Items
        </Button>
      </CardContent>
    </Card>
  )
})

// Recent Activity Widget Component
const RecentActivityWidget = memo(function RecentActivityWidget() {
  // Use shared dashboard data and slice first 5 instead of separate API call
  const { orders, ordersLoading: loading } = useDashboardData()
  const recentOrders = useMemo(() => orders?.slice(0, 5) || [], [orders])

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm">Recent Activity</CardTitle>
        <CardDescription className="text-xs">Last 5 orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 scrollbar-hide overflow-y-auto max-h-[calc(100%-4rem)]">
        {recentOrders && recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <div key={order.order_number} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-xs">#{order.order_number}</span>
                  <Badge
                    variant={order.payment_status === "paid" ? "default" : "secondary"}
                    className={order.payment_status === "paid" ? "bg-green-100 text-green-800 text-[9px] px-1.5 py-0" : "bg-yellow-100 text-yellow-800 text-[9px] px-1.5 py-0"}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{order.customer_name || 'Unknown'}</div>
                <div className="text-[10px] text-muted-foreground">{getTimeAgo(order.created_at)}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-xs">
                  ৳{order.total_amount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
                </div>
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                    <Eye className="h-2.5 w-2.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                    <Edit className="h-2.5 w-2.5" />
                  </Button>
                  {order.payment_status === "pending" && (
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <CheckCircle className="h-2.5 w-2.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">No recent orders</div>
        )}
      </CardContent>
    </Card>
  )
})

// Cash Flow Widget Component
const CashFlowWidget = memo(function CashFlowWidget() {
  // Use shared dashboard data and filter client-side instead of separate API calls
  const { orders, products, ordersLoading, productsLoading } = useDashboardData()

  const metrics = useMemo(() => {
    const pendingPayments = orders?.filter(o => o.payment_status === 'pending') || []
    const activeProducts = products?.filter((p: Product) => p.status === 'active') || []

    const pendingAmount = pendingPayments.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const inventoryValue = activeProducts.reduce((sum, product) =>
      sum + ((product.current_stock || 0) * (product.cost_price || 0)), 0
    )
    const expectedIncome = pendingAmount + inventoryValue

    return { pendingAmount, inventoryValue, expectedIncome }
  }, [orders, products])

  const loading = ordersLoading || productsLoading

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  const monthlyTarget = 35000
  const progress = (metrics.expectedIncome / monthlyTarget) * 100

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm">Cash Flow Forecast</CardTitle>
        <CardDescription className="text-xs">Your real wealth calculation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span>Pending Payments</span>
            <span className="font-medium">
              ৳{metrics.pendingAmount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Inventory Value</span>
            <span className="font-medium">
              ৳{metrics.inventoryValue.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="border-t pt-1.5">
            <div className="flex justify-between font-medium text-xs">
              <span>Expected Income</span>
              <span className="text-green-600">
                ৳{metrics.expectedIncome.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">Progress to next goal</div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-accent h-1.5 rounded-full" style={{width: `${Math.min(progress, 100)}%`}}></div>
          </div>
          <div className="text-[10px] text-muted-foreground">
            ৳{metrics.expectedIncome.toLocaleString('en-BD', { maximumFractionDigits: 0 })} / ৳{monthlyTarget.toLocaleString('en-BD')} monthly target
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

// Top Product Widget Component
const TopProductWidget = memo(function TopProductWidget() {
  // Use shared dashboard data instead of individual API call
  const { orders, ordersLoading: loading } = useDashboardData()

  const topProduct = useMemo<{ name: string; count: number; price: number } | null>(() => {
    if (!orders || orders.length === 0) return null

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const productSales = new Map<string, { name: string; count: number; price: number }>()

    orders
      .filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      })
      .forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: OrderItem) => {
            const productId = item.product_id || item.product_name
            if (productId) {
              const existing = productSales.get(productId) || {
                name: item.product_name || 'Unknown Product',
                count: 0,
                price: item.price || 0
              }
              existing.count += item.quantity || 1
              productSales.set(productId, existing)
            }
          })
        }
      })

    let topProduct: { name: string; count: number; price: number } | null = null
    let maxCount = 0

    productSales.forEach(product => {
      if (product.count > maxCount) {
        maxCount = product.count
        topProduct = product
      }
    })

    return topProduct
  }, [orders])

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm">Top Product</CardTitle>
      </CardHeader>
      <CardContent>
        {topProduct ? (
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-xs">{topProduct?.name}</div>
              <div className="text-[10px] text-muted-foreground">{topProduct?.count} sold this month</div>
              <div className="text-xs font-medium text-accent">
                ৳{topProduct?.price?.toLocaleString('en-BD', { maximumFractionDigits: 0 })} each
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">No product sales this month</div>
        )}
      </CardContent>
    </Card>
  )
})

export const WidgetFactory = memo(function WidgetFactory({ type, data }: WidgetFactoryProps) {
  switch (type) {
    case 'revenue':
      return <RevenueWidget />

    case 'orders':
      return <OrdersWidget />

    case 'conversion-rate':
      return <ConversionRateWidget />

    case 'sales-category':
      return <SalesCategoryWidget />

    case 'pending-payments':
      return <PendingPaymentsWidget />

    case 'low-stock':
      return <LowStockWidget />

    case 'insights':
      return <InsightsWidget />

    case 'revenue-chart':
      return (
        <Card className="h-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">Revenue Trend</CardTitle>
            <CardDescription className="text-xs">Daily revenue for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1.5 mb-3">
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">7d</Button>
              <Button variant="outline" size="sm" className="bg-accent text-accent-foreground h-6 text-[10px] px-2">30d</Button>
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">90d</Button>
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">1y</Button>
            </div>
            <div className="h-[160px] flex items-end justify-between space-x-2 border rounded-lg p-3 bg-muted/20">
              {Array.from({length: 30}, (_, i) => (
                <div
                  key={i}
                  className="bg-accent/60 rounded-sm flex-1 max-w-2"
                  style={{height: `${Math.random() * 80 + 20}%`}}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>
      )

    case 'recent-activity':
      return <RecentActivityWidget />

    case 'cash-flow':
      return <CashFlowWidget />

    case 'top-product':
      return <TopProductWidget />

    case 'quick-actions':
      return (
        <Card className="h-full overflow-hidden">
          <CardContent className="pt-4 scrollbar-hide overflow-x-auto">
            <div className="flex flex-wrap gap-2">
              <Button className="bg-accent hover:bg-accent/90 h-8 text-xs px-3">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Order
              </Button>
              <Button variant="outline" className="h-8 text-xs px-3">
                <Package className="h-3.5 w-3.5 mr-1.5" />
                Add Product
              </Button>
              <Button variant="outline" className="h-8 text-xs px-3">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Send Message
              </Button>
              <div className="flex-1 min-w-[180px] max-w-md">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    placeholder="Search orders, customers, products..."
                    className="w-full pl-8 pr-3 py-1.5 border border-input rounded-md bg-background text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )

    case 'custom':
      return (
        <Card className="h-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">{data?.title || 'Custom Widget'}</CardTitle>
            {data?.description && (
              <CardDescription className="text-xs">{data.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {data?.content || 'Configure this widget with your custom content'}
            </p>
          </CardContent>
        </Card>
      )

    default:
      return (
        <Card className="h-full">
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-xs text-muted-foreground">Widget type not found</p>
          </CardContent>
        </Card>
      )
  }
})
