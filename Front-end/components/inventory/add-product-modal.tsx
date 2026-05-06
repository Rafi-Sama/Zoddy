"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, Plus } from 'lucide-react'

export interface ProductFormData {
  name: string
  description: string
  sku: string
  category: string
  brand?: string
  unit?: string
  currentStock: number
  reorderLevel: number
  minOrderQuantity?: number
  maxOrderQuantity?: number
  costPrice: number
  sellingPrice: number
  discountPrice?: number
  supplier?: string
  supplierPhone?: string
  barcode?: string
  tags?: string
  location?: string
  expiryDate?: string
  manufacturingDate?: string
  warranty?: string
  weight?: string
  dimensions?: string
  color?: string
  size?: string
  status?: string
}

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (product: ProductFormData) => void
  categories?: string[]
  onAddCategory?: (category: string) => void
}

const initialProductState: ProductFormData = {
  name: "",
  description: "",
  sku: "",
  category: "",
  brand: "",
  unit: "piece",
  currentStock: 0,
  reorderLevel: 10,
  minOrderQuantity: 1,
  maxOrderQuantity: 100,
  costPrice: 0,
  sellingPrice: 0,
  discountPrice: 0,
  supplier: "",
  supplierPhone: "",
  barcode: "",
  tags: "",
  location: "",
  expiryDate: "",
  manufacturingDate: "",
  warranty: "",
  weight: "",
  dimensions: "",
  color: "",
  size: "",
  status: "active"
}

export function AddProductModal({ open, onOpenChange, onAdd, categories = [], onAddCategory }: AddProductModalProps) {
  const [product, setProduct] = useState<ProductFormData>(initialProductState)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const defaultCategories = ["Women's Fashion", "Men's Fashion", "Accessories", "Electronics", "Others"]
  const allCategories = [...new Set([...defaultCategories, ...categories])]

  const handleSubmit = () => {
    onAdd(product)
    setProduct(initialProductState)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setProduct(initialProductState)
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim() && onAddCategory) {
      onAddCategory(newCategory.trim())
      setProduct({...product, category: newCategory.trim()})
      setNewCategory("")
      setIsAddingCategory(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory with complete details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs">Product Name</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => setProduct({...product, name: e.target.value})}
                placeholder="Cotton Kurti - Blue"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) => setProduct({...product, description: e.target.value})}
                placeholder="Product description..."
                className="min-h-[60px] text-xs resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku" className="text-xs">SKU</Label>
                <Input
                  id="sku"
                  value={product.sku}
                  onChange={(e) => setProduct({...product, sku: e.target.value})}
                  placeholder="CK001"
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-xs">Category</Label>
                {!isAddingCategory ? (
                  <Select
                    value={product.category}
                    onValueChange={(value) => {
                      if (value === "__create_new__") {
                        setIsAddingCategory(true)
                      } else {
                        setProduct({...product, category: value})
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="__create_new__" className="text-accent font-medium">
                        <div className="flex items-center gap-2">
                          <Plus className="h-3 w-3" />
                          Create New Category
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category"
                      className="h-8 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNewCategory()
                        } else if (e.key === 'Escape') {
                          setIsAddingCategory(false)
                          setNewCategory("")
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleAddNewCategory}
                      className="h-8 px-3 bg-accent hover:bg-accent/90"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setNewCategory("")
                      }}
                      className="h-8 px-3"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentStock" className="text-xs">Initial Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={product.currentStock}
                  onChange={(e) => setProduct({...product, currentStock: parseInt(e.target.value) || 0})}
                  placeholder="50"
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reorderLevel" className="text-xs">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={product.reorderLevel}
                  onChange={(e) => setProduct({...product, reorderLevel: parseInt(e.target.value) || 0})}
                  placeholder="10"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="costPrice" className="text-xs">Cost Price (৳)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={product.costPrice}
                  onChange={(e) => setProduct({...product, costPrice: parseFloat(e.target.value) || 0})}
                  placeholder="800"
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sellingPrice" className="text-xs">Selling Price (৳)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  value={product.sellingPrice}
                  onChange={(e) => setProduct({...product, sellingPrice: parseFloat(e.target.value) || 0})}
                  placeholder="1200"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            {product.costPrice > 0 && product.sellingPrice > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between text-xs">
                  <span>Profit Margin</span>
                  <span className="font-medium">
                    ৳{(product.sellingPrice - product.costPrice).toFixed(2)} (
                    {((product.sellingPrice - product.costPrice) / product.costPrice * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
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
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
