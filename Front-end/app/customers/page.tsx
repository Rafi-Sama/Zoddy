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
  Calendar
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
        return <Crown className="h-4 w-4" />
      case "Regular":
        return <Users className="h-4 w-4" />
      case "New":
        return <Plus className="h-4 w-4" />
      case "Inactive":
        return <Clock className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }
  const getDaysSinceLastOrder = (lastOrder: string) => {
    const today = new Date()
    const orderDate = new Date(lastOrder)
    const diffTime = Math.abs(today.getTime() - orderDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Customers" }
      ]}
    >
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockCustomers.filter(c => c.status === "VIP").length}
            </div>
            <p className="text-xs text-muted-foreground">
              High-value customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{Math.round(mockCustomers.reduce((acc, customer) => acc + customer.averageOrderValue, 0) / mockCustomers.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Customers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockCustomers.filter(c => getDaysSinceLastOrder(c.lastOrder) > 30).length}
            </div>
            <p className="text-xs text-muted-foreground">
              No orders in 30+ days
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[150px]">
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
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="totalSpent">Total Spent</SelectItem>
                  <SelectItem value="lastOrder">Last Order</SelectItem>
                  <SelectItem value="totalOrders">Order Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Broadcast Message
              </Button>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Customer Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Customers</CardTitle>
            <CardDescription>By total revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCustomers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="font-bold text-accent text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.totalOrders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">৳{customer.totalSpent.toLocaleString()}</div>
                    <Badge className={getStatusColor(customer.status)} variant="secondary">
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Segments</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["VIP", "Regular", "New", "Inactive"].map((status) => {
              const count = mockCustomers.filter(c => c.status === status).length
              const percentage = Math.round((count / mockCustomers.length) * 100)
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="text-sm">{status} Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{count}</div>
                    <div className="text-xs text-muted-foreground">({percentage}%)</div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Attention</CardTitle>
            <CardDescription>Customers requiring follow-up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCustomers
              .filter(c => getDaysSinceLastOrder(c.lastOrder) > 30)
              .map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last order: {getDaysSinceLastOrder(customer.lastOrder)} days ago
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>Complete customer database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="font-bold text-accent">{customer.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.favoriteCategory}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusIcon(customer.status)}
                      <span className="ml-1">{customer.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Orders</div>
                      <div className="font-semibold">{customer.totalOrders}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Spent</div>
                      <div className="font-semibold">৳{customer.totalSpent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg Order</div>
                      <div className="font-semibold">৳{customer.averageOrderValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Last Order</div>
                      <div className="font-semibold">{getDaysSinceLastOrder(customer.lastOrder)}d ago</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Customer since {customer.joinDate}</span>
                    </div>
                  </div>
                  {getDaysSinceLastOrder(customer.lastOrder) > 30 && (
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-2 text-orange-800 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        Inactive customer - consider outreach
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CustomerDetailsModal customer={selectedCustomer} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
function CustomerDetailsModal({ customer }: { customer: Customer | null }) {
  if (!customer) return null
  return (
    <>
      <DialogHeader>
        <DialogTitle>Customer Details - {customer.name}</DialogTitle>
        <DialogDescription>
          Complete customer information and order history
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Full Name</div>
                <div className="font-medium">{customer.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{customer.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{customer.email}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="font-medium">{customer.address}</div>
            </div>
          </CardContent>
        </Card>
        {/* Order Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-accent">{customer.totalOrders}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">৳{customer.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">৳{customer.averageOrderValue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Avg Order Value</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{customer.favoriteCategory}</div>
                <div className="text-sm text-muted-foreground">Favorite Category</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-accent hover:bg-accent/90">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <Button variant="outline" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
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