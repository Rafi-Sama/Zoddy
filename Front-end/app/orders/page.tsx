"use client"
import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
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
} from "@/components/ui/dialog"
import {
  Plus,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Package,
  DollarSign,
  Grid3X3,
  List,
  Search,
  Calendar,
  Phone,
  MapPin,
  AlertCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { isWithinInterval, parseISO, format } from "date-fns"
import { useData, useMutation } from "@/hooks/use-database-optimized"
import { Order } from "@/types/database"
import { getStatusColor, getStatusIcon, getPaymentStatusColor } from "@/lib/status-utils"
import { getChannelIcon, getChannelColor, getChannelName, getAIBadge } from "@/lib/channel-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Lazy load heavy modals for better initial page load
const ImportOrdersModal = dynamic(() => import("@/components/orders/import-orders-modal").then(mod => ({ default: mod.ImportOrdersModal })), {
  loading: () => <Button variant="outline" className="h-10 text-sm px-3" disabled><Download className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Import</span></Button>,
})

const QuickOrderModal = dynamic(() => import("@/components/orders/quick-order-modal").then(mod => ({ default: mod.QuickOrderModal })), {
  loading: () => <Button className="bg-accent hover:bg-accent/90 h-10 text-sm px-3" disabled><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">New Order</span></Button>,
})

const EditOrderModal = dynamic(() => import("@/components/orders/edit-order-modal").then(mod => ({ default: mod.EditOrderModal })), {
  ssr: false,
})

// Type for formatted order display
interface FormattedOrder extends Order {
  customer: {
    name: string
    phone: string
    address: string
  }
  date: string
  amount: number
  paymentStatus: string
  delivery: string
}

// Type for editable order (used by EditOrderModal)
interface EditableOrder {
  id: string
  customer: {
    name: string
    phone: string
    address: string
  }
  date: string
  items: Array<{
    id?: string
    name: string
    quantity: number
    price: number
  }>
  amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | string
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed' | string
  delivery: 'ecourier' | 'redx' | 'pathao' | 'steadfast' | 'paperfly' | 'sundarban' | string
}

// Helper function to format order for display
const formatOrderForDisplay = (order: Order): FormattedOrder => {
  return {
    ...order,
    customer: {
      name: order.customer_name || 'Unknown Customer',
      phone: order.customer_phone || '',
      address: order.shipping_address || ''
    },
    date: order.created_at ? format(parseISO(order.created_at), 'dd-MM-yyyy') : '',
    amount: order.total_amount,
    paymentStatus: order.payment_status,
    delivery: order.delivery_provider || 'Standard'
  }
}

export default function OrdersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch orders from database (realtime disabled to reduce API requests)
  // Realtime updates removed to prevent excessive HEAD/GET requests
  // Data refreshes on manual refetch() calls instead
  const { data: ordersData, loading, error, refetch } = useData<Order[]>({
    table: 'orders',
    select: 'id,order_number,customer_name,customer_phone,customer_email,customer_address,items,subtotal,discount,delivery_charge,total_amount,status,payment_status,payment_method,channel,created_at,updated_at',
    orderBy: { column: 'created_at', ascending: false },
    limit: 1000, // Fetch up to 1000 orders
    realtime: false // Disabled to reduce 7k+ excessive API requests
  })

  // Mutation hook for order operations
  const { update: updateOrder } = useMutation<Order>('orders')

  // Use database data or empty array
  const orders = useMemo(() => ordersData || [], [ordersData])

  // Handler functions for button actions
  const handleImportOrders = (importedOrders: Order[]) => {
    // The ImportOrdersModal handles the order import
    toast.success("Orders imported successfully", {
      description: `${importedOrders.length} orders have been added`
    })
    // Cache is automatically invalidated by mutation hook, no refetch needed
  }

  const handleCreateOrder = async () => {
    // New order will be handled by the modal component using the mutation hook
    toast.success("Order created successfully", {
      description: `Order has been created`
    })
    // Cache is automatically invalidated by mutation hook, no refetch needed
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

  const handleSaveEdit = async (updatedOrder: Order | EditableOrder) => {
    // Convert EditableOrder format to database Order format if needed
    let orderToSave: Partial<Order>

    if ('customer' in updatedOrder && typeof updatedOrder.customer === 'object') {
      // This is an EditableOrder, convert to database Order format
      const editable = updatedOrder as EditableOrder
      orderToSave = {
        id: editable.id,
        customer_name: editable.customer.name,
        customer_phone: editable.customer.phone,
        shipping_address: editable.customer.address,
        items: editable.items?.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })) || [],
        total_amount: editable.amount,
        status: editable.status as Order['status'],
        payment_status: editable.paymentStatus as Order['payment_status'],
        delivery_provider: editable.delivery as Order['delivery_provider']
      }
    } else {
      // Already in database Order format
      orderToSave = updatedOrder as Order
    }

    const result = await updateOrder(updatedOrder.id, orderToSave)

    if (result) {
      // Update selected order if it's the one being edited
      if (selectedOrder?.id === updatedOrder.id) {
        setSelectedOrder(result)
      }

      setIsEditModalOpen(false)
      setEditingOrder(null)
      // Cache is automatically invalidated by mutation hook, no refetch needed
    }
  }

  const handleMarkPaid = async (orderId: string) => {
    setIsProcessing(true)
    try {
      const result = await updateOrder(orderId, { payment_status: 'paid' })

      if (result) {
        // Update selected order if it's the one being modified
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(result)
        }
        // Cache is automatically invalidated by mutation hook, no refetch needed
        toast.success("Payment status updated", {
          description: "Order marked as paid successfully"
        })
      }
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

  // Filter orders based on search and filters - memoized for performance
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = searchTerm === "" ||
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone?.includes(searchTerm) ||
        order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      // Payment filter
      const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter

      // Date range filter
      const matchesDateRange = !dateRange?.from || !dateRange?.to ||
        (order.created_at && isWithinInterval(parseISO(order.created_at), {
          start: dateRange.from,
          end: dateRange.to
        }))

      return matchesSearch && matchesStatus && matchesPayment && matchesDateRange
    })
  }, [orders, searchTerm, statusFilter, paymentFilter, dateRange])

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

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load orders: {error.message}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Orders List/Grid */}
      {!loading && !error && viewMode === "list" ? (
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
                        filteredOrders.map((order) => {
                          const displayOrder = formatOrderForDisplay(order)
                          return (
                          <tr key={order.id} className="hover:bg-muted/50">
                            <td className="py-3 px-3 font-medium text-xs whitespace-nowrap">{order.order_number || order.id.slice(0, 8)}</td>
                            <td className="py-3 px-3">
                              <div>
                                <div className="font-medium text-xs">{displayOrder.customer.name}</div>
                                <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{displayOrder.customer.phone}</div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-xs hidden sm:table-cell whitespace-nowrap">{displayOrder.date}</td>
                            <td className="py-3 px-3 text-xs hidden md:table-cell">{order.items?.length || 0} items</td>
                            <td className="py-3 px-3 font-medium text-xs whitespace-nowrap">৳{order.total_amount || 0}</td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col gap-1">
                                <Badge className={getStatusColor(order.status) + " text-[9px] px-2 py-1 whitespace-nowrap"}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize hidden sm:inline">{order.status}</span>
                                </Badge>
                                {order.channel && (
                                  <Badge variant="outline" className={getChannelColor(order.channel) + " text-[9px] px-1.5 py-0.5 whitespace-nowrap"}>
                                    {getChannelIcon(order.channel)}
                                    <span className="ml-1 hidden sm:inline">{getChannelName(order.channel)}</span>
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 hidden lg:table-cell">
                              <Badge className={getPaymentStatusColor(order.payment_status) + " text-[9px] px-2 py-1 capitalize"}>
                                {order.payment_status}
                              </Badge>
                            </td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setIsDetailsDialogOpen(true)
                                }}
                                className="h-9 w-9 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hidden sm:inline-flex"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {order.payment_status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hidden md:inline-flex"
                                  onClick={() => handleMarkPaid(order.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        )})
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : !loading && !error ? (
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
          {filteredOrders.map((order) => {
            const displayOrder = formatOrderForDisplay(order)
            return (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">{order.order_number || order.id.slice(0, 8)}</CardTitle>
                    {order.channel && (
                      <Badge variant="outline" className={getChannelColor(order.channel) + " text-[9px] px-1.5 py-0.5 w-fit"}>
                        {getChannelIcon(order.channel)}
                        <span className="ml-1">{getChannelName(order.channel)}</span>
                      </Badge>
                    )}
                  </div>
                  <Badge className={getStatusColor(order.status) + " text-[9px] px-2 py-1 shrink-0"}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
                <CardDescription className="text-xs truncate">{displayOrder.customer.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="truncate">{displayOrder.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {displayOrder.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Package className="h-4 w-4 shrink-0" />
                  {order.items?.length || 0} items
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span className="font-bold text-sm">৳{order.total_amount || 0}</span>
                  </div>
                  <Badge className={getPaymentStatusColor(order.payment_status) + " text-[9px] px-2 py-1 capitalize"}>
                    {order.payment_status}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 text-sm"
                    onClick={() => {
                      setSelectedOrder(order)
                      setIsDetailsDialogOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
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
            )})}
        </div>
      )) : null}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order={editingOrder as any}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingOrder(null)
          }}
          onSave={handleSaveEdit}
        />
      )}

      {/* Shared Order Details Dialog - Single instance for all orders */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
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
                <span className="text-xs">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="text-xs">{order.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{order.shipping_address}</span>
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
                <Badge className={getPaymentStatusColor(order.payment_status) + " text-[9px] px-1.5 py-0"}>
                  {order.payment_status}
                </Badge>
              </div>
              {order.channel && (
                <div className="flex items-center justify-between">
                  <span className="text-xs">Channel:</span>
                  <Badge variant="outline" className={getChannelColor(order.channel) + " text-[9px] px-1.5 py-0"}>
                    {getChannelIcon(order.channel)}
                    <span className="ml-1">{getChannelName(order.channel)}</span>
                  </Badge>
                </div>
              )}
              {getAIBadge(order.metadata) && (
                <div className="flex items-center justify-between">
                  <span className="text-xs">Auto-created:</span>
                  {getAIBadge(order.metadata)}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs">Delivery:</span>
                <span className="text-xs">{order.delivery_provider}</span>
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
                    <div className="font-medium text-xs">{item.product_name}</div>
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
                  <span>৳{order.total_amount}</span>
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
          {order.payment_status === "pending" && (
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