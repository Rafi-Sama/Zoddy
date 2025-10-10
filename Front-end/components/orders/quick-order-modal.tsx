"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Plus,
  Upload,
  X,
  Check,
  Sparkles,
  Package,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  source?: string
}

interface QuickOrderModalProps {
  onCreateOrder: (order: Order) => void
  trigger?: React.ReactNode
}

export function QuickOrderModal({ onCreateOrder, trigger }: QuickOrderModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [orderContent, setOrderContent] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  })
  interface ExtractedOrder {
    items: Array<{
      id: string
      name: string
      quantity: number
      price: number
    }>
    total: number
  }

  const [extractedOrder, setExtractedOrder] = useState<ExtractedOrder | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle paste event for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isOpen) return

      // Check if the active element is the textarea

      const items = e.clipboardData?.items
      if (!items) return

      // Check for images in clipboard
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault() // Prevent default only for images
          const blob = item.getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target?.result) {
                setUploadedImages(prev => [...prev, event.target!.result as string])
                toast.success("Screenshot added!", {
                  description: "Image pasted successfully"
                })
              }
            }
            reader.readAsDataURL(blob)
          }
        }
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [isOpen])

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages(prev => [...prev, event.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      }
    })

    if (files.length > 0) {
      toast.success(`${files.length} image(s) uploaded`)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const parseOrderContent = () => {
    // Parse both text content and extract info from images
    const lines = orderContent.split('\n').filter(line => line.trim())
    const orderItems = []
    let totalAmount = 0

    // Try to extract items and prices from text
    lines.forEach(line => {
      // Match patterns like "2x Cotton Shirt - 500" or "Cotton Shirt x2 @500"
      const patterns = [
        /(\d+)[x\s]+(.+?)[\s-]+(?:৳|tk|bdt|taka)?[\s]*(\d+)/i,
        /(.+?)\s*x\s*(\d+)\s*@?\s*(?:৳|tk|bdt|taka)?[\s]*(\d+)/i,
        /(.+?)[\s-]+(?:৳|tk|bdt|taka)?[\s]*(\d+)/i
      ]

      for (const pattern of patterns) {
        const match = line.match(pattern)
        if (match) {
          let name, quantity, price

          if (patterns.indexOf(pattern) === 0) {
            quantity = parseInt(match[1])
            name = match[2].trim()
            price = parseInt(match[3])
          } else if (patterns.indexOf(pattern) === 1) {
            name = match[1].trim()
            quantity = parseInt(match[2])
            price = parseInt(match[3])
          } else {
            name = match[1].trim()
            quantity = 1
            price = parseInt(match[2])
          }

          if (name && !isNaN(quantity) && !isNaN(price)) {
            orderItems.push({
              id: Math.random().toString(36).substr(2, 9),
              name,
              quantity,
              price
            })
            totalAmount += quantity * price
          }
          break
        }
      }
    })

    // If we have images, add a note about them
    if (uploadedImages.length > 0 && orderItems.length === 0) {
      // Simulate extracting from images
      orderItems.push({
        id: Math.random().toString(36).substr(2, 9),
        name: "Items from screenshot",
        quantity: 1,
        price: 1000
      })
      totalAmount = 1000
      toast.info("Please verify the extracted items from images")
    }

    setExtractedOrder({
      items: orderItems,
      total: totalAmount
    })

    if (orderItems.length === 0) {
      toast.warning("No items found", {
        description: "Try format: '2x Product - 500' or paste a screenshot"
      })
    } else {
      toast.success(`Found ${orderItems.length} items`, {
        description: `Total: ৳${totalAmount}`
      })
    }
  }

  const handleProcessOrder = () => {
    setIsProcessing(true)

    setTimeout(() => {
      parseOrderContent()
      setIsProcessing(false)
    }, 1000)
  }

  const handleCreateOrder = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Customer information required", {
        description: "Please provide name and phone"
      })
      return
    }

    const orderData = extractedOrder || { items: [], total: 0 }

    if (orderData.items.length === 0) {
      toast.error("No items in order", {
        description: "Please add order details"
      })
      return
    }

    const today = new Date()
    const newOrder = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      customer: customerInfo,
      date: `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`,
      items: orderData.items,
      amount: orderData.total,
      status: "pending",
      paymentStatus: "pending",
      delivery: "standard",
      source: uploadedImages.length > 0 ? "screenshot" : "text"
    }

    onCreateOrder(newOrder)
    toast.success("Order created!", {
      description: `Order ${newOrder.id} created successfully`
    })

    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setOrderContent("")
    setUploadedImages([])
    setCustomerInfo({ name: "", phone: "", address: "" })
    setExtractedOrder(null)
  }

  const clearAll = () => {
    setOrderContent("")
    setUploadedImages([])
    setExtractedOrder(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Quick Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Create Quick Order</DialogTitle>
          <DialogDescription>
            Paste text, screenshots, or type order details - all in one place
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Left Column - Input Area */}
          <div className="space-y-4">
            {/* Unified Input Area */}
            <Card
              className={cn(
                "relative transition-colors",
                isDragging && "border-accent bg-accent/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Order Details</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    {(orderContent || uploadedImages.length > 0) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={clearAll}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Text Input Area */}
                <div>
                  <Textarea
                    placeholder="Type or paste order details here..."
                    value={orderContent}
                    onChange={(e) => setOrderContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm resize-none"
                  />
                </div>

                {/* Image Preview Area */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Attached Screenshots ({uploadedImages.length})
                    </Label>
                    <ScrollArea className="h-24">
                      <div className="flex gap-2">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative group shrink-0">
                            <Image
                              src={img}
                              alt={`Screenshot ${index + 1}`}
                              width={80}
                              height={80}
                              className="h-20 w-20 object-cover rounded-md border"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Process Button */}
                <Button
                  onClick={handleProcessOrder}
                  className="w-full"
                  disabled={(!orderContent.trim() && uploadedImages.length === 0) || isProcessing}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Extract Order Details"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-4">
            {/* Order Preview */}
            {extractedOrder && extractedOrder.items.length > 0 ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Order Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {extractedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ৳{item.price}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          ৳{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold pt-2">
                      <span>Total:</span>
                      <span className="text-lg">৳{extractedOrder.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-10 w-10 text-muted-foreground mb-3" />
                  <div>
                    <p className="text-sm text-muted-foreground text-center mb-2">
                      Order preview will appear here
                    </p>
                    <p className="text-xs text-muted-foreground text-left mt-1">
                      • Paste screenshots or text of order details
                    </p>
                    <p className="text-xs text-muted-foreground text-left mt-1">
                      • Click &quot;Extract&quot; to parse items
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              resetForm()
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleCreateOrder}
            disabled={!extractedOrder || extractedOrder.items.length === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}