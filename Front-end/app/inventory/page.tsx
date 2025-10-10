"use client"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  RotateCcw,
  History,
  Settings,
  Search,
  TrendingDown,
  Grid3X3,
  List,
  Download,
  Edit,
  Copy,
  Archive,
  CheckCircle
} from "lucide-react"
const mockInventory = [
  {
    id: "1",
    name: "Cotton Kurti - Blue",
    description: "Premium cotton kurti with traditional embroidery",
    sku: "CK001",
    category: "Women's Fashion",
    currentStock: 25,
    reorderLevel: 10,
    costPrice: 800,
    sellingPrice: 1200,
    totalValue: 20000,
    image: null,
    bestseller: true,
    movements: {
      thisWeek: { in: 50, out: 25 },
      lastWeek: { in: 30, out: 35 }
    }
  },
  {
    id: "2",
    name: "Silk Scarf - Red",
    description: "Elegant silk scarf with floral patterns",
    sku: "SS002",
    category: "Accessories",
    currentStock: 8,
    reorderLevel: 15,
    costPrice: 300,
    sellingPrice: 500,
    totalValue: 2400,
    image: null,
    bestseller: false,
    movements: {
      thisWeek: { in: 0, out: 12 },
      lastWeek: { in: 20, out: 8 }
    }
  },
  {
    id: "3",
    name: "Designer Saree",
    description: "Handwoven designer saree with golden work",
    sku: "DS003",
    category: "Women's Fashion",
    currentStock: 12,
    reorderLevel: 5,
    costPrice: 2200,
    sellingPrice: 3500,
    totalValue: 26400,
    image: null,
    bestseller: true,
    movements: {
      thisWeek: { in: 5, out: 3 },
      lastWeek: { in: 0, out: 7 }
    }
  },
  {
    id: "4",
    name: "Casual T-shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    sku: "CT004",
    category: "Men's Fashion",
    currentStock: 0,
    reorderLevel: 20,
    costPrice: 250,
    sellingPrice: 450,
    totalValue: 0,
    image: null,
    bestseller: false,
    movements: {
      thisWeek: { in: 0, out: 0 },
      lastWeek: { in: 0, out: 15 }
    }
  },
  {
    id: "5",
    name: "Embroidered Shirt",
    description: "Traditional shirt with intricate embroidery",
    sku: "ES005",
    category: "Men's Fashion",
    currentStock: 35,
    reorderLevel: 10,
    costPrice: 1200,
    sellingPrice: 1800,
    totalValue: 42000,
    image: null,
    bestseller: false,
    movements: {
      thisWeek: { in: 25, out: 10 },
      lastWeek: { in: 20, out: 15 }
    }
  }
]

