"use client"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Crown,
  Clock,
  Users,
  Search,
  MessageSquare,
  Phone,
  MapPin,
  Grid3X3,
  List,
  Mail,
  Edit
} from "lucide-react"
const mockCustomers = [
  {
    id: "1",
    name: "Fatima Rahman",
    phone: "+880 1712-345678",
    email: "fatima@email.com",
    address: "Dhanmondi, Dhaka",
    totalOrders: 15,
    totalSpent: 45000,
    lastOrder: "2024-01-10",
    status: "VIP",
    averageOrderValue: 3000,
    joinDate: "2023-06-15",
    favoriteCategory: "Fashion"
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    phone: "+880 1801-234567",
    email: "ahmed@email.com",
    address: "Gulshan, Dhaka",
    totalOrders: 8,
    totalSpent: 22000,
    lastOrder: "2024-01-05",
    status: "Regular",
    averageOrderValue: 2750,
    joinDate: "2023-09-20",
    favoriteCategory: "Electronics"
  },
  {
    id: "3",
    name: "Nusrat Jahan",
    phone: "+880 1915-876543",
    email: "nusrat@email.com",
    address: "Uttara, Dhaka",
    totalOrders: 25,
    totalSpent: 78000,
    lastOrder: "2024-01-12",
    status: "VIP",
    averageOrderValue: 3120,
    joinDate: "2023-03-10",
    favoriteCategory: "Fashion"
  },
  {
    id: "4",
    name: "Sakib Ahmed",
    phone: "+880 1704-987654",
    email: "sakib@email.com",
    address: "Banani, Dhaka",
    totalOrders: 3,
    totalSpent: 8500,
    lastOrder: "2023-12-20",
    status: "New",
    averageOrderValue: 2833,
    joinDate: "2023-11-15",
    favoriteCategory: "Fashion"
  },
  {
    id: "5",
    name: "Rashida Begum",
    phone: "+880 1556-123456",
    email: "rashida@email.com",
    address: "Mirpur, Dhaka",
    totalOrders: 12,
    totalSpent: 35000,
    lastOrder: "2023-11-25",
    status: "Inactive",
    averageOrderValue: 2917,
    joinDate: "2023-05-08",
    favoriteCategory: "Home & Kitchen"
  }
]

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: string
  averageOrderValue: number
  joinDate: string
  favoriteCategory: string
}

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Customer analytics
  const totalCustomers = mockCustomers.length
  const newCustomersThisMonth = 2 // This would be calculated from real data
  const retentionRate = 87.5 // From analytics page
  const churnRate = 12.5
  const customerLifetimeValue = 8450
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-100 text-purple-800"
      case "Regular":
        return "bg-blue-100 text-blue-800"
      case "New":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VIP":
        return <Crown className="h-3.5 w-3.5" />
      case "Regular":
        return <Users className="h-3.5 w-3.5" />
      case "New":
        return <Plus className="h-3.5 w-3.5" />
      case "Inactive":
        return <Clock className="h-3.5 w-3.5" />
      default:
        return <Users className="h-3.5 w-3.5" />
    }
  }
  const getDaysSinceLastOrder = (lastOrder: string) => {
    const today = new Date()
    const orderDate = new Date(lastOrder)
    const diffTime = Math.abs(today.getTime() - orderDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter and sort customers
  const filteredCustomers = mockCustomers
    .filter(customer => {
      const matchesSearch = searchTerm === "" ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" ||
        customer.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "totalSpent":
          return b.totalSpent - a.totalSpent
        case "lastOrder":
          return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
        case "totalOrders":
          return b.totalOrders - a.totalOrders
        default:
          return 0
      }
    })
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Customers" }
      ]}
    >
      {/* Summary Cards with Analytics */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Total Customers</CardTitle>
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{totalCustomers}</div>
            <div className="flex items-center text-[10px] text-green-600">
              <TrendingUp className="h-2.5 w-2.5 mr-1" />
              +{newCustomersThisMonth} this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Retention Rate</CardTitle>
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">{retentionRate}%</div>
            <div className="text-[10px] text-muted-foreground">
              Churn: {churnRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Lifetime Value</CardTitle>
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">৳{customerLifetimeValue.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">
              Per customer avg
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">VIP Customers</CardTitle>
            <Crown className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">
              {mockCustomers.filter(c => c.status === "VIP").length}
            </div>
            <div className="text-[10px] text-muted-foreground">
              High-value segment
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Need Attention</CardTitle>
            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-600">
              {mockCustomers.filter(c => getDaysSinceLastOrder(c.lastOrder) > 30).length}
            </div>
            <div className="text-[10px] text-muted-foreground">
              No orders 30+ days
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="pt-3">
          <div className="space-y-3">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email..."
                  className="pl-10 h-8 text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="totalSpent">Total Spent</SelectItem>
                  <SelectItem value="lastOrder">Last Order</SelectItem>
                  <SelectItem value="totalOrders">Order Count</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none h-8 px-2"
                  size="sm"
                >
                  <List className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none h-8 px-2"
                  size="sm"
                >
                  <Grid3X3 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1.5">
              <Button variant="outline" className="h-8 text-xs px-3">
                <MessageSquare className="h-3 w-3 mr-2" />
                Broadcast
              </Button>
              <Button className="bg-accent hover:bg-accent/90 h-8 text-xs px-3">
                <Plus className="h-3 w-3 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Customer Insights */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Customers</CardTitle>
            <CardDescription className="text-xs">By total revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockCustomers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="font-bold text-accent text-xs">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-xs">{customer.name}</div>
                      <div className="text-[10px] text-muted-foreground">{customer.totalOrders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs">৳{customer.totalSpent.toLocaleString()}</div>
                    <Badge className={`${getStatusColor(customer.status)} text-[9px] px-1.5 py-0`} variant="secondary">
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Customer Segments</CardTitle>
            <CardDescription className="text-xs">Distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {["VIP", "Regular", "New", "Inactive"].map((status) => {
              const count = mockCustomers.filter(c => c.status === status).length
              const percentage = Math.round((count / mockCustomers.length) * 100)
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(status)}
                    <span className="text-xs">{status} Customers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="text-xs font-medium">{count}</div>
                    <div className="text-[10px] text-muted-foreground">({percentage}%)</div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Need Attention</CardTitle>
            <CardDescription className="text-xs">Customers requiring follow-up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockCustomers
              .filter(c => getDaysSinceLastOrder(c.lastOrder) > 30)
              .map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-1.5 border rounded-lg">
                  <div>
                    <div className="font-medium text-xs">{customer.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Last order: {getDaysSinceLastOrder(customer.lastOrder)} days ago
                    </div>
                  </div>
                  <Button className="h-6 text-[10px] px-2" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      {/* Customers Display - Grid or List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="font-bold text-accent text-xs">{customer.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-xs">{customer.name}</div>
                        <div className="text-[10px] text-muted-foreground">{customer.favoriteCategory}</div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(customer.status)} text-[9px] px-1 py-0`}>
                      {customer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <div className="text-muted-foreground">Total Orders</div>
                      <div className="font-semibold text-xs">{customer.totalOrders}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Spent</div>
                      <div className="font-semibold text-xs">৳{customer.totalSpent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg Order</div>
                      <div className="font-semibold text-xs">৳{Math.round(customer.averageOrderValue).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Last Order</div>
                      <div className="font-semibold text-xs">{getDaysSinceLastOrder(customer.lastOrder)}d ago</div>
                    </div>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  </div>
                  {getDaysSinceLastOrder(customer.lastOrder) > 30 && (
                    <div className="p-1 bg-orange-50 border border-orange-200 rounded">
                      <div className="flex items-center gap-1 text-orange-800 text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        Inactive - needs outreach
                      </div>
                    </div>
                  )}
                  <div className="flex gap-1 pt-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 h-6 text-[10px] px-2"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CustomerDetailsModal customer={selectedCustomer} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="h-6 px-1.5">
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" className="h-6 px-1.5">
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Customer Management</CardTitle>
            <CardDescription className="text-xs">Complete customer database with analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1.5 text-xs">Customer</th>
                    <th className="text-left py-2 px-1.5 text-xs">Contact</th>
                    <th className="text-left py-2 px-1.5 text-xs">Orders</th>
                    <th className="text-left py-2 px-1.5 text-xs">Total Spent</th>
                    <th className="text-left py-2 px-1.5 text-xs">Avg Order</th>
                    <th className="text-left py-2 px-1.5 text-xs">Last Order</th>
                    <th className="text-left py-2 px-1.5 text-xs">Status</th>
                    <th className="text-left py-2 px-1.5 text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const daysSinceLastOrder = getDaysSinceLastOrder(customer.lastOrder)
                    return (
                      <tr key={customer.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                              <span className="font-bold text-accent text-xs">{customer.name[0]}</span>
                            </div>
                            <div>
                              <div className="font-medium text-xs">{customer.name}</div>
                              <div className="text-[10px] text-muted-foreground">{customer.favoriteCategory}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Phone className="h-2.5 w-2.5" />
                              {customer.phone}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Mail className="h-2.5 w-2.5" />
                              {customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="font-medium text-xs">{customer.totalOrders}</div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="font-medium text-xs">৳{customer.totalSpent.toLocaleString()}</div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="text-xs">৳{customer.averageOrderValue.toLocaleString()}</div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="text-xs">{daysSinceLastOrder}d ago</div>
                          {daysSinceLastOrder > 30 && (
                            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                          )}
                        </td>
                        <td className="py-2 px-1.5">
                          <Badge className={`${getStatusColor(customer.status)} text-[9px] px-1.5 py-0`}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-6 px-1.5"
                                  onClick={() => setSelectedCustomer(customer)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <CustomerDetailsModal customer={selectedCustomer} />
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" className="h-6 px-1.5">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" className="h-6 px-1.5">
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  )
}
function CustomerDetailsModal({ customer }: { customer: Customer | null }) {
  if (!customer) return null
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">Customer Details - {customer.name}</DialogTitle>
        <DialogDescription className="text-xs">
          Complete customer information and order history
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Full Name</div>
                <div className="font-medium text-sm">{customer.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge className={`${getStatusColor(customer.status)} text-[9px] px-1.5 py-0`}>{customer.status}</Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="font-medium text-sm">{customer.phone}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium text-sm">{customer.email}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Address</div>
              <div className="font-medium text-sm">{customer.address}</div>
            </div>
          </CardContent>
        </Card>
        {/* Order Statistics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-accent">{customer.totalOrders}</div>
                <div className="text-xs text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-green-600">৳{customer.totalSpent.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-blue-600">৳{customer.averageOrderValue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Avg Order Value</div>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-purple-600">{customer.favoriteCategory}</div>
                <div className="text-xs text-muted-foreground">Favorite Category</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <div className="flex gap-1.5">
          <Button className="flex-1 bg-accent hover:bg-accent/90 h-8 text-xs px-3">
            <MessageSquare className="h-3.5 w-3.5 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" className="flex-1 h-8 text-xs px-3">
            <ShoppingCart className="h-3.5 w-3.5 mr-2" />
            New Order
          </Button>
          <Button variant="outline" className="flex-1 h-8 text-xs px-3">
            <TrendingUp className="h-3.5 w-3.5 mr-2" />
            View Orders
          </Button>
        </div>
      </div>
    </>
  )
}
function getStatusColor(status: string) {
  switch (status) {
    case "VIP":
      return "bg-purple-100 text-purple-800"
    case "Regular":
      return "bg-blue-100 text-blue-800"
    case "New":
      return "bg-green-100 text-green-800"
    case "Inactive":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}