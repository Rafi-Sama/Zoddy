"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, Plus } from 'lucide-react'

export interface InventoryItem {
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
  image: null
  bestseller: boolean
  movements: {
    thisWeek: { in: number; out: number }
    lastWeek: { in: number; out: number }
  }
}

interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem | null
  onSave: (product: InventoryItem) => void
  categories?: string[]
  onAddCategory?: (category: string) => void
}

export function EditProductModal({ open, onOpenChange, product, onSave, categories = [], onAddCategory }: EditProductModalProps) {
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(product)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const defaultCategories = ["Women's Fashion", "Men's Fashion", "Accessories", "Electronics", "Others"]
  const allCategories = [...new Set([...defaultCategories, ...categories])]

  useEffect(() => {
    setEditingProduct(product)
  }, [product])

  if (!editingProduct) return null

  const handleSave = () => {
    onSave(editingProduct)
    onOpenChange(false)
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim() && onAddCategory) {
      onAddCategory(newCategory.trim())
      setEditingProduct({...editingProduct, category: newCategory.trim()})
      setNewCategory("")
      setIsAddingCategory(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details and information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Basic Information</h3>

              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-xs">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description" className="text-xs">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="min-h-[60px] text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-sku" className="text-xs">SKU *</Label>
                  <Input
                    id="edit-sku"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category" className="text-xs">Category</Label>
                  {!isAddingCategory ? (
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value) => {
                        if (value === "__create_new__") {
                          setIsAddingCategory(true)
                        } else {
                          setEditingProduct({...editingProduct, category: value})
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
            </div>

            {/* Stock Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Stock Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock" className="text-xs">Current Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.currentStock}
                    onChange={(e) => setEditingProduct({...editingProduct, currentStock: parseInt(e.target.value) || 0})}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-reorder" className="text-xs">Reorder Level</Label>
                  <Input
                    id="edit-reorder"
                    type="number"
                    value={editingProduct.reorderLevel}
                    onChange={(e) => setEditingProduct({...editingProduct, reorderLevel: parseInt(e.target.value) || 0})}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Pricing Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-cost" className="text-xs">Cost Price (৳)</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({...editingProduct, costPrice: parseFloat(e.target.value) || 0})}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-selling" className="text-xs">Selling Price (৳)</Label>
                  <Input
                    id="edit-selling"
                    type="number"
                    value={editingProduct.sellingPrice}
                    onChange={(e) => setEditingProduct({...editingProduct, sellingPrice: parseFloat(e.target.value) || 0})}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs px-3"
          >
            Cancel
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 h-8 text-xs px-3"
            onClick={handleSave}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
