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
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "confirmed":
        return <Package className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, order ID, phone..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[150px]">
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Orders List/Grid */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
            <CardDescription>Manage and track all your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Order ID</th>
                    <th className="text-left py-3 px-2">Customer</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Items</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Payment</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{order.id}</td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm">{order.date}</td>
                      <td className="py-3 px-2 text-sm">{order.items.length} items</td>
                      <td className="py-3 px-2 font-medium">৳{order.amount}</td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <OrderDetailsModal order={selectedOrder} />
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {order.paymentStatus === "pending" && (
                            <Button variant="ghost" size="sm">
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
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
                <CardDescription>{order.customer.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {order.customer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {order.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  {order.items.length} items
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">৳{order.amount}</span>
                  </div>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <OrderDetailsModal order={selectedOrder} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
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
        <DialogTitle>Order Details - {order.id}</DialogTitle>
        <DialogDescription>
          Complete order information and status
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        {/* Customer Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Name:</span>
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{order.customer.address}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment:</span>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery:</span>
                <span className="text-sm">{order.delivery}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Order Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">৳{item.price}</div>
                    <div className="text-sm text-muted-foreground">
                      Total: ৳{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>৳{order.amount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          {order.paymentStatus === "pending" && (
            <Button className="flex-1 bg-accent hover:bg-accent/90">
              <CheckCircle className="h-4 w-4 mr-2" />
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
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "confirmed":
      return <Package className="h-4 w-4" />
    case "pending":
      return <Clock className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}