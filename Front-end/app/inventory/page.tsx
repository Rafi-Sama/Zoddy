"use client"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  History,
  Search,
  TrendingDown,
  Grid3X3,
  List,
  Download,
  Edit,
  Copy,
  Archive,
  Trash2,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"
import { AddProductModal, type ProductFormData } from "@/components/inventory/add-product-modal"
import { EditProductModal, type InventoryItem } from "@/components/inventory/edit-product-modal"
import { ImportProductsModal } from "@/components/inventory/import-products-modal"
import { StockHistoryModal } from "@/components/inventory/stock-history-modal"
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

interface StockHistoryItem {
  id: number
  date: string
  time: string
  product: string
  sku?: string
  type: 'edited' | 'added' | 'deleted'
  user: string
  changes?: {
    field: string
    oldValue: string | number
    newValue: string | number
  }[]
  initialData?: {
    sku: string
    category: string
    initialStock: number
    price: number
  }
  finalData?: {
    sku: string
    category: string
    finalStock: number
    cost?: number
    price?: number
    reason: string
  }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState(mockInventory)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(null)
  const [deleteReason, setDeleteReason] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove" | "set">("add")
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null)
  const [dismissedLowStock, setDismissedLowStock] = useState<Set<string>>(new Set())
  const [dismissedOutOfStock, setDismissedOutOfStock] = useState<Set<string>>(new Set())
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([])
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [quickAddProductId, setQuickAddProductId] = useState<string | null>(null)
  const [quickAddQuantity, setQuickAddQuantity] = useState("")

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventory.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0 && !dismissedLowStock.has(item.id))
  const outOfStockItems = inventory.filter(item => item.currentStock === 0 && !dismissedOutOfStock.has(item.id))
  const overstockedItems = inventory.filter(item => item.currentStock > item.reorderLevel * 3)

  const handleDismissLowStock = (itemId: string) => {
    setDismissedLowStock(prev => new Set([...prev, itemId]))
    toast.success("Item marked as handled")
  }

  const handleDismissOutOfStock = (itemId: string) => {
    setDismissedOutOfStock(prev => new Set([...prev, itemId]))
    toast.success("Item marked as handled")
  }

  // Filter products based on search and filters
  const filteredProducts = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStock = stockFilter === "all" ||
                        (stockFilter === "instock" && item.currentStock > item.reorderLevel) ||
                        (stockFilter === "lowstock" && item.currentStock <= item.reorderLevel && item.currentStock > 0) ||
                        (stockFilter === "outofstock" && item.currentStock === 0) ||
                        (stockFilter === "overstocked" && item.currentStock > item.reorderLevel * 3)
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

  const handleAddProduct = (productData: ProductFormData) => {
    const product: InventoryItem = {
      id: (inventory.length + 1).toString(),
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      category: productData.category,
      currentStock: productData.currentStock,
      reorderLevel: productData.reorderLevel,
      costPrice: productData.costPrice,
      sellingPrice: productData.sellingPrice,
      totalValue: productData.currentStock * productData.costPrice,
      image: null,
      bestseller: false,
      movements: {
        thisWeek: { in: productData.currentStock, out: 0 },
        lastWeek: { in: 0, out: 0 }
      }
    }

    setInventory([...inventory, product])

    // Add to history
    const now = new Date()
    const historyEntry: StockHistoryItem = {
      id: stockHistory.length + 1,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      product: productData.name,
      type: 'added',
      user: 'Admin', // Replace with actual user
      initialData: {
        sku: productData.sku,
        category: productData.category,
        initialStock: productData.currentStock,
        price: productData.sellingPrice
      }
    }
    setStockHistory([historyEntry, ...stockHistory])

    toast.success("Product added successfully", {
      description: `${productData.name} has been added to inventory`
    })
    setIsAddModalOpen(false)
  }

  const handleEditProduct = (product: InventoryItem) => {
    const oldProduct = inventory.find(item => item.id === product.id)

    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === product.id
          ? {
              ...product,
              totalValue: product.currentStock * product.costPrice
            }
          : item
      )
    )

    // Track changes
    if (oldProduct) {
      const changes: { field: string; oldValue: string | number; newValue: string | number }[] = []

      if (oldProduct.name !== product.name) {
        changes.push({ field: 'name', oldValue: oldProduct.name, newValue: product.name })
      }
      if (oldProduct.sku !== product.sku) {
        changes.push({ field: 'SKU', oldValue: oldProduct.sku, newValue: product.sku })
      }
      if (oldProduct.category !== product.category) {
        changes.push({ field: 'category', oldValue: oldProduct.category, newValue: product.category })
      }
      if (oldProduct.currentStock !== product.currentStock) {
        changes.push({ field: 'stock', oldValue: oldProduct.currentStock, newValue: product.currentStock })
      }
      if (oldProduct.sellingPrice !== product.sellingPrice) {
        changes.push({ field: 'price', oldValue: `৳${oldProduct.sellingPrice}`, newValue: `৳${product.sellingPrice}` })
      }
      if (oldProduct.costPrice !== product.costPrice) {
        changes.push({ field: 'cost', oldValue: `৳${oldProduct.costPrice}`, newValue: `৳${product.costPrice}` })
      }
      if (oldProduct.reorderLevel !== product.reorderLevel) {
        changes.push({ field: 'reorder level', oldValue: oldProduct.reorderLevel, newValue: product.reorderLevel })
      }

      if (changes.length > 0) {
        const now = new Date()
        const historyEntry: StockHistoryItem = {
          id: stockHistory.length + 1,
          date: now.toLocaleDateString('en-GB'),
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          product: product.name,
          sku: product.sku,
          type: 'edited',
          user: 'Admin', // Replace with actual user
          changes
        }
        setStockHistory([historyEntry, ...stockHistory])
      }
    }

    toast.success("Product updated successfully", {
      description: `${product.name} has been updated`
    })

    setIsEditModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = () => {
    if (!productToDelete || !deleteReason.trim()) {
      toast.error("Please provide a reason for deletion")
      return
    }

    // Add to history before deleting
    const now = new Date()
    const historyEntry: StockHistoryItem = {
      id: stockHistory.length + 1,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      product: productToDelete.name,
      type: 'deleted',
      user: 'Admin', // Replace with actual user
      finalData: {
        sku: productToDelete.sku,
        category: productToDelete.category,
        finalStock: productToDelete.currentStock,
        cost: productToDelete.costPrice,
        price: productToDelete.sellingPrice,
        reason: deleteReason
      }
    }
    setStockHistory([historyEntry, ...stockHistory])

    // Remove from inventory
    setInventory(inventory.filter(item => item.id !== productToDelete.id))

    toast.success("Product deleted", {
      description: `${productToDelete.name} has been removed from inventory`
    })

    setIsDeleteDialogOpen(false)
    setProductToDelete(null)
    setDeleteReason("")
  }

  const handleImportProducts = async (file: File) => {
    // Mock imported products
    const importedProducts: InventoryItem[] = [
      {
        id: (inventory.length + 1).toString(),
        name: "Imported Product 1",
        description: "Imported from " + file.name,
        sku: "IMP001",
        category: "Others",
        currentStock: 20,
        reorderLevel: 5,
        costPrice: 500,
        sellingPrice: 800,
        totalValue: 10000,
        image: null,
        bestseller: false,
        movements: {
          thisWeek: { in: 20, out: 0 },
          lastWeek: { in: 0, out: 0 }
        }
      }
    ]

    setInventory([...inventory, ...importedProducts])
    toast.success("Products imported successfully", {
      description: `${importedProducts.length} products imported from ${file.name}`
    })
  }

  const handleAddCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories([...customCategories, category])
      toast.success("Category added", {
        description: `${category} has been added to the category list`
      })
    }
  }

  // Get unique categories from inventory
  const allCategories = [...new Set([...inventory.map(item => item.category), ...customCategories])]

  const handleQuickAddStock = (productId: string, productName: string) => {
    if (!quickAddQuantity) return

    const quantity = parseInt(quickAddQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    const product = inventory.find(item => item.id === productId)
    if (!product) return

    const oldStock = product.currentStock
    const newStock = oldStock + quantity

    setInventory(prevInventory =>
      prevInventory.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.costPrice,
            movements: {
              thisWeek: {
                in: item.movements.thisWeek.in + quantity,
                out: item.movements.thisWeek.out
              },
              lastWeek: item.movements.lastWeek
            }
          }
        }
        return item
      })
    )

    // Add to history
    const now = new Date()
    const historyEntry: StockHistoryItem = {
      id: stockHistory.length + 1,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      product: productName,
      sku: product.sku,
      type: 'edited',
      user: 'Admin',
      changes: [
        { field: 'stock', oldValue: oldStock, newValue: newStock }
      ]
    }
    setStockHistory([historyEntry, ...stockHistory])

    toast.success(`+${quantity} units`, {
      description: productName
    })

    setQuickAddProductId(null)
    setQuickAddQuantity("")
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
        <Card className="md:col-span-1 md:row-span-2 h-full max-h-[332px] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-yellow-600 text-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              Low Stock ({lowStockItems.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Items need restocking soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 max-h-[280px] overflow-y-auto scrollbar-hide">
            {lowStockItems.length > 0 ? (
              <TooltipProvider>
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-1.5 border rounded">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.currentStock} left (reorder at {item.reorderLevel})
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-6 text-[10px] px-2 ml-2 flex-shrink-0"
                          variant="outline"
                          onClick={() => handleDismissLowStock(item.id)}
                        >
                          Reorder
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Done</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </TooltipProvider>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                All items have healthy stock levels
              </div>
            )}
          </CardContent>
        </Card>


        {/* Out of Stock - Row 2, Col 2-3 (1x2) */}
        <Card className="md:col-span-1 md:row-span-2 h-full max-h-[332px] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-red-600 text-sm">
              <Package className="h-3.5 w-3.5" />
              Out of Stock ({outOfStockItems.length})
            </CardTitle>
            <CardDescription className="text-xs">
              These items are completely out of stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 max-h-[280px] overflow-y-auto scrollbar-hide">
              {outOfStockItems.length > 0 ? (
                <TooltipProvider>
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-1.5 border rounded">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-muted-foreground">Urgent</div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="bg-red-600 hover:bg-red-700 h-5 text-[10px] px-2 ml-1"
                            onClick={() => handleDismissOutOfStock(item.id)}
                          >
                            Restock
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Done</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </TooltipProvider>
              ) : (
                <div className="col-span-2 text-xs text-muted-foreground text-center py-2">
                  No items are currently out of stock
                </div>
              )}
          </CardContent>
        </Card>
        {/* Search, Filter & Actions - Row 1, Col 2-3 (1x2) */}
        <Card className="md:col-span-2 md:row-span-1">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3">
              {/* Search, Filters and View Toggle Row - Responsive layout */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input - Takes 2/3 space on desktop, full width on mobile */}
                <div className="relative flex-1 md:flex-[2]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 h-10 text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters - Takes 1/3 space on desktop */}
                <div className="flex gap-2 md:flex-[1]">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="flex-1 h-10 text-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="flex-1 h-10 text-sm">
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="instock">In Stock</SelectItem>
                      <SelectItem value="lowstock">Low Stock</SelectItem>
                      <SelectItem value="outofstock">Out of Stock</SelectItem>
                      <SelectItem value="overstocked">Overstocked</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button
                  variant="outline"
                  className="h-10 text-sm px-3"
                  onClick={() => setIsHistoryModalOpen(true)}
                >
                  <History className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">History</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 text-sm px-3"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Import</span>
                </Button>
                <Button
                  className="bg-accent hover:bg-accent/90 h-10 text-sm px-3"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
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
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Inventory Management</CardTitle>
            <CardDescription className="text-xs">Complete product inventory with stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">SKU</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Price</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Stock</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Reorder</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">This Week</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Value</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {filteredProducts.map((item) => {
                        const status = getStockStatus(item)
                        return (
                          <tr key={item.id} className="hover:bg-muted/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium text-xs">{item.name}</div>
                                  <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{item.description}</div>
                                </div>
                                {item.bestseller && (
                                  <Badge className="bg-accent text-accent-foreground text-[9px] px-1.5 py-0">Best</Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-xs hidden md:table-cell whitespace-nowrap">{item.sku}</td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-xs">৳{item.sellingPrice}</div>
                              {item.costPrice > 0 && (
                                <>
                                  <div className="text-[8px] text-muted-foreground">Cost: ৳{item.costPrice}</div>
                                  <div className="text-[8px] text-muted-foreground">Margin: ৳{item.sellingPrice - item.costPrice}</div>
                                </>
                            )}
                            </td>
                            <td className="py-3 px-3 font-medium text-xs whitespace-nowrap">
                              {item.currentStock}
                              {item.currentStock <= item.reorderLevel && item.currentStock > 0 && (
                                <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 inline ml-1" />
                              )}
                            </td>
                            <td className="py-3 px-3 text-xs hidden lg:table-cell whitespace-nowrap">{item.reorderLevel}</td>
                            <td className="py-3 px-3 hidden sm:table-cell">
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
                            <td className="py-3 px-3 font-medium text-xs hidden lg:table-cell whitespace-nowrap">৳{item.totalValue.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <Badge className={`${status.color} text-[9px] px-2 py-1 whitespace-nowrap`}>
                                {status.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-3">
                              {quickAddProductId === item.id ? (
                                <div className="flex gap-1 items-center">
                                  <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={quickAddQuantity}
                                    onChange={(e) => setQuickAddQuantity(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && quickAddQuantity) {
                                        handleQuickAddStock(item.id, item.name)
                                      } else if (e.key === 'Escape') {
                                        setQuickAddProductId(null)
                                        setQuickAddQuantity("")
                                      }
                                    }}
                                    className="h-8 w-20 text-xs"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickAddStock(item.id, item.name)}
                                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                    disabled={!quickAddQuantity || parseInt(quickAddQuantity || "0") <= 0}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setQuickAddProductId(null)
                                      setQuickAddQuantity("")
                                    }}
                                    className="h-8 w-8 p-0 text-muted-foreground"
                                  >
                                    ×
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-1 items-center">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                          onClick={() => setQuickAddProductId(item.id)}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Quick add stock</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setEditingProduct(item)
                                      setIsEditModalOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hidden sm:inline-flex"
                                    onClick={() => {
                                      setProductToDelete(item)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddProduct}
        categories={customCategories}
        onAddCategory={handleAddCategory}
      />


      <ImportProductsModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportProducts}
      />


      <StockHistoryModal
        open={isHistoryModalOpen}
        onOpenChange={setIsHistoryModalOpen}
        history={stockHistory}
      />


      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={editingProduct}
        onSave={handleEditProduct}
        categories={customCategories}
        onAddCategory={handleAddCategory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Product</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-sm mb-1">{productToDelete.name}</div>
                <div className="text-xs text-muted-foreground">SKU: {productToDelete.sku}</div>
                <div className="text-xs text-muted-foreground">Current Stock: {productToDelete.currentStock} units</div>
              </div>
              <div>
                <Label htmlFor="deleteReason" className="text-xs">Reason for deletion *</Label>
                <Input
                  id="deleteReason"
                  placeholder="e.g., Discontinued, Damaged, Out of season..."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false)
                    setProductToDelete(null)
                    setDeleteReason("")
                  }}
                  className="flex-1 h-9 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProduct}
                  className="flex-1 h-9 text-sm"
                  disabled={!deleteReason.trim()}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </MainLayout>
  )
}