"use client"
import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { CustomerFormData } from "@/components/customers/add-customer-modal"
import { getCustomerStatusColor, getCustomerStatusIcon } from "@/lib/status-utils"

// Lazy load modals for better initial page load
const AddCustomerModal = dynamic(() => import("@/components/customers/add-customer-modal").then(mod => ({ default: mod.AddCustomerModal })), {
  loading: () => <Button className="bg-accent hover:bg-accent/90" disabled><Plus className="h-4 w-4 mr-2" />Add Customer</Button>,
})

const ImportCustomersModal = dynamic(() => import("@/components/customers/import-customers-modal").then(mod => ({ default: mod.ImportCustomersModal })), {
  loading: () => <Button variant="outline" disabled><Download className="h-4 w-4 mr-2" />Import</Button>,
})
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
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Users,
  Search,
  MessageSquare,
  Phone,
  MapPin,
  Grid3X3,
  List,
  Mail,
  CheckCircle,
  Download,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useData, useMutation } from "@/hooks/use-database-optimized"
import { Customer } from "@/types/database"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { parseISO, format, differenceInDays } from "date-fns"

const getDaysSinceLastOrder = (lastOrderDate: string | null | undefined) => {
  if (!lastOrderDate) return null
  return differenceInDays(new Date(), parseISO(lastOrderDate))
}

// Helper to determine customer status based on order history
const getCustomerStatus = (customer: Customer): string => {
  const totalSpent = customer.total_spent || 0
  const orderCount = customer.total_orders || 0
  const daysSinceLastOrder = getDaysSinceLastOrder(customer.last_order_date || null)

  if (totalSpent > 50000 || orderCount > 20) return "VIP"
  if (daysSinceLastOrder && daysSinceLastOrder > 60) return "Inactive"
  if (orderCount <= 3) return "New"
  return "Regular"
}

