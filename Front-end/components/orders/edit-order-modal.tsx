"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  User,
  Package,
  Plus,
  Minus,
  Trash2,
  Save,
  X,
  Truck,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

interface OrderItem {
  id?: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: {
    name: string
    phone: string
    address: string
  }
  date: string
  items: OrderItem[]
  amount: number
  status: string
  paymentStatus: string
  delivery: string
}

interface EditOrderModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedOrder: Order) => void
}

export function EditOrderModal({ order, isOpen, onClose, onSave }: EditOrderModalProps) {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form when order changes
  useEffect(() => {
    if (order) {
      setEditedOrder(JSON.parse(JSON.stringify(order))) // Deep clone
      setHasChanges(false)
    }
  }, [order])

  if (!editedOrder) return null

  const updateCustomerField = (field: keyof Order["customer"], value: string) => {
    setEditedOrder(prev => {
      if (!prev) return null
      return {
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value
        }
      }
    })
    setHasChanges(true)
  }

  const updateOrderField = (field: keyof Order, value: string) => {
    setEditedOrder(prev => {
      if (!prev) return null
      return {
        ...prev,
        [field]: value
      }
    })
    setHasChanges(true)
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index)
      return
    }

    setEditedOrder(prev => {
      if (!prev) return null
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], quantity }
      const newAmount = calculateTotal(newItems)
      return {
        ...prev,
        items: newItems,
        amount: newAmount
      }
    })
    setHasChanges(true)
  }

  const updateItemPrice = (index: number, price: number) => {
    setEditedOrder(prev => {
      if (!prev) return null
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], price }
      const newAmount = calculateTotal(newItems)
      return {
        ...prev,
        items: newItems,
        amount: newAmount
      }
    })
    setHasChanges(true)
  }

  const updateItemName = (index: number, name: string) => {
    setEditedOrder(prev => {
      if (!prev) return null
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], name }
      return {
        ...prev,
        items: newItems
      }
    })
    setHasChanges(true)
  }

  const addItem = () => {
    setEditedOrder(prev => {
      if (!prev) return null
      const newItems = [...prev.items, { name: "New Item", quantity: 1, price: 0 }]
      const newAmount = calculateTotal(newItems)
      return {
        ...prev,
        items: newItems,
        amount: newAmount
      }
    })
    setHasChanges(true)
  }

  const removeItem = (index: number) => {
    setEditedOrder(prev => {
      if (!prev) return null
      const newItems = prev.items.filter((_, i) => i !== index)
      const newAmount = calculateTotal(newItems)
      return {
        ...prev,
        items: newItems,
        amount: newAmount
      }
    })
    setHasChanges(true)
  }

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleSave = () => {
    if (!editedOrder) return

    // Validation
    if (!editedOrder.customer.name || !editedOrder.customer.phone) {
      toast.error("Customer information required", {
        description: "Please provide customer name and phone number"
      })
      return
    }

    if (editedOrder.items.length === 0) {
      toast.error("No items in order", {
        description: "Order must have at least one item"
      })
      return
    }

    // Check for invalid items
    const invalidItem = editedOrder.items.find(item => !item.name || item.price < 0 || item.quantity <= 0)
    if (invalidItem) {
      toast.error("Invalid item data", {
        description: "Please check all items have valid names, prices, and quantities"
      })
      return
    }

    onSave(editedOrder)
    toast.success("Order updated", {
      description: `Order ${editedOrder.id} has been updated successfully`
    })
    onClose()
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Order {editedOrder.id}</span>
            {hasChanges && (
              <Badge variant="secondary" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Update order details below
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Customer Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center">
              <User className="h-4 w-4 mr-2" />
              Customer Information
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={editedOrder.customer.name}
                onChange={(e) => updateCustomerField("name", e.target.value)}
                placeholder="Customer name *"
                className="h-9"
              />
              <Input
                value={editedOrder.customer.phone}
                onChange={(e) => updateCustomerField("phone", e.target.value)}
                placeholder="Phone number *"
                className="h-9"
              />
            </div>
            <Input
              value={editedOrder.customer.address}
              onChange={(e) => updateCustomerField("address", e.target.value)}
              placeholder="Delivery address"
              className="h-9"
            />
          </div>

          <Separator />

          {/* Order Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Order Items
              </h3>
              <Button
                size="sm"
                onClick={addItem}
                variant="outline"
                className="h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>

            {editedOrder.items.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-muted/50">
                <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No items yet</p>
                <Button
                  size="sm"
                  onClick={addItem}
                  variant="outline"
                  className="mt-2 h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {editedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        value={item.name}
                        onChange={(e) => updateItemName(index, e.target.value)}
                        placeholder="Product name"
                        className="h-8 text-sm"
                      />
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItemPrice(index, parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        className="h-8 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 0)}
                          className="h-8 w-14 text-center text-sm"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium min-w-[80px] text-right">
                        ৳{(item.price * item.quantity).toFixed(0)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2 px-2">
                  <span className="font-semibold text-sm">Total:</span>
                  <span className="text-lg font-bold">৳{editedOrder.amount.toFixed(0)}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Order Status
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Order Status</Label>
                <Select
                  value={editedOrder.status}
                  onValueChange={(value) => updateOrderField("status", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Payment</Label>
                <Select
                  value={editedOrder.paymentStatus}
                  onValueChange={(value) => updateOrderField("paymentStatus", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Delivery</Label>
                <Select
                  value={editedOrder.delivery}
                  onValueChange={(value) => updateOrderField("delivery", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Pickup">Store Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Order Date</Label>
              <Input
                type="text"
                value={editedOrder.date}
                onChange={(e) => updateOrderField("date", e.target.value)}
                placeholder="DD-MM-YYYY"
                className="h-9 md:w-auto w-full"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}