interface InventoryItem {
  id: string
  name: string
  description: string
  sku: string
  category: string
  currentStock: number
  reorderLevel: number
  costPrice: number
  sellingPrice: number
  totalValue: number
  image: string | null
  bestseller: boolean
  movements: {
    thisWeek: { in: number; out: number }
    lastWeek: { in: number; out: number }
  }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState(mockInventory)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove" | "set">("add")
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventory.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0)
  const outOfStockItems = inventory.filter(item => item.currentStock === 0)
  const overstockedItems = inventory.filter(item => item.currentStock > item.reorderLevel * 3)

  // Filter products based on search and filters
  const filteredProducts = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStock = stockFilter === "all" ||
                        (stockFilter === "instock" && item.currentStock > item.reorderLevel) ||
                        (stockFilter === "lowstock" && item.currentStock <= item.reorderLevel && item.currentStock > 0) ||
                        (stockFilter === "outofstock" && item.currentStock === 0)
    return matchesSearch && matchesCategory && matchesStock
  })
  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (item.currentStock <= item.reorderLevel) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    if (item.currentStock > item.reorderLevel * 3) return { status: "Overstocked", color: "bg-blue-100 text-blue-800" }
    return { status: "In Stock", color: "bg-green-100 text-green-800" }
  }
  const handleStockAdjustment = (product: InventoryItem) => {
    const quantity = parseInt(adjustmentQuantity)
    if (!quantity || !adjustmentReason) {
      alert("Please enter quantity and reason for adjustment")
      return
    }

    setIsProcessing(true)

    // Simulate API call delay
    setTimeout(() => {
      // Update the inventory state
      setInventory(prevInventory => {
        return prevInventory.map(item => {
          if (item.id === product.id) {
            let newStock = item.currentStock

            if (adjustmentType === "add") {
              newStock = item.currentStock + quantity
            } else if (adjustmentType === "remove") {
              newStock = Math.max(0, item.currentStock - quantity)
            } else if (adjustmentType === "set") {
              newStock = quantity
            }

            // Update total value based on new stock
            const newTotalValue = newStock * item.costPrice

            return {
              ...item,
              currentStock: newStock,
              totalValue: newTotalValue,
              movements: {
                thisWeek: {
                  in: adjustmentType === "add" ? item.movements.thisWeek.in + quantity : item.movements.thisWeek.in,
                  out: adjustmentType === "remove" ? item.movements.thisWeek.out + quantity : item.movements.thisWeek.out
                },
                lastWeek: item.movements.lastWeek
              }
            }
          }
          return item
        })
      })

      // Show success message
      setSuccessMessage(`Stock adjusted successfully for ${product.name}`)
      setTimeout(() => setSuccessMessage(""), 3000)

      // Reset form
      setAdjustmentQuantity("")
      setAdjustmentReason("")
      setSelectedProduct(null)
      setIsProcessing(false)
    }, 1000)
  }
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Inventory" }
      ]}
    >
      {/* Success Message */}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2">

        {/* Total Inventory Value - Row 1, Col 1 (1x1) */}
        <Card className="md:col-span-1 md:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-2.5 w-2.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">৳{totalInventoryValue.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground">
              Current stock value
            </p>
          </CardContent>
        </Card>
        {/* Overstocked Items - Row 2, Col 1 (1x1) */}
        <Card className="md:col-span-1 md:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Overstocked Items</CardTitle>
            <TrendingUp className="h-2.5 w-2.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">{overstockedItems.length}</div>
            <p className="text-[10px] text-muted-foreground">
              Excess inventory
            </p>
          </CardContent>
        </Card>


        {/* Low Stock - Row 1-2, Col 4 (2x1) */}
        <Card className="md:col-span-1 md:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-yellow-600 text-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              Low Stock ({lowStockItems.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Items need restocking soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 max-h-[280px] overflow-y-auto">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-1.5 border rounded">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs truncate">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {item.currentStock} left (reorder at {item.reorderLevel})
                    </div>
                  </div>
                  <Button className="h-6 text-[10px] px-2 ml-2 flex-shrink-0" variant="outline">
                    Reorder
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                All items have healthy stock levels
              </div>
            )}
          </CardContent>
        </Card>


        {/* Out of Stock - Row 2, Col 2-3 (1x2) */}
        <Card className="md:col-span-1 md:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-red-600 text-sm">
              <Package className="h-3.5 w-3.5" />
              Out of Stock ({outOfStockItems.length})
            </CardTitle>
            <CardDescription className="text-xs">
              These items are completely out of stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 max-h-[280px] overflow-y-auto">
              {outOfStockItems.length > 0 ? (
                outOfStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-1.5 border rounded">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">Urgent</div>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 h-5 text-[10px] px-2 ml-1">
                      Restock
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-xs text-muted-foreground text-center py-2">
                  No items are currently out of stock
                </div>
              )}
          </CardContent>
        </Card>
        {/* Search, Filter & Actions - Row 1, Col 2-3 (1x2) */}
        <Card className="md:col-span-2 md:row-span-1">
          <CardContent className="pt-3">
            <div className="space-y-2">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 h-7 text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[120px] h-7 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Women's Fashion">Women&apos;s Fashion</SelectItem>
                    <SelectItem value="Men's Fashion">Men&apos;s Fashion</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full sm:w-[120px] h-7 text-xs">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="lowstock">Low Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none h-7 px-2"
                    size="sm"
                  >
                    <List className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none h-7 px-2"
                    size="sm"
                  >
                    <Grid3X3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1.5">
                <Button variant="outline" className="h-7 text-xs px-2">
                  <History className="h-3 w-3 mr-1" />
                  History
                </Button>
                <Button variant="outline" className="h-7 text-xs px-2">
                  <Download className="h-3 w-3 mr-1" />
                  Import
                </Button>
                <Button className="bg-accent hover:bg-accent/90 h-7 text-xs px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Products Display - Grid or List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((item) => {
            const status = getStockStatus(item)
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow relative">
                {item.currentStock === 0 && (
                  <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
                    <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0">Out of Stock</Badge>
                  </div>
                )}
                {item.bestseller && (
                  <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground z-20 text-[9px] px-1.5 py-0">
                    Bestseller
                  </Badge>
                )}
                <CardHeader className="pb-2">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm line-clamp-1">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">SKU</span>
                    <span className="text-xs font-mono">{item.sku}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="font-bold text-xs">৳{item.sellingPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Stock</span>
                    <Badge className={`${status.color} text-[9px] px-1.5 py-0`}>
                      {item.currentStock} units
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">This Week</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-[10px]">+{item.movements.thisWeek.in}</span>
                      <span className="text-red-600 text-[10px]">-{item.movements.thisWeek.out}</span>
                    </div>
                  </div>
                  {item.currentStock <= item.reorderLevel && item.currentStock > 0 && (
                    <div className="p-1 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center gap-1 text-yellow-800 text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        Low stock warning
                      </div>
                    </div>
                  )}
                  <div className="flex gap-1 pt-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 h-6 text-[10px] px-2"
                          onClick={() => setSelectedProduct(item)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Adjust
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-sm">Adjust Stock - {selectedProduct?.name}</DialogTitle>
                          <DialogDescription className="text-xs">
                            Update the stock level for this product
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor="adjustmentType" className="text-xs">Adjustment Type</Label>
                            <Select value={adjustmentType} onValueChange={(value: "add" | "remove" | "set") => setAdjustmentType(value)} disabled={isProcessing}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="add">Add Stock</SelectItem>
                                <SelectItem value="remove">Remove Stock</SelectItem>
                                <SelectItem value="set">Set Stock Level</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="quantity" className="text-xs">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              placeholder="Enter quantity"
                              value={adjustmentQuantity}
                              onChange={(e) => setAdjustmentQuantity(e.target.value)}
                              className="h-8 text-xs"
                              disabled={isProcessing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="reason" className="text-xs">Reason</Label>
                            <Select value={adjustmentReason} onValueChange={setAdjustmentReason} disabled={isProcessing}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="restock">New Stock Arrival</SelectItem>
                                <SelectItem value="damage">Damaged Items</SelectItem>
                                <SelectItem value="theft">Theft/Loss</SelectItem>
                                <SelectItem value="return">Customer Return</SelectItem>
                                <SelectItem value="correction">Stock Correction</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => selectedProduct && handleStockAdjustment(selectedProduct)}
                              className="flex-1 bg-accent hover:bg-accent/90 h-8 text-xs px-3"
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <span className="animate-spin h-3 w-3 mr-2 border-2 border-white border-t-transparent rounded-full inline-block" />
                                  Processing...
                                </>
                              ) : (
                                "Update Stock"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedProduct(null)}
                              className="flex-1 h-8 text-xs px-3"
                              disabled={isProcessing}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="h-6 px-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" className="h-6 px-2">
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Inventory Management</CardTitle>
                <CardDescription className="text-xs">Complete product inventory with stock movements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1.5 text-xs">Product</th>
                    <th className="text-left py-2 px-1.5 text-xs">SKU</th>
                    <th className="text-left py-2 px-1.5 text-xs">Price</th>
                    <th className="text-left py-2 px-1.5 text-xs">Stock</th>
                    <th className="text-left py-2 px-1.5 text-xs">Reorder</th>
                    <th className="text-left py-2 px-1.5 text-xs">This Week</th>
                    <th className="text-left py-2 px-1.5 text-xs">Value</th>
                    <th className="text-left py-2 px-1.5 text-xs">Status</th>
                    <th className="text-left py-2 px-1.5 text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item) => {
                    const status = getStockStatus(item)
                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium text-xs">{item.name}</div>
                              <div className="text-[10px] text-muted-foreground line-clamp-1">{item.description}</div>
                            </div>
                            {item.bestseller && (
                              <Badge className="bg-accent text-accent-foreground text-[9px] px-1.5 py-0">Best</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-1.5 font-mono text-xs">{item.sku}</td>
                        <td className="py-2 px-1.5">
                          <div className="font-medium text-xs">৳{item.sellingPrice}</div>
                          <div className="text-[10px] text-muted-foreground">৳{item.costPrice}</div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="font-bold text-xs">{item.currentStock}</div>
                          {item.currentStock <= item.reorderLevel && item.currentStock > 0 && (
                            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                          )}
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="text-xs">{item.reorderLevel}</div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-0.5 text-green-600 text-[10px]">
                              <TrendingUp className="h-2.5 w-2.5" />
                              +{item.movements.thisWeek.in}
                            </div>
                            <div className="flex items-center gap-0.5 text-red-600 text-[10px]">
                              <TrendingDown className="h-2.5 w-2.5" />
                              -{item.movements.thisWeek.out}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="font-medium text-xs">৳{item.totalValue.toLocaleString()}</div>
                        </td>
                        <td className="py-2 px-1.5">
                          <Badge className={`${status.color} text-[9px] px-1.5 py-0`}>
                            {status.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-6 px-1.5"
                                  onClick={() => setSelectedProduct(item)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-sm">Adjust Stock - {selectedProduct?.name}</DialogTitle>
                                  <DialogDescription className="text-xs">
                                    Update the stock level for this product
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <div>
                                    <Label htmlFor="adjustmentType" className="text-xs">Adjustment Type</Label>
                                    <Select value={adjustmentType} onValueChange={(value: "add" | "remove" | "set") => setAdjustmentType(value)}>
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="add">Add Stock</SelectItem>
                                        <SelectItem value="remove">Remove Stock</SelectItem>
                                        <SelectItem value="set">Set Stock Level</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="quantity" className="text-xs">Quantity</Label>
                                    <Input
                                      id="quantity"
                                      type="number"
                                      placeholder="Enter quantity"
                                      value={adjustmentQuantity}
                                      onChange={(e) => setAdjustmentQuantity(e.target.value)}
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="reason" className="text-xs">Reason</Label>
                                    <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="restock">New Stock Arrival</SelectItem>
                                        <SelectItem value="damage">Damaged Items</SelectItem>
                                        <SelectItem value="theft">Theft/Loss</SelectItem>
                                        <SelectItem value="return">Customer Return</SelectItem>
                                        <SelectItem value="correction">Stock Correction</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      onClick={() => selectedProduct && handleStockAdjustment(selectedProduct)}
                                      className="flex-1 bg-accent hover:bg-accent/90 h-8 text-xs px-3"
                                    >
                                      Update Stock
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedProduct(null)}
                                      className="flex-1 h-8 text-xs px-3"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
    </MainLayout>
  )
}