// Format customer for display
const formatCustomerForDisplay = (customer: Customer) => {
  const status = getCustomerStatus(customer)
  const averageOrderValue = customer.total_orders && customer.total_orders > 0
    ? Math.round(customer.total_spent / customer.total_orders)
    : 0

  return {
    ...customer,
    status,
    averageOrderValue,
    favoriteCategory: customer.metadata?.favorite_category || "N/A",
    joinDate: customer.created_at ? format(parseISO(customer.created_at), 'yyyy-MM-dd') : 'N/A',
    lastOrder: customer.last_order_date ? format(parseISO(customer.last_order_date), 'yyyy-MM-dd') : 'Never',
    totalOrders: customer.total_orders || 0,
    totalSpent: customer.total_spent || 0
  }
}

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [successMessage, setSuccessMessage] = useState("")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Fetch customers from database (realtime disabled to reduce API requests)
  // Data refreshes on manual refetch() calls instead
  const { data: customersData, loading, error, refetch } = useData<Customer[]>({
    table: 'customers',
    orderBy: { column: 'created_at', ascending: false },
    realtime: false // Disabled to reduce excessive API requests
  })

  // Mutation hooks for customer operations
  const { insert: insertCustomer } = useMutation<Customer>('customers')

  const customers = useMemo(() => customersData || [], [customersData])

  // Calculate statistics CLIENT-SIDE instead of 2 separate API calls
  // This eliminates 2 aggregate queries by computing from already-fetched data
  const { totalCustomers, activeCustomers, retentionRate, churnRate } = useMemo(() => {
    const total = customers.length
    // Active customers = those with orders in last 60 days (not 'Inactive' status)
    const active = customers.filter(c => {
      const status = getCustomerStatus(c)
      return status !== 'Inactive'
    }).length
    const retention = total > 0 ? ((active / total) * 100).toFixed(1) : '0'
    const churn = total > 0 ? (100 - parseFloat(retention)).toFixed(1) : '0'

    return {
      totalCustomers: total,
      activeCustomers: active,
      retentionRate: retention,
      churnRate: churn
    }
  }, [customers])

  const handleImportCustomers = async () => {
    toast.info("Import functionality coming soon")
    setIsImportModalOpen(false)
  }

  const handleAddCustomer = async (customerData: CustomerFormData) => {
    const result = await insertCustomer({
      name: customerData.name,
      email: customerData.email || undefined,
      phone: customerData.phone || undefined,
      address: customerData.address || undefined,
      city: undefined,
      total_spent: 0,
      total_orders: 0
    })

    if (result) {
      setSuccessMessage(`Successfully added ${customerData.name}`)
      setIsAddModalOpen(false)
      setTimeout(() => setSuccessMessage(""), 3000)
      // Cache is automatically invalidated by mutation hook, no refetch needed
    }
  }

  const handleMessage = (customer: Customer) => {
    const message = prompt(`Enter message to send to ${customer.name}:`)
    if (message) {
      toast.success(`Message queued for ${customer.name}`)
    }
  }

  const handleNewOrder = (customer: Customer) => {
    toast.info(`Creating order for ${customer.name} - Navigate to Orders page`)
  }

  const handleViewOrders = (customer: Customer) => {
    toast.info(`Viewing orders for ${customer.name} - Navigate to Orders page with filter`)
  }

  // Filter and sort customers - memoized for performance
  const filteredCustomers = useMemo(() => {
    const displayCustomers = customers.map(formatCustomerForDisplay)

    return displayCustomers
      .filter(customer => {
        const matchesSearch = searchTerm === "" ||
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

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
            if (!a.last_order_date && !b.last_order_date) return 0
            if (!a.last_order_date) return 1
            if (!b.last_order_date) return -1
            return new Date(b.last_order_date).getTime() - new Date(a.last_order_date).getTime()
          case "totalOrders":
            return b.totalOrders - a.totalOrders
          default:
            return 0
        }
      })
  }, [customers, searchTerm, statusFilter, sortBy])

  return (
    <MainLayout
      breadcrumbs={[{ label: "Customers" }]}
    >
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-20" /> : totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-20" /> : `${retentionRate}%`}</div>
            <p className="text-xs text-green-600">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-20" /> : `${churnRate}%`}</div>
            <p className="text-xs text-red-600">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-20" /> :
                `৳${customers.length > 0 ?
                  Math.round(customers.reduce((sum, c) => sum + (c.total_spent / Math.max(c.total_orders, 1)), 0) / customers.length) :
                  0}`
              }
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 md:flex-[2]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, phone, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
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
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="totalSpent">Total Spent</SelectItem>
                  <SelectItem value="lastOrder">Last Order</SelectItem>
                  <SelectItem value="totalOrders">Total Orders</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border md:ml-auto">
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
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-accent hover:bg-accent/90"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
              <AddCustomerModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onAdd={handleAddCustomer}
              />
              <Button
                variant="outline"
                onClick={() => setIsImportModalOpen(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Import
              </Button>
              <ImportCustomersModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                onImport={handleImportCustomers}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading customers...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load customers: {error.message}
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

      {/* Customer List/Grid */}
      {!loading && !error && (
        viewMode === "list" ? (
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                {filteredCustomers.length === 0 ? "No customers found" : `${filteredCustomers.length} customers`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Contact</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Orders</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Spent</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Last Order</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Users className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">No customers found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-sm">{customer.name}</div>
                              <div className="text-xs text-muted-foreground">{customer.joinDate}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {customer.phone || 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{customer.totalOrders}</td>
                          <td className="py-3 px-4 font-medium text-sm">৳{customer.totalSpent}</td>
                          <td className="py-3 px-4 text-sm">{customer.lastOrder}</td>
                          <td className="py-3 px-4">
                            <Badge className={getCustomerStatusColor(customer.status) + " text-xs"}>
                              {getCustomerStatusIcon(customer.status)}
                              <span className="ml-1">{customer.status}</span>
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setIsDetailsDialogOpen(true)
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{customer.name}</CardTitle>
                    <Badge className={getCustomerStatusColor(customer.status) + " text-xs"}>
                      {getCustomerStatusIcon(customer.status)}
                      <span className="ml-1">{customer.status}</span>
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">Customer since {customer.joinDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{customer.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{customer.address || 'No address'}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{customer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-medium">৳{customer.totalSpent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Order</span>
                      <span className="font-medium">{customer.lastOrder}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMessage(customer)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleNewOrder(customer)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewOrders(customer)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Shared Customer Details Dialog - Single instance for all customers */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <CustomerDetailsModal
            customer={selectedCustomer}
            onMessage={handleMessage}
            onNewOrder={handleNewOrder}
            onViewOrders={handleViewOrders}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

interface CustomerDetailsModalProps {
  customer: Customer | null
  onMessage: (customer: Customer) => void
  onNewOrder: (customer: Customer) => void
  onViewOrders: (customer: Customer) => void
}

function CustomerDetailsModal({
  customer,
  onMessage,
  onNewOrder,
  onViewOrders
}: CustomerDetailsModalProps) {
  if (!customer) return null

  const displayCustomer = formatCustomerForDisplay(customer)
  const daysSince = getDaysSinceLastOrder(customer.last_order_date)

  return (
    <>
      <DialogHeader>
        <DialogTitle>{customer.name}</DialogTitle>
        <DialogDescription>Customer Details</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={getCustomerStatusColor(displayCustomer.status) + " text-xs"}>
            {getCustomerStatusIcon(displayCustomer.status)}
            <span className="ml-1">{displayCustomer.status}</span>
          </Badge>
          {daysSince && daysSince > 30 && (
            <Badge variant="outline" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {daysSince} days since last order
            </Badge>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{customer.phone || 'No phone'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{customer.email || 'No email'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{customer.address || 'No address'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-lg font-semibold">{displayCustomer.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold">৳{displayCustomer.totalSpent}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Average Order</p>
            <p className="text-lg font-semibold">৳{displayCustomer.averageOrderValue}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Order</p>
            <p className="text-lg font-semibold">{displayCustomer.lastOrder}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => onMessage(customer)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => onNewOrder(customer)}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => onViewOrders(customer)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Orders
          </Button>
        </div>
      </div>
    </>
  )
}