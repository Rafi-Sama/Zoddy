import React, { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useDashboardData } from "@/contexts/dashboard-data-context"

export const RevenueWidget = memo(function RevenueWidget() {
  // Use shared dashboard data and filter client-side instead of separate API call
  const { orders: allOrders, ordersLoading: loading } = useDashboardData()

  // Calculate revenue metrics
  const metrics = useMemo(() => {
    // Filter for paid orders client-side
    const orders = allOrders?.filter(o => o.payment_status === 'paid') || []
    if (orders.length === 0) {
      return {
        totalRevenue: 0,
        lastMonthRevenue: 0,
        trend: 0,
        chartData: Array(12).fill(0)
      }
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Calculate current month revenue
    const currentMonthRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === currentMonth &&
               orderDate.getFullYear() === currentYear
      })
      .reduce((sum, order) => sum + (order.total_amount || 0), 0)

    // Calculate last month revenue
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const lastMonthRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === lastMonth &&
               orderDate.getFullYear() === lastMonthYear
      })
      .reduce((sum, order) => sum + (order.total_amount || 0), 0)

    // Calculate trend percentage
    const trend = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : currentMonthRevenue > 0 ? 100 : 0

    // Generate chart data for last 12 days
    const chartData = Array(12).fill(0)
    now.getDate()

    orders.forEach(order => {
      const orderDate = new Date(order.created_at)
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff >= 0 && daysDiff < 12 &&
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear) {
        const index = 11 - daysDiff
        chartData[index] += order.total_amount || 0
      }
    })

    // Normalize chart data for display (percentage of max)
    const maxValue = Math.max(...chartData, 1)
    const normalizedChart = chartData.map(val => (val / maxValue) * 100)

    return {
      totalRevenue: currentMonthRevenue,
      lastMonthRevenue,
      trend,
      chartData: normalizedChart
    }
  }, [allOrders])

  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-3 sm:p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-40 mb-2" />
          <div className="h-[24px] sm:h-[32px] mt-1.5 sm:mt-2 flex items-end space-x-0.5 sm:space-x-1">
            {Array(12).fill(0).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositiveTrend = metrics.trend >= 0
  const trendIcon = isPositiveTrend ? TrendingUp : TrendingDown

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-3 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="text-lg sm:text-xl font-bold">
          ৳{metrics.totalRevenue.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
        </div>
        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
          {React.createElement(trendIcon, {
            className: `h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0 ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`
          })}
          <span className={`truncate ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? '+' : ''}{metrics.trend.toFixed(1)}% from last month
          </span>
        </div>
        <div className="h-[24px] sm:h-[32px] mt-1.5 sm:mt-2 flex items-end space-x-0.5 sm:space-x-1">
          {metrics.chartData.map((height, i) => (
            <div
              key={i}
              className="bg-accent/30 rounded-sm flex-1"
              style={{height: `${Math.max(height, 8)}%`}}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
