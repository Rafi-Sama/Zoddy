"use client"
import { useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
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
} from "@/components/ui/dialog"
import {
  Plus,
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  History,
  Search,
  Grid3X3,
  List,
  Download,
  Edit,
  Copy,
  Archive,
  Trash2,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useData, useMutation } from "@/hooks/use-database-optimized"
import { Product } from "@/types/database"
import { format } from "date-fns"

// Lazy load modals for better performance
const AddProductModal = dynamic(() => import("@/components/inventory/add-product-modal").then(mod => ({ default: mod.AddProductModal })), {
  ssr: false,
})

const EditProductModal = dynamic(() => import("@/components/inventory/edit-product-modal").then(mod => ({ default: mod.EditProductModal })), {
  ssr: false,
})

const ImportProductsModal = dynamic(() => import("@/components/inventory/import-products-modal").then(mod => ({ default: mod.ImportProductsModal })), {
  ssr: false,
})

const StockHistoryModal = dynamic(() => import("@/components/inventory/stock-history-modal").then(mod => ({ default: mod.StockHistoryModal })), {
  ssr: false,
})

// Define types directly
interface ProductFormData {
  name: string
  description: string
  sku: string
  category: string
  currentStock: number
  reorderLevel: number
  costPrice: number
  sellingPrice: number
}

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
  // Fetch products from database (realtime disabled to reduce API requests)
  // Data refreshes on manual refetch() calls instead
  const { data: products, loading: productsLoading, error: productsError } = useData<Product[]>({
    table: 'products',
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    realtime: false // Disabled to reduce excessive API requests
  })

  // Mutations for CRUD operations
  const { insert: insertProduct, update: updateProduct, remove: deleteProduct, loading: mutationLoading } = useMutation<Product>('products')

  // State management
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleteReason, setDeleteReason] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [dismissedLowStock, setDismissedLowStock] = useState<Set<string>>(new Set())
  const [dismissedOutOfStock, setDismissedOutOfStock] = useState<Set<string>>(new Set())
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([])
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [quickAddProductId, setQuickAddProductId] = useState<string | null>(null)
  const [quickAddQuantity, setQuickAddQuantity] = useState("")

  // Calculate statistics from actual data
  const inventory = useMemo(() => products || [], [products])
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.current_stock * (item.cost_price || 0)), 0)
  const lowStockItems = inventory.filter(item =>
    item.reorder_level &&
    item.current_stock <= item.reorder_level &&
    item.current_stock > 0 &&
    !dismissedLowStock.has(item.id)
  )
  const outOfStockItems = inventory.filter(item => item.current_stock === 0 && !dismissedOutOfStock.has(item.id))
  const overstockedItems = inventory.filter(item =>
    item.reorder_level &&
    item.current_stock > item.reorder_level * 3
  )

  const handleDismissLowStock = (itemId: string) => {
    setDismissedLowStock(prev => new Set([...prev, itemId]))
    toast.success("Item marked as handled")
  }

  const handleDismissOutOfStock = (itemId: string) => {
    setDismissedOutOfStock(prev => new Set([...prev, itemId]))
    toast.success("Item marked as handled")
  }

  // Filter products based on search and filters - memoized for performance
  const filteredProducts = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const reorderLevel = item.reorder_level || 10
      const matchesStock = stockFilter === "all" ||
                          (stockFilter === "instock" && item.current_stock > reorderLevel) ||
                          (stockFilter === "lowstock" && item.current_stock <= reorderLevel && item.current_stock > 0) ||
                          (stockFilter === "outofstock" && item.current_stock === 0) ||
                          (stockFilter === "overstocked" && item.current_stock > reorderLevel * 3)
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [inventory, searchTerm, categoryFilter, stockFilter])

  // Memoize helper function for better performance
  const getStockStatus = useCallback((item: Product) => {
    const reorderLevel = item.reorder_level || 10
    if (item.current_stock === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (item.current_stock <= reorderLevel) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    if (item.current_stock > reorderLevel * 3) return { status: "Overstocked", color: "bg-blue-100 text-blue-800" }
    return { status: "In Stock", color: "bg-green-100 text-green-800" }
  }, [])


  const handleAddProduct = useCallback(async (productData: ProductFormData) => {
    const product: Partial<Product> = {
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      category: productData.category,
      current_stock: productData.currentStock,
      reorder_level: productData.reorderLevel,
      cost_price: productData.costPrice,
      selling_price: productData.sellingPrice,
      status: 'active',
    }

    const result = await insertProduct(product)

    if (result) {
      // Add to history
      const now = new Date()
      const historyEntry: StockHistoryItem = {
        id: stockHistory.length + 1,
        date: format(now, 'dd/MM/yyyy'),
        time: format(now, 'HH:mm'),
        product: productData.name,
        type: 'added',
        user: 'Admin',
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
      // Cache is automatically invalidated by mutation hook, no refetch needed
    }
  }, [insertProduct, stockHistory])

  const handleEditProduct = useCallback(async (product: Product) => {
    const oldProduct = inventory.find(item => item.id === product.id)

    const result = await updateProduct(product.id, {
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      current_stock: product.current_stock,
      reorder_level: product.reorder_level,
      cost_price: product.cost_price,
      selling_price: product.selling_price,
    })

    if (result && oldProduct) {
      // Track changes
      const changes: { field: string; oldValue: string | number; newValue: string | number }[] = []

      if (oldProduct.name !== product.name) {
        changes.push({ field: 'name', oldValue: oldProduct.name, newValue: product.name })
      }
      if (oldProduct.sku !== product.sku) {
        changes.push({ field: 'SKU', oldValue: oldProduct.sku || '', newValue: product.sku || '' })
      }
      if (oldProduct.category !== product.category) {
        changes.push({ field: 'category', oldValue: oldProduct.category || '', newValue: product.category || '' })
      }
      if (oldProduct.current_stock !== product.current_stock) {
        changes.push({ field: 'stock', oldValue: oldProduct.current_stock, newValue: product.current_stock })
      }
      if (oldProduct.selling_price !== product.selling_price) {
        changes.push({ field: 'price', oldValue: `৳${oldProduct.selling_price}`, newValue: `৳${product.selling_price}` })
      }
      if (oldProduct.cost_price !== product.cost_price) {
        changes.push({ field: 'cost', oldValue: `৳${oldProduct.cost_price || 0}`, newValue: `৳${product.cost_price || 0}` })
      }
      if (oldProduct.reorder_level !== product.reorder_level) {
        changes.push({ field: 'reorder level', oldValue: oldProduct.reorder_level || 0, newValue: product.reorder_level || 0 })
      }

      if (changes.length > 0) {
        const now = new Date()
        const historyEntry: StockHistoryItem = {
          id: stockHistory.length + 1,
          date: format(now, 'dd/MM/yyyy'),
          time: format(now, 'HH:mm'),
          product: product.name,
          sku: product.sku || '',
          type: 'edited',
          user: 'Admin',
          changes
        }
        setStockHistory([historyEntry, ...stockHistory])
      }

      toast.success("Product updated successfully", {
        description: `${product.name} has been updated`
      })

      setIsEditModalOpen(false)
      setEditingProduct(null)
      // Cache is automatically invalidated by mutation hook, no refetch needed
    }
  }, [inventory, updateProduct, stockHistory])

  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete || !deleteReason.trim()) {
      toast.error("Please provide a reason for deletion")
      return
    }

    // Add to history before deleting
    const now = new Date()
    const historyEntry: StockHistoryItem = {
      id: stockHistory.length + 1,
      date: format(now, 'dd/MM/yyyy'),
      time: format(now, 'HH:mm'),
      product: productToDelete.name,
      type: 'deleted',
      user: 'Admin',
      finalData: {
        sku: productToDelete.sku || '',
        category: productToDelete.category || '',
        finalStock: productToDelete.current_stock,
        cost: productToDelete.cost_price,
        price: productToDelete.selling_price,
        reason: deleteReason
      }
    }
    setStockHistory([historyEntry, ...stockHistory])

    const success = await deleteProduct(productToDelete.id)

    if (success) {
      toast.success("Product deleted", {
        description: `${productToDelete.name} has been removed from inventory`
      })

      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
      setDeleteReason("")
      // Cache is automatically invalidated by mutation hook, no refetch needed
    }
  }, [productToDelete, deleteReason, stockHistory, deleteProduct])

  const handleImportProducts = useCallback(async (file: File) => {
    // This would be implemented with actual CSV/Excel parsing
    toast.success("Import feature coming soon", {
      description: `File ${file.name} ready for import`
    })
  }, [])

  const handleAddCategory = useCallback((category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories([...customCategories, category])
      toast.success("Category added", {
        description: `${category} has been added to the category list`
      })
    }
  }, [customCategories])

  // Get unique categories from inventory - memoized
  const allCategories = useMemo(() => {
    const cats = [...new Set(inventory.map(item => item.category).filter(Boolean) as string[])]
    return [...cats, ...customCategories]
  }, [inventory, customCategories])

  const handleQuickAddStock = useCallback(async (productId: string, productName: string) => {
    if (!quickAddQuantity) return

    const quantity = parseInt(quickAddQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    const product = inventory.find(item => item.id === productId)
    if (!product) return

    const oldStock = product.current_stock
    const newStock = oldStock + quantity

    await updateProduct(productId, { current_stock: newStock })

    // Add to history
    const now = new Date()
    const historyEntry: StockHistoryItem = {
      id: stockHistory.length + 1,
      date: format(now, 'dd/MM/yyyy'),
      time: format(now, 'HH:mm'),
      product: productName,
      sku: product.sku || '',
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
    // Cache is automatically invalidated by mutation hook, no refetch needed
  }, [inventory, quickAddQuantity, stockHistory, updateProduct])

  // Loading state
  if (productsLoading) {
    return (
      <MainLayout breadcrumbs={[{ label: "Inventory" }]}>
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // Error state
  if (productsError) {
    return (
      <MainLayout breadcrumbs={[{ label: "Inventory" }]}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load inventory data. {productsError.message}
          </AlertDescription>
        </Alert>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Inventory" }
      ]}
    >

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
                        {item.current_stock} left (reorder at {item.reorder_level || 10})
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
            const reorderLevel = item.reorder_level || 10
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow relative">
                {item.current_stock === 0 && (
                  <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
                    <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0">Out of Stock</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm line-clamp-1">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{item.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">SKU</span>
                    <span className="text-xs font-mono">{item.sku || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="font-bold text-xs">৳{item.selling_price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Stock</span>
                    <Badge className={`${status.color} text-[9px] px-1.5 py-0`}>
                      {item.current_stock} units
                    </Badge>
                  </div>
                  {item.current_stock <= reorderLevel && item.current_stock > 0 && (
                    <div className="p-1 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center gap-1 text-yellow-800 text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        Low stock warning
                      </div>
                    </div>
                  )}
                  <div className="flex gap-1 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 h-6 text-[10px] px-2"
                      onClick={() => {
                        setEditingProduct(item)
                        setIsEditModalOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
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
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Value</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {filteredProducts.map((item) => {
                        const status = getStockStatus(item)
                        const reorderLevel = item.reorder_level || 10
                        const totalValue = item.current_stock * (item.cost_price || 0)
                        return (
                          <tr key={item.id} className="hover:bg-muted/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium text-xs">{item.name}</div>
                                  <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{item.description || 'No description'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-xs hidden md:table-cell whitespace-nowrap">{item.sku || 'N/A'}</td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-xs">৳{item.selling_price}</div>
                              {item.cost_price && item.cost_price > 0 && (
                                <>
                                  <div className="text-[8px] text-muted-foreground">Cost: ৳{item.cost_price}</div>
                                  <div className="text-[8px] text-muted-foreground">Margin: ৳{item.selling_price - item.cost_price}</div>
                                </>
                            )}
                            </td>
                            <td className="py-3 px-3 font-medium text-xs whitespace-nowrap">
                              {item.current_stock}
                              {item.current_stock <= reorderLevel && item.current_stock > 0 && (
                                <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 inline ml-1" />
                              )}
                            </td>
                            <td className="py-3 px-3 text-xs hidden lg:table-cell whitespace-nowrap">{reorderLevel}</td>
                            <td className="py-3 px-3 font-medium text-xs hidden lg:table-cell whitespace-nowrap">৳{totalValue.toLocaleString()}</td>
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
                                    {mutationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
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
        product={editingProduct ? {
          id: editingProduct.id,
          name: editingProduct.name,
          description: editingProduct.description || '',
          sku: editingProduct.sku,
          category: editingProduct.category,
          currentStock: editingProduct.current_stock,
          reorderLevel: editingProduct.reorder_level,
          costPrice: editingProduct.cost_price,
          sellingPrice: editingProduct.selling_price,
          totalValue: editingProduct.current_stock * editingProduct.cost_price,
          image: null,
          bestseller: editingProduct.bestseller || false,
          movements: {
            thisWeek: { in: 0, out: 0 },
            lastWeek: { in: 0, out: 0 }
          }
        } : null}
        onSave={(inventoryItem) => {
          handleEditProduct({
            ...editingProduct!,
            name: inventoryItem.name,
            description: inventoryItem.description,
            sku: inventoryItem.sku,
            category: inventoryItem.category,
            current_stock: inventoryItem.currentStock,
            reorder_level: inventoryItem.reorderLevel,
            cost_price: inventoryItem.costPrice,
            selling_price: inventoryItem.sellingPrice
          })
        }}
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
                <div className="text-xs text-muted-foreground">SKU: {productToDelete.sku || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">Current Stock: {productToDelete.current_stock} units</div>
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
                  disabled={!deleteReason.trim() || mutationLoading}
                >
                  {mutationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </MainLayout>
  )
}
