import { WidgetType } from "@/types/dashboard"
import { RevenueWidget } from "./widgets/revenue-widget"
import { OrdersWidget } from "./widgets/orders-widget"
import { InsightsWidget } from "./widgets/insights-widget"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  AlertTriangle,
  Package,
  Plus,
  MessageSquare,
  Search,
  Eye,
  Edit,
  CheckCircle
} from "lucide-react"

interface WidgetFactoryProps {
  type: WidgetType
  data?: {
    title?: string;
    description?: string;
    content?: string;
    [key: string]: unknown;
  }
}

export function WidgetFactory({ type, data }: WidgetFactoryProps) {
  switch (type) {
    case 'revenue':
      return <RevenueWidget />

    case 'orders':
      return <OrdersWidget />

    case 'pending-payments':
      return (
        <Card className="h-full overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Pending Payments</CardTitle>
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">৳8,450</div>
            <div className="text-[10px] text-muted-foreground">5 customers</div>
            <Button variant="outline" size="sm" className="mt-1.5 h-6 text-[10px] px-2">
              Send Reminders
            </Button>
          </CardContent>
        </Card>
      )

    case 'low-stock':
      return (
        <Card className="h-full overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">7</div>
            <div className="text-[10px] text-muted-foreground">Products need restock</div>
            <Button variant="outline" size="sm" className="mt-1.5 h-6 text-[10px] px-2">
              View Items
            </Button>
          </CardContent>
        </Card>
      )

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
      return (
        <Card className="h-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Last 5 orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 scrollbar-hide overflow-y-auto max-h-[calc(100%-4rem)]">
            {[
              { id: "#1234", customer: "Fatima Khan", amount: "৳2,450", status: "paid", time: "2 min ago" },
              { id: "#1233", customer: "Rahman Ali", amount: "৳1,200", status: "pending", time: "15 min ago" },
              { id: "#1232", customer: "Nusrat Jahan", amount: "৳3,800", status: "paid", time: "1 hour ago" },
              { id: "#1231", customer: "Sakib Ahmed", amount: "৳950", status: "pending", time: "2 hours ago" },
              { id: "#1230", customer: "Ruma Begum", amount: "৳1,750", status: "paid", time: "3 hours ago" },
            ].map((order, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-xs">{order.id}</span>
                    <Badge
                      variant={order.status === "paid" ? "default" : "secondary"}
                      className={order.status === "paid" ? "bg-green-100 text-green-800 text-[9px] px-1.5 py-0" : "bg-yellow-100 text-yellow-800 text-[9px] px-1.5 py-0"}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{order.customer}</div>
                  <div className="text-[10px] text-muted-foreground">{order.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-xs">{order.amount}</div>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Eye className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Edit className="h-2.5 w-2.5" />
                    </Button>
                    {order.status === "pending" && (
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <CheckCircle className="h-2.5 w-2.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )

    case 'cash-flow':
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
                <span className="font-medium">৳8,450</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Inventory Value</span>
                <span className="font-medium">৳15,000</span>
              </div>
              <div className="border-t pt-1.5">
                <div className="flex justify-between font-medium text-xs">
                  <span>Expected Income</span>
                  <span className="text-green-600">৳23,450</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Progress to next goal</div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-accent h-1.5 rounded-full" style={{width: "68%"}}></div>
              </div>
              <div className="text-[10px] text-muted-foreground">৳23,450 / ৳35,000 monthly target</div>
            </div>
          </CardContent>
        </Card>
      )

    case 'top-product':
      return (
        <Card className="h-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">🏆 Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-xs">Cotton Kurti - Blue</div>
                <div className="text-[10px] text-muted-foreground">25 sold this month</div>
                <div className="text-xs font-medium text-accent">৳1,200 each</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )

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
}