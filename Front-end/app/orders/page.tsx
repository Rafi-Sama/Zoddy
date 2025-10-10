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
  MapPin,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ImportOrdersModal } from "@/components/orders/import-orders-modal"
import { QuickOrderModal } from "@/components/orders/quick-order-modal"
import { EditOrderModal } from "@/components/orders/edit-order-modal"
import { DateRange } from "react-day-picker"
import { isWithinInterval, parse } from "date-fns"
const mockOrders = [
  {
    id: "#1234",
    customer: { name: "Fatima Khan", phone: "+880 1712-345678", address: "Dhanmondi, Dhaka" },
    date: "15-01-2024",
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
    date: "14-01-2024",
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
    date: "13-01-2024",
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
    date: "12-01-2024",
    items: [
      { name: "Casual T-shirt", quantity: 3, price: 450 }
    ],
    amount: 1350,
    status: "pending",
    paymentStatus: "pending",
    delivery: "Standard"
  },
  {
    id: "#1238",
    customer: { name: "Ayesha Rahman", phone: "+880 1812-654321", address: "Mohammadpur, Dhaka" },
    date: "11-01-2024",
    items: [
      { name: "Winter Jacket", quantity: 1, price: 2500 }
    ],
    amount: 2500,
    status: "returned",
    paymentStatus: "paid",
    delivery: "Express"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
      case "returned":
        return "bg-red-100 text-red-800"
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

  // Handler functions for button actions
  const handleImportOrders = (importedOrders: Order[]) => {
    // Add imported orders to the existing orders
    const today = new Date()
    const newOrders = importedOrders.map(order => ({
      ...order,
      id: order.id || `#${Math.floor(Math.random() * 10000)}`,
      date: order.date || `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`
    }))

    setOrders([...newOrders, ...orders])
    toast.success("Orders imported successfully", {
      description: `${importedOrders.length} orders have been added`
    })
  }

  const handleCreateOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders])
    toast.success("Order created successfully", {
      description: `Order ${newOrder.id} has been created`
    })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (!range) {
      toast.info("Date filter cleared", {
        description: "Showing all orders"
      })
    }
  }


  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedOrder: Order) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    )

    // Update selected order if it's the one being edited
    if (selectedOrder?.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder)
    }

    toast.success("Order updated successfully", {
      description: `Order ${updatedOrder.id} has been updated`
    })
  }

  const handleMarkPaid = async (orderId: string) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update order payment status
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, paymentStatus: "paid" }
            : order
        )
      )

      // Update selected order if it's the one being modified
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: "paid" } : null)
      }

      toast.success("Payment status updated", {
        description: `Order ${orderId} has been marked as paid`
      })
    } catch {
      toast.error("Failed to update payment status", {
        description: "Please try again later"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintReceipt = (order: Order) => {
    toast.info("Print receipt feature coming soon", {
      description: `Receipt generation for order ${order.id} is under development`
    })
  }

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      order.customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    // Payment filter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    // Date range filter
    const matchesDateRange = !dateRange?.from || !dateRange?.to ||
      (order.date && isWithinInterval(parse(order.date, "dd-MM-yyyy", new Date()), {
        start: dateRange.from,
        end: dateRange.to
      }))

    return matchesSearch && matchesStatus && matchesPayment && matchesDateRange
  })

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
            {/* Search, Filters and View Toggle Row - Responsive layout */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input - Takes 2/3 space on desktop, full width on mobile */}
              <div className="relative flex-1 md:flex-[2]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, order ID, phone..."
                  className="pl-10 h-10 text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters - Takes 1/3 space on desktop */}
              <div className="flex gap-2 md:flex-[1]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1 h-10 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="flex-1 h-10 text-sm">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <DateRangePicker
                  date={dateRange}
                  onDateChange={handleDateRangeChange}
                  className="flex-1 min-w-[140px]"
                  placeholder="All dates"
                />
              </div>

              {/* View Toggle - Positioned to the far right */}
              <div className="flex rounded-md border md:ml-auto">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none h-10 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none h-10 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons - Stack on mobile */}
            <div className="flex gap-2">
              <ImportOrdersModal
                onImport={handleImportOrders}
                trigger={
                  <Button variant="outline" className="h-10 text-sm px-3">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Import</span>
                  </Button>
                }
              />
              <QuickOrderModal
                onCreateOrder={handleCreateOrder}
                trigger={
                  <Button className="bg-accent hover:bg-accent/90 h-10 text-sm px-3">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">New Order</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Results Count */}
      {(searchTerm || statusFilter !== "all" || paymentFilter !== "all" || dateRange) && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
              {(searchTerm || statusFilter !== "all" || paymentFilter !== "all" || dateRange) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setPaymentFilter("all")
                    setDateRange(undefined)
                    toast.info("Filters cleared")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List/Grid */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Orders List</CardTitle>
            <CardDescription className="text-xs">
              {filteredOrders.length === 0
                ? "No orders match your filters"
                : "Manage and track all your orders"}
            </CardDescription>
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
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Package className="h-10 w-10 text-muted-foreground mb-3" />
                              <p className="text-sm text-muted-foreground">No orders found</p>
                              <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
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
                                  <OrderDetailsModal
                                    order={selectedOrder}
                                    onEditOrder={handleEditOrder}
                                    onPrintReceipt={handlePrintReceipt}
                                    onMarkPaid={handleMarkPaid}
                                    isProcessing={isProcessing}
                                  />
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hidden sm:inline-flex"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {order.paymentStatus === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hidden md:inline-flex"
                                  onClick={() => handleMarkPaid(order.id)}
                                  disabled={isProcessing}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-1">No orders found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new order</p>
              <div className="mt-4">
                <QuickOrderModal
                  onCreateOrder={handleCreateOrder}
                  trigger={
                    <Button className="bg-accent hover:bg-accent/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Order
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
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
                      <OrderDetailsModal
                        order={selectedOrder}
                        onEditOrder={handleEditOrder}
                        onPrintReceipt={handlePrintReceipt}
                        onMarkPaid={handleMarkPaid}
                        isProcessing={isProcessing}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 text-sm"
                    onClick={() => handleEditOrder(order)}
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingOrder(null)
          }}
          onSave={handleSaveEdit}
        />
      )}
    </MainLayout>
  )
}
interface OrderDetailsModalProps {
  order: Order | null
  onEditOrder: (order: Order) => void
  onPrintReceipt: (order: Order) => void
  onMarkPaid: (orderId: string) => void
  isProcessing: boolean
}

function OrderDetailsModal({
  order,
  onEditOrder,
  onPrintReceipt,
  onMarkPaid,
  isProcessing
}: OrderDetailsModalProps) {
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
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs px-3"
            onClick={() => onEditOrder(order)}
          >
            <Edit className="h-3.5 w-3.5 mr-2" />
            Edit Order
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs px-3"
            onClick={() => onPrintReceipt(order)}
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Print Receipt
          </Button>
          {order.paymentStatus === "pending" && (
            <Button
              className="flex-1 bg-accent hover:bg-accent/90 h-8 text-xs px-3"
              onClick={() => onMarkPaid(order.id)}
              disabled={isProcessing}
            >
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
    case "returned":
      return "bg-red-100 text-red-800"
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
    case "returned":
      return <RefreshCw className="h-3.5 w-3.5" />
    default:
      return <Clock className="h-3.5 w-3.5" />
  }
}