"use client"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Eye,
  MousePointer,
  Download,
  PieChart,
  Activity,
  Filter,
  CreditCard,
  Users,
  TrendingDown,
  BarChart3
} from "lucide-react"
export default function AnalyticsPage() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics" }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl font-bold font-display">Analytics &amp; Insights</h1>
            <p className="text-xs text-muted-foreground">
              Comprehensive business intelligence for data-driven decisions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-full sm:w-40 h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10 text-sm px-3 flex-1 sm:flex-none">
              <Filter className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="outline" className="h-10 text-sm px-3 flex-1 sm:flex-none">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      {/* Key Metrics Overview */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">৳2,45,000</div>
            <div className="flex items-center text-[10px] text-green-600">
              <TrendingUp className="h-2.5 w-2.5 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">1,247</div>
            <div className="flex items-center text-[10px] text-green-600">
              <TrendingUp className="h-2.5 w-2.5 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Active Customers</CardTitle>
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">834</div>
            <div className="flex items-center text-[10px] text-green-600">
              <TrendingUp className="h-2.5 w-2.5 mr-1" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Conversion Rate</CardTitle>
            <MousePointer className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">3.4%</div>
            <div className="flex items-center text-[10px] text-red-600">
              <TrendingDown className="h-2.5 w-2.5 mr-1" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Revenue & Sales Charts */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <BarChart3 className="h-4 w-4" />
              Revenue Trend
            </CardTitle>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[40, 65, 45, 80, 55, 75, 85, 70, 90, 85, 95, 100].map((height, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div
                    className="w-8 bg-primary rounded-t transition-all hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec'"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-xs text-muted-foreground">
              Showing revenue growth over the last 12 months
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <PieChart className="h-4 w-4" />
              Sales by Category
            </CardTitle>
            <Button variant="outline" className="h-6 text-[10px] px-2">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                  <span className="text-xs">Electronics</span>
                </div>
                <div className="text-xs font-medium">৳98,500 (40%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-accent rounded-full" />
                  <span className="text-xs">Fashion</span>
                </div>
                <div className="text-xs font-medium">৳73,750 (30%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
                  <span className="text-xs">Home & Garden</span>
                </div>
                <div className="text-xs font-medium">৳49,000 (20%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-muted rounded-full" />
                  <span className="text-xs">Others</span>
                </div>
                <div className="text-xs font-medium">৳24,500 (10%)</div>
              </div>
            </div>
            <div className="mt-6 relative h-32">
              <div className="absolute inset-0 rounded-full border-8 border-primary"
                   style={{ clipPath: 'polygon(0 0, 40% 0, 40% 100%, 0 100%)' }} />
              <div className="absolute inset-0 rounded-full border-8 border-accent"
                   style={{ clipPath: 'polygon(40% 0, 70% 0, 70% 100%, 40% 100%)' }} />
              <div className="absolute inset-0 rounded-full border-8 border-secondary"
                   style={{ clipPath: 'polygon(70% 0, 90% 0, 90% 100%, 70% 100%)' }} />
              <div className="absolute inset-0 rounded-full border-8 border-muted"
                   style={{ clipPath: 'polygon(90% 0, 100% 0, 100% 100%, 90% 100%)' }} />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Customer & Marketing Analytics */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Users className="h-4 w-4" />
              Customer Acquisition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs">New Customers</span>
              <span className="font-semibold text-xs">156 this month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Retention Rate</span>
              <span className="font-semibold text-xs text-green-600">87.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Churn Rate</span>
              <span className="font-semibold text-xs text-red-600">12.5%</span>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Customer Lifetime Value</span>
                <span className="font-medium">৳8,450</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Avg. Order Value</span>
                <span className="font-medium">৳1,965</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Eye className="h-4 w-4" />
              Website Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs">Total Visitors</span>
              <span className="font-semibold text-xs">12,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Page Views</span>
              <span className="font-semibold text-xs">34,562</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Bounce Rate</span>
              <span className="font-semibold text-xs text-yellow-600">42.8%</span>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Avg. Session Duration</span>
                <span className="font-medium">3m 24s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Mobile Traffic</span>
                <span className="font-medium">68.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Package className="h-4 w-4" />
              Inventory Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs">Total Products</span>
              <span className="font-semibold text-xs">485</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Low Stock Items</span>
              <span className="font-semibold text-xs text-red-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Out of Stock</span>
              <span className="font-semibold text-xs text-red-600">7</span>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Top Selling Product</span>
                <span className="font-medium">Samsung Galaxy A14</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Inventory Turnover</span>
                <span className="font-medium">6.2x/year</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Performance Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <Activity className="h-4 w-4" />
            Performance Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-xs font-medium">Revenue Growth</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Your revenue increased by 12.5% this month. Focus on high-performing categories.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                <span className="text-xs font-medium">Conversion Rate</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Conversion rate dropped 2.1%. Consider improving product descriptions and checkout flow.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-xs font-medium">Inventory Alert</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                23 products are running low on stock. Reorder popular items to avoid stockouts.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-xs font-medium">Customer Retention</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                87.5% retention rate is excellent. Consider loyalty programs to maintain this.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span className="text-xs font-medium">Marketing ROI</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Digital campaigns showing 4.2x ROI. Increase budget for high-performing channels.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span className="text-xs font-medium">Seasonal Trend</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Preparing for Eid season. Historical data shows 40% increase in orders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </MainLayout>
  )
}