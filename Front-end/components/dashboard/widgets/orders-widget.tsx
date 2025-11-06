import React, { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, TrendingUp, TrendingDown } from "lucide-react"
import { useDashboardData } from "@/contexts/dashboard-data-context"

export const OrdersWidget = memo(function OrdersWidget() {
  // Use shared dashboard data and calculate aggregates client-side
  const { orders: allOrders, ordersLoading } = useDashboardData()

  // Calculate trend metrics and counts client-side
  const metrics = useMemo(() => {
    if (!allOrders || allOrders.length === 0) {
      return {
        totalOrders: 0,
        todayOrders: 0,
        yesterdayOrders: 0,
        trend: 0
      }
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= todayStart
    }).length

    const yesterdayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= yesterdayStart && orderDate < todayStart
    }).length

    const trend = yesterdayOrders > 0
      ? todayOrders - yesterdayOrders
      : todayOrders

    return {
      totalOrders: allOrders.length,
      todayOrders,
      yesterdayOrders,
      trend,
      pendingCount: allOrders.filter(o => o.status === 'pending').length,
      completedCount: allOrders.filter(o => o.status === 'delivered').length
    }
  }, [allOrders])

  const loading = ordersLoading

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-3 sm:p-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <Skeleton className="h-7 w-24 mb-2" />
          <div className="flex gap-1.5 mb-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    )
  }

  const isPositiveTrend = metrics.trend >= 0
  const trendIcon = isPositiveTrend ? TrendingUp : TrendingDown

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-3 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium">Orders</CardTitle>
        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="text-lg sm:text-xl font-bold">
          +{metrics.totalOrders.toLocaleString()}
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px]">
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
            {metrics.pendingCount} Pending
          </Badge>
          <Badge variant="default" className="bg-green-100 text-green-800 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
            {metrics.completedCount} Completed
          </Badge>
        </div>
        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground mt-1">
          {React.createElement(trendIcon, {
            className: `h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0 ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`
          })}
          <span className={`truncate ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? '+' : ''}{Math.abs(metrics.trend)} from yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  )
})
