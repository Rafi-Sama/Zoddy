"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle } from 'lucide-react'

export interface CustomerFormData {
  name: string
  phone: string
  email: string
  address: string
  status?: string
  favoriteCategory?: string
  notes?: string
}

interface AddCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (customer: CustomerFormData) => void
}

const initialCustomerState: CustomerFormData = {
  name: "",
  phone: "",
  email: "",
  address: "",
  status: "New",
  favoriteCategory: "",
  notes: ""
}

export function AddCustomerModal({ open, onOpenChange, onAdd }: AddCustomerModalProps) {
  const [customer, setCustomer] = useState<CustomerFormData>(initialCustomerState)

  const handleSubmit = () => {
    // Basic validation
    if (!customer.name || !customer.phone) {
      alert("Please fill in required fields (Name and Phone)")
      return
    }

    onAdd(customer)
    setCustomer(initialCustomerState)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setCustomer(initialCustomerState)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Add New Customer</DialogTitle>
          <DialogDescription className="text-xs">
            Add a new customer to your database
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs">
              Customer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
              placeholder="Fatima Rahman"
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={customer.phone}
                onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                placeholder="+880 1712-345678"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({...customer, email: e.target.value})}
                placeholder="fatima@email.com"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="text-xs">Address</Label>
            <Input
              id="address"
              value={customer.address}
              onChange={(e) => setCustomer({...customer, address: e.target.value})}
              placeholder="Dhanmondi, Dhaka"
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-xs">Status</Label>
              <Select
                value={customer.status}
                onValueChange={(value) => setCustomer({...customer, status: value})}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="favoriteCategory" className="text-xs">Favorite Category</Label>
              <Select
                value={customer.favoriteCategory}
                onValueChange={(value) => setCustomer({...customer, favoriteCategory: value})}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-xs">Notes</Label>
            <Textarea
              id="notes"
              value={customer.notes}
              onChange={(e) => setCustomer({...customer, notes: e.target.value})}
              placeholder="Additional notes about the customer..."
              className="min-h-[60px] text-xs resize-none"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-8 text-xs px-3"
          >
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 h-8 text-xs px-3"
            onClick={handleSubmit}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-2" />
            Add Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
