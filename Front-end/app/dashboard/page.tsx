import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { withAuth } from '@workos-inc/authkit-nextjs'
import {
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  MessageSquare,
  Search,
  Star
} from "lucide-react"

export default async function DashboardPage() {
  // Ensure user is authenticated and get user data
  const { user } = await withAuth();

  // Sync user to Supabase (this is idempotent - safe to run on every page load)
  if (user) {
    try {
      const { syncWorkOSUserToSupabase } = await import('@/lib/sync-user');
      await syncWorkOSUserToSupabase(user);
    } catch (error) {
      console.error('Failed to sync user to Supabase:', error);
    }
  }

  // Example: You can now use user data and Supabase
  // const supabase = await createSupabaseClient();
  // const { data } = await supabase.from('orders').select('*').eq('user_id', user.id);
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard" }
      ]}
    >
      {/* Top Stats Row - Hero Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳45,231</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +20.1% from last month
            </div>
            {/* Mini sparkline placeholder */}
            <div className="h-[30px] mt-2 flex items-end space-x-1">
              {[8, 12, 6, 15, 10, 18, 14, 22, 16, 28, 20, 35].map((height, i) => (
                <div key={i} className="bg-accent/30 rounded-sm flex-1" style={{height: `${height}%`}} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+152</div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">12 Pending</Badge>
              <Badge variant="default" className="bg-green-100 text-green-800">140 Completed</Badge>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +5 from yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">৳8,450</div>
            <div className="text-xs text-muted-foreground">5 customers</div>
            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
              Send Reminders
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
            <div className="text-xs text-muted-foreground">Products need restock</div>
            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
              View Items
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Quick Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search orders, customers, products..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Insights */}
        <div className="lg:col-span-2 space-y-4">
          {/* Insights Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Business Insights</CardTitle>
              <CardDescription>Your day-1 ROI dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Time Saved</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">4.5 hours</div>
                  <div className="text-xs text-green-600">This month vs manual tracking</div>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Best Customer</span>
                  </div>
                  <div className="text-lg font-bold text-blue-700">Ayesha Rahman</div>
                  <div className="text-xs text-blue-600">3 orders • ৳8,000 total</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-orange-800">Customer Retention Alert</div>
                    <div className="text-orange-700">5 customers havent ordered in 30 days</div>
                  </div>
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm">7d</Button>
                <Button variant="outline" size="sm" className="bg-accent text-accent-foreground">30d</Button>
                <Button variant="outline" size="sm">90d</Button>
                <Button variant="outline" size="sm">1y</Button>
              </div>
              {/* Chart placeholder */}
              <div className="h-[200px] flex items-end justify-between space-x-2 border rounded-lg p-4 bg-muted/20">
                {Array.from({length: 30}, (_, i) => (
                  <div
                    key={i}
                    className="bg-accent/60 rounded-sm flex-1 max-w-2"
                    style={{height: `${Math.random() * 80 + 20}%`}}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Last 5 orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "#1234", customer: "Fatima Khan", amount: "৳2,450", status: "paid", time: "2 min ago" },
                { id: "#1233", customer: "Rahman Ali", amount: "৳1,200", status: "pending", time: "15 min ago" },
                { id: "#1232", customer: "Nusrat Jahan", amount: "৳3,800", status: "paid", time: "1 hour ago" },
                { id: "#1231", customer: "Sakib Ahmed", amount: "৳950", status: "pending", time: "2 hours ago" },
                { id: "#1230", customer: "Ruma Begum", amount: "৳1,750", status: "paid", time: "3 hours ago" },
              ].map((order, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge
                        variant={order.status === "paid" ? "default" : "secondary"}
                        className={order.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{order.amount}</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      {order.status === "pending" && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Cash Flow Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cash Flow Forecast</CardTitle>
              <CardDescription>Your real wealth calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pending Payments</span>
                  <span className="font-medium">৳8,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inventory Value</span>
                  <span className="font-medium">৳15,000</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Expected Income</span>
                    <span className="text-green-600">৳23,450</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Progress to next goal</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{width: "68%"}}></div>
                </div>
                <div className="text-xs text-muted-foreground">৳23,450 / ৳35,000 monthly target</div>
              </div>
            </CardContent>
          </Card>
          {/* Top Selling Product */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 Top Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Cotton Kurti - Blue</div>
                  <div className="text-sm text-muted-foreground">25 sold this month</div>
                  <div className="text-sm font-medium text-accent">৳1,200 each</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}