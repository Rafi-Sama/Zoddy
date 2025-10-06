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
  TrendingDown
} from "lucide-react"
const mockInventory = [
  {
    id: "1",
    name: "Cotton Kurti - Blue",
    sku: "CK001",
    category: "Women's Fashion",
    currentStock: 25,
    reorderLevel: 10,
    costPrice: 800,
    sellingPrice: 1200,
    totalValue: 20000,
    movements: {
      thisWeek: { in: 50, out: 25 },
      lastWeek: { in: 30, out: 35 }
    }
  },
  {
    id: "2",
    name: "Silk Scarf - Red",
    sku: "SS002",
    category: "Accessories",
    currentStock: 8,
    reorderLevel: 15,
    costPrice: 300,
    sellingPrice: 500,
    totalValue: 2400,
    movements: {
      thisWeek: { in: 0, out: 12 },
      lastWeek: { in: 20, out: 8 }
    }
  },
  {
    id: "3",
    name: "Designer Saree",
    sku: "DS003",
    category: "Women's Fashion",
    currentStock: 12,
    reorderLevel: 5,
    costPrice: 2200,
    sellingPrice: 3500,
    totalValue: 26400,
    movements: {
      thisWeek: { in: 5, out: 3 },
      lastWeek: { in: 0, out: 7 }
    }
  },
  {
    id: "4",
    name: "Casual T-shirt",
    sku: "CT004",
    category: "Men's Fashion",
    currentStock: 0,
    reorderLevel: 20,
    costPrice: 250,
    sellingPrice: 450,
    totalValue: 0,
    movements: {
      thisWeek: { in: 0, out: 0 },
      lastWeek: { in: 0, out: 15 }
    }
  },
  {
    id: "5",
    name: "Embroidered Shirt",
    sku: "ES005",
    category: "Men's Fashion",
    currentStock: 35,
    reorderLevel: 10,
    costPrice: 1200,
    sellingPrice: 1800,
    totalValue: 42000,
    movements: {
      thisWeek: { in: 25, out: 10 },
      lastWeek: { in: 20, out: 15 }
    }
  }
]

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  reorderLevel: number
  costPrice: number
  sellingPrice: number
  totalValue: number
  movements: {
    thisWeek: { in: number; out: number }
    lastWeek: { in: number; out: number }
  }
}

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove" | "set">("add")
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const totalInventoryValue = mockInventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = mockInventory.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0)
  const outOfStockItems = mockInventory.filter(item => item.currentStock === 0)
  const overstockedItems = mockInventory.filter(item => item.currentStock > item.reorderLevel * 3)
  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (item.currentStock <= item.reorderLevel) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    if (item.currentStock > item.reorderLevel * 3) return { status: "Overstocked", color: "bg-blue-100 text-blue-800" }
    return { status: "In Stock", color: "bg-green-100 text-green-800" }
  }
  const handleStockAdjustment = (product: InventoryItem) => {
    const quantity = parseInt(adjustmentQuantity)
    if (!quantity || !adjustmentReason) return
    // This would normally make an API call to update the stock
    console.log(`Adjusting stock for ${product.name}:`, {
      type: adjustmentType,
      quantity,
      reason: adjustmentReason
    })
    // Reset form
    setAdjustmentQuantity("")
    setAdjustmentReason("")
    setSelectedProduct(null)
  }
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Inventory" }
      ]}
    >
      {/* Overview Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-2.5 w-2.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-600">{lowStockItems.length}</div>
            <p className="text-[10px] text-muted-foreground">
              Need restocking soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Out of Stock</CardTitle>
            <Package className="h-2.5 w-2.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-red-600">{outOfStockItems.length}</div>
            <p className="text-[10px] text-muted-foreground">
              Products unavailable
            </p>
          </CardContent>
        </Card>
        <Card>
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
      </div>
      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-3">
          <div className="flex flex-wrap gap-1.5">
            <Button className="bg-accent hover:bg-accent/90 h-8 text-xs px-3">
              <Plus className="h-3 w-3 mr-2" />
              Add Stock
            </Button>
            <Button variant="outline" className="h-8 text-xs px-3">
              <RotateCcw className="h-3 w-3 mr-2" />
              Stock Take
            </Button>
            <Button variant="outline" className="h-8 text-xs px-3">
              <History className="h-3 w-3 mr-2" />
              Movement History
            </Button>
            <Button variant="outline" className="h-8 text-xs px-3">
              <Settings className="h-3 w-3 mr-2" />
              Reorder Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Alerts Section */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-yellow-600 text-sm">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription className="text-xs">
                  These items need restocking soon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-1.5 border rounded-lg">
                    <div>
                      <div className="font-medium text-xs">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.currentStock} left (reorder at {item.reorderLevel})
                      </div>
                    </div>
                    <Button className="h-6 text-[10px] px-2" variant="outline">
                      Reorder
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {outOfStockItems.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-red-600 text-sm">
                  <Package className="h-3.5 w-3.5" />
                  Out of Stock
                </CardTitle>
                <CardDescription className="text-xs">
                  These items are completely out of stock
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {outOfStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-1.5 border rounded-lg">
                    <div>
                      <div className="font-medium text-xs">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Urgent restock needed
                      </div>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 h-6 text-[10px] px-2">
                      Restock Now
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {/* Inventory Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Stock Overview</CardTitle>
              <CardDescription className="text-xs">Current inventory levels and movements</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64 h-8 text-xs"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
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
                  <th className="text-left py-2 px-1.5 text-xs">Current Stock</th>
                  <th className="text-left py-2 px-1.5 text-xs">Reorder Level</th>
                  <th className="text-left py-2 px-1.5 text-xs">This Week</th>
                  <th className="text-left py-2 px-1.5 text-xs">Value</th>
                  <th className="text-left py-2 px-1.5 text-xs">Status</th>
                  <th className="text-left py-2 px-1.5 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockInventory.map((item) => {
                  const status = getStockStatus(item)
                  return (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-1.5">
                        <div>
                          <div className="font-medium text-xs">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground">{item.category}</div>
                        </div>
                      </td>
                      <td className="py-2 px-1.5 font-mono text-xs">{item.sku}</td>
                      <td className="py-2 px-1.5">
                        <div className="font-bold text-xs">{item.currentStock}</div>
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
                        <div className="text-[10px] text-muted-foreground">
                          @৳{item.costPrice} each
                        </div>
                      </td>
                      <td className="py-2 px-1.5">
                        <Badge className={`${status.color} text-[9px] px-1.5 py-0`}>
                          {status.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-1.5">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-6 text-[10px] px-2"
                              onClick={() => setSelectedProduct(item)}
                            >
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
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Stock Movement Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Stock Movement Summary</CardTitle>
          <CardDescription className="text-xs">Weekly stock in/out comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <h4 className="font-semibold mb-2 text-green-600 text-xs">Stock In (This Week)</h4>
              <div className="space-y-1.5">
                {mockInventory
                  .filter(item => item.movements.thisWeek.in > 0)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-1.5 border rounded">
                      <span className="text-xs">{item.name}</span>
                      <Badge variant="outline" className="text-green-600 text-[9px] px-1.5 py-0">+{item.movements.thisWeek.in}</Badge>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-600 text-xs">Stock Out (This Week)</h4>
              <div className="space-y-1.5">
                {mockInventory
                  .filter(item => item.movements.thisWeek.out > 0)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-1.5 border rounded">
                      <span className="text-xs">{item.name}</span>
                      <Badge variant="outline" className="text-red-600 text-[9px] px-1.5 py-0">-{item.movements.thisWeek.out}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}