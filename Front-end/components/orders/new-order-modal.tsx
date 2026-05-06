"use client"

import * as React from "react"
import { useState } from "react"
import {
  Plus,
  Minus,
  Search,
  User,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  X,
  ShoppingCart,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: {
    name: string
    phone: string
    email?: string
    address: string
  }
  date: string
  items: OrderItem[]
  amount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  delivery: string
  channel?: string
  notes?: string
  discount?: number
  deliveryCharge?: number
}

interface NewOrderModalProps {
  onCreateOrder: (order: Order) => void
  trigger?: React.ReactNode
}

// Mock products for autocomplete
const mockProducts = [
  { id: "1", name: "Cotton Kurti", price: 1200, stock: 50 },
  { id: "2", name: "Silk Saree", price: 3500, stock: 20 },
  { id: "3", name: "Embroidered Shirt", price: 1800, stock: 30 },
  { id: "4", name: "Designer Blouse", price: 800, stock: 45 },
  { id: "5", name: "Casual T-shirt", price: 450, stock: 100 },
]

// Mock existing customers
const mockCustomers = [
  { id: "1", name: "Fatima Khan", phone: "+880 1712-345678", address: "Dhanmondi, Dhaka", email: "fatima@example.com" },
  { id: "2", name: "Rahman Ali", phone: "+880 1801-234567", address: "Gulshan, Dhaka", email: "rahman@example.com" },
  { id: "3", name: "Nusrat Jahan", phone: "+880 1915-876543", address: "Uttara, Dhaka", email: "nusrat@example.com" },
]

export function NewOrderModal({ onCreateOrder, trigger }: NewOrderModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("customer")
  const [customerSearch, setCustomerSearch] = useState("")
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [showProductSuggestions, setShowProductSuggestions] = useState(false)

  // Customer details
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")

  // Order details
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [orderChannel, setOrderChannel] = useState("whatsapp")
  const [deliveryType, setDeliveryType] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [orderNotes, setOrderNotes] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCharge = deliveryType === "express" ? 120 : 60
  const total = subtotal - discount + deliveryCharge

  const handleCustomerSelect = (customer: typeof mockCustomers[0]) => {
    setCustomerName(customer.name)
    setCustomerPhone(customer.phone)
    setCustomerEmail(customer.email)
    setCustomerAddress(customer.address)
    setCustomerSearch(customer.name)
    setShowCustomerSuggestions(false)
  }

  const handleProductSelect = (product: typeof mockProducts[0]) => {
    const existingItem = orderItems.find(item => item.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      setOrderItems([...orderItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }])
    }
    setProductSearch("")
    setShowProductSuggestions(false)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId))
  }

  const handleCreateOrder = () => {
    // Validation
    if (!customerName || !customerPhone) {
      toast.error("Missing customer information", {
        description: "Please provide customer name and phone number"
      })
      setActiveTab("customer")
      return
    }

    if (orderItems.length === 0) {
      toast.error("No items in order", {
        description: "Please add at least one item to the order"
      })
      setActiveTab("items")
      return
    }

    const newOrder = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress
      },
      date: `${new Date().getDate().toString().padStart(2, '0')}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getFullYear()}`,
      items: orderItems,
      amount: total,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      delivery: deliveryType,
      channel: orderChannel,
      notes: orderNotes,
      discount,
      deliveryCharge
    }

    onCreateOrder(newOrder)
    toast.success("Order created successfully!", {
      description: `Order ${newOrder.id} has been created for ${customerName}`
    })

    // Reset form
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setActiveTab("customer")
    setCustomerName("")
    setCustomerPhone("")
    setCustomerEmail("")
    setCustomerAddress("")
    setCustomerSearch("")
    setOrderItems([])
    setOrderChannel("whatsapp")
    setDeliveryType("standard")
    setPaymentMethod("cash")
    setOrderNotes("")
    setDiscount(0)
    setProductSearch("")
  }

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  )

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Add customer details and order items to create a new order
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* Customer Tab */}
          <TabsContent value="customer" className="space-y-4">
            <div className="space-y-4">
              {/* Customer Search */}
              <div className="relative">
                <Label htmlFor="customer-search">Search Existing Customer</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customer-search"
                    placeholder="Search by name or phone..."
                    className="pl-10"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value)
                      setShowCustomerSuggestions(true)
                    }}
                    onFocus={() => setShowCustomerSuggestions(true)}
                  />
                </div>

                {/* Customer Suggestions Dropdown */}
                {showCustomerSuggestions && customerSearch && filteredCustomers.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto">
                    <CardContent className="p-0">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          className="w-full text-left p-3 hover:bg-muted transition-colors"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div className="font-medium text-sm">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.phone}</div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator className="my-4" />

              {/* Customer Form */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">
                    <User className="inline h-4 w-4 mr-1" />
                    Customer Name *
                  </Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-phone">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number *
                  </Label>
                  <Input
                    id="customer-phone"
                    placeholder="+880 1XXX-XXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-email">
                    Email (Optional)
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-channel">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    Order Channel
                  </Label>
                  <Select value={orderChannel} onValueChange={setOrderChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-address">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Delivery Address
                </Label>
                <Textarea
                  id="customer-address"
                  placeholder="Enter full delivery address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-4">
            {/* Product Search */}
            <div className="relative">
              <Label htmlFor="product-search">Add Products</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="product-search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value)
                    setShowProductSuggestions(true)
                  }}
                  onFocus={() => setShowProductSuggestions(true)}
                />
              </div>

              {/* Product Suggestions */}
              {showProductSuggestions && productSearch && filteredProducts.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto">
                  <CardContent className="p-0">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        className="w-full text-left p-3 hover:bg-muted transition-colors"
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
                          </div>
                          <div className="font-medium">৳{product.price}</div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Items */}
            {orderItems.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No items added yet</p>
                  <p className="text-xs text-muted-foreground">Search and add products to this order</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">৳{item.price} per unit</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <div className="w-20 text-right font-medium">
                          ৳{item.price * item.quantity}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Discount */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="discount">Discount (৳)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-32"
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery & Payment Tab */}
          <TabsContent value="delivery" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  <Truck className="inline h-4 w-4 mr-1" />
                  Delivery Type
                </Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (৳60)</SelectItem>
                    <SelectItem value="express">Express (৳120)</SelectItem>
                    <SelectItem value="pickup">Store Pickup (Free)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  <CreditCard className="inline h-4 w-4 mr-1" />
                  Payment Method
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-notes">
                Order Notes (Optional)
              </Label>
              <Textarea
                id="order-notes"
                placeholder="Any special instructions or notes for this order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            {/* Customer Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{customerName || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{customerPhone || "Not provided"}</span>
                </div>
                {customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{customerEmail}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right max-w-[200px]">{customerAddress || "Not provided"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>৳{item.price * item.quantity}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>৳{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-৳{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span>৳{deliveryCharge}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-lg">৳{total}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    <Truck className="h-3 w-3 mr-1" />
                    {deliveryType}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {paymentMethod}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {orderChannel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              resetForm()
            }}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            {activeTab !== "customer" && (
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ["customer", "items", "delivery", "summary"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1])
                  }
                }}
              >
                Previous
              </Button>
            )}
            {activeTab !== "summary" ? (
              <Button
                onClick={() => {
                  const tabs = ["customer", "items", "delivery", "summary"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1])
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-accent hover:bg-accent/90"
                onClick={handleCreateOrder}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}