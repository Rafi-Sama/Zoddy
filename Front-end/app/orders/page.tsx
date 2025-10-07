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
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  Package,
  DollarSign,
  Grid3X3,
  List,
  Search,
  Calendar,
  Phone,
  MapPin
} from "lucide-react"
const mockOrders = [
  {
    id: "#1234",
    customer: { name: "Fatima Khan", phone: "+880 1712-345678", address: "Dhanmondi, Dhaka" },
    date: "2024-01-15",
    items: [
      { name: "Cotton Kurti - Blue", quantity: 2, price: 1200 },
      { name: "Silk Scarf", quantity: 1, price: 500 }
    ],
    amount: 2900,
    status: "delivered",
    paymentStatus: "paid",
    delivery: "Standard"
  },
  {
    id: "#1235",
    customer: { name: "Rahman Ali", phone: "+880 1801-234567", address: "Gulshan, Dhaka" },
    date: "2024-01-14",
    items: [
      { name: "Embroidered Shirt", quantity: 1, price: 1800 }
    ],
    amount: 1800,
    status: "shipped",
    paymentStatus: "paid",
    delivery: "Express"
  },
  {
    id: "#1236",
    customer: { name: "Nusrat Jahan", phone: "+880 1915-876543", address: "Uttara, Dhaka" },
    date: "2024-01-13",
    items: [
      { name: "Designer Saree", quantity: 1, price: 3500 },
      { name: "Matching Blouse", quantity: 1, price: 800 }
    ],
    amount: 4300,
    status: "confirmed",
    paymentStatus: "pending",
    delivery: "Standard"
  },
  {
    id: "#1237",
    customer: { name: "Sakib Ahmed", phone: "+880 1704-987654", address: "Banani, Dhaka" },
    date: "2024-01-12",
    items: [
      { name: "Casual T-shirt", quantity: 3, price: 450 }
    ],
    amount: 1350,
    status: "pending",
    paymentStatus: "pending",
    delivery: "Standard"
  }
]

interface Order {
  id: string
  customer: {
    name: string
    phone: string
    address: string
  }
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  amount: number
  status: string
  paymentStatus: string
  delivery: string
}

export default function OrdersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-3.5 w-3.5" />
      case "shipped":
        return <Truck className="h-3.5 w-3.5" />
      case "confirmed":
        return <Package className="h-3.5 w-3.5" />
      case "pending":
        return <Clock className="h-3.5 w-3.5" />
      default:
        return <Clock className="h-3.5 w-3.5" />
    }
  }
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Orders" }
      ]}
    >
      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {/* Search Input - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, order ID, phone..."
                className="pl-10 h-10 text-sm"
              />
            </div>

            {/* Filters - Stack vertically on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2">
              <Select>
                <SelectTrigger className="w-full md:w-[140px] h-10 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[140px] h-10 text-sm">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-10 text-sm px-3 col-span-2 sm:col-span-1 md:col-auto">
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Date Range</span>
              </Button>
            </div>

            {/* Action Buttons - Stack on mobile */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-10 text-sm px-3 flex-1 sm:flex-none">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <div className="flex rounded-md border flex-1 sm:flex-none">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none h-10 px-3 flex-1"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none h-10 px-3 flex-1"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-accent hover:bg-accent/90 h-10 text-sm px-3 flex-1 sm:flex-none">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Order</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Orders List/Grid */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Orders List</CardTitle>
            <CardDescription className="text-xs">Manage and track all your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Items</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Payment</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/50">
                          <td className="py-3 px-3 font-medium text-xs whitespace-nowrap">{order.id}</td>
                          <td className="py-3 px-3">
                            <div>
                              <div className="font-medium text-xs">{order.customer.name}</div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{order.customer.phone}</div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs hidden sm:table-cell whitespace-nowrap">{order.date}</td>
                          <td className="py-3 px-3 text-xs hidden md:table-cell">{order.items.length} items</td>
                          <td className="py-3 px-3 font-medium text-xs whitespace-nowrap">৳{order.amount}</td>
                          <td className="py-3 px-3">
                            <Badge className={getStatusColor(order.status) + " text-[9px] px-2 py-1 whitespace-nowrap"}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize hidden sm:inline">{order.status}</span>
                            </Badge>
                          </td>
                          <td className="py-3 px-3 hidden lg:table-cell">
                            <Badge className={getPaymentStatusColor(order.paymentStatus) + " text-[9px] px-2 py-1 capitalize"}>
                              {order.paymentStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="h-9 w-9 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                  <OrderDetailsModal order={selectedOrder} />
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hidden sm:inline-flex">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {order.paymentStatus === "pending" && (
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hidden md:inline-flex">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm truncate">{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.status) + " text-[9px] px-2 py-1 shrink-0"}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
                <CardDescription className="text-xs truncate">{order.customer.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="truncate">{order.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {order.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Package className="h-4 w-4 shrink-0" />
                  {order.items.length} items
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span className="font-bold text-sm">৳{order.amount}</span>
                  </div>
                  <Badge className={getPaymentStatusColor(order.paymentStatus) + " text-[9px] px-2 py-1 capitalize"}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-10 text-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <OrderDetailsModal order={selectedOrder} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="flex-1 h-10 text-sm">
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  )
}
function OrderDetailsModal({ order }: { order: Order | null }) {
  if (!order) return null
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">Order Details - {order.id}</DialogTitle>
        <DialogDescription className="text-xs">
          Complete order information and status
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {/* Customer Info */}
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs">Name:</span>
                <span className="text-xs">{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="text-xs">{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{order.customer.address}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">Status:</span>
                <Badge className={getStatusColor(order.status) + " text-[9px] px-1.5 py-0"}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Payment:</span>
                <Badge className={getPaymentStatusColor(order.paymentStatus) + " text-[9px] px-1.5 py-0"}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Delivery:</span>
                <span className="text-xs">{order.delivery}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Order Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.items.map((item, index: number) => (
                <div key={index} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-xs">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-xs">৳{item.price}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Total: ৳{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between font-bold text-sm">
                  <span>Total Amount:</span>
                  <span>৳{order.amount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <Button variant="outline" className="flex-1 h-8 text-xs px-3">
            <Edit className="h-3.5 w-3.5 mr-2" />
            Edit Order
          </Button>
          <Button variant="outline" className="flex-1 h-8 text-xs px-3">
            <Download className="h-3.5 w-3.5 mr-2" />
            Print Receipt
          </Button>
          {order.paymentStatus === "pending" && (
            <Button className="flex-1 bg-accent hover:bg-accent/90 h-8 text-xs px-3">
              <CheckCircle className="h-3.5 w-3.5 mr-2" />
              Mark Paid
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "confirmed":
      return "bg-yellow-100 text-yellow-800"
    case "pending":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
function getPaymentStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-orange-100 text-orange-800"
    case "partial":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
function getStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-3.5 w-3.5" />
    case "shipped":
      return <Truck className="h-3.5 w-3.5" />
    case "confirmed":
      return <Package className="h-3.5 w-3.5" />
    case "pending":
      return <Clock className="h-3.5 w-3.5" />
    default:
      return <Clock className="h-3.5 w-3.5" />
  }
}