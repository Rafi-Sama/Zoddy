import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Star } from "lucide-react"
import { useDashboardData } from "@/contexts/dashboard-data-context"

export const InsightsWidget = memo(function InsightsWidget() {
  // Use shared dashboard data instead of separate API calls
  const { orders, customers, ordersLoading, customersLoading } = useDashboardData()

  // Calculate insights
  const insights = useMemo(() => {
    if (!orders || !customers) {
      return {
        timeSaved: 0,
        bestCustomer: null as { name: string; orderCount: number; totalSpent: number } | null,
        inactiveCustomers: 0
      }
    }

    // Calculate time saved (estimate: 10 minutes per order vs manual tracking)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })
    const timeSaved = (monthOrders.length * 10) / 60 // Convert minutes to hours

    // Find best customer by total spent
    const customerStats = new Map<string, { name: string; orderCount: number; totalSpent: number }>()

    orders.forEach(order => {
      if (order.customer_id) {
        const existing = customerStats.get(order.customer_id) || {
          name: order.customer_name || 'Unknown',
          orderCount: 0,
          totalSpent: 0
        }
        existing.orderCount += 1
        existing.totalSpent += order.total_amount || 0
        customerStats.set(order.customer_id, existing)
      }
    })

    let bestCustomer: { name: string; orderCount: number; totalSpent: number } | null = null
    let maxSpent = 0

    customerStats.forEach(stats => {
      if (stats.totalSpent > maxSpent) {
        maxSpent = stats.totalSpent
        bestCustomer = stats
      }
    })

    // Count inactive customers (no order in 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const inactiveCustomers = customers.filter(customer => {
      if (!customer.last_order_date) return customer.total_orders > 0
      const lastOrderDate = new Date(customer.last_order_date)
      return lastOrderDate < thirtyDaysAgo && customer.total_orders > 0
    }).length

    return {
      timeSaved,
      bestCustomer,
      inactiveCustomers
    }
  }, [orders, customers])

  const loading = ordersLoading || customersLoading

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Business Insights</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Your day-1 ROI dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 scrollbar-hide overflow-y-auto max-h-[calc(100%-4rem)] p-3 sm:p-6 pt-0">
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">Business Insights</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your day-1 ROI dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 scrollbar-hide overflow-y-auto max-h-[calc(100%-4rem)] p-3 sm:p-6 pt-0">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="p-2 sm:p-3 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
              <Clock className="h-3 w-3 text-green-600 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium text-green-800 truncate">Time Saved</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-green-700">
              {insights.timeSaved.toFixed(1)} hours
            </div>
            <div className="text-[9px] sm:text-[10px] text-green-600">This month vs manual tracking</div>
          </div>
          <div className="p-2 sm:p-3 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
              <Star className="h-3 w-3 text-blue-600 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium text-blue-800 truncate">Best Customer</span>
            </div>
            {insights.bestCustomer ? (
              <>
                <div className="text-xs sm:text-sm font-bold text-blue-700 truncate">
                  {insights.bestCustomer.name}
                </div>
                <div className="text-[9px] sm:text-[10px] text-blue-600">
                  {insights.bestCustomer.orderCount} orders • ৳{insights.bestCustomer.totalSpent.toLocaleString('en-BD', { maximumFractionDigits: 0 })} total
                </div>
              </>
            ) : (
              <>
                <div className="text-xs sm:text-sm font-bold text-blue-700">No customers yet</div>
                <div className="text-[9px] sm:text-[10px] text-blue-600">Start adding orders</div>
              </>
            )}
          </div>
        </div>
        {insights.inactiveCustomers > 0 && (
          <div className="p-2 sm:p-3 border rounded-lg bg-orange-50 border-orange-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs font-medium text-orange-800">Customer Retention Alert</div>
                <div className="text-[9px] sm:text-xs text-orange-700">
                  {insights.inactiveCustomers} customer{insights.inactiveCustomers !== 1 ? 's' : ''} haven&apos;t ordered in 30 days
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 h-6 sm:h-7 text-[9px] sm:text-[10px] px-2 self-start sm:self-auto">
                Send Message
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
