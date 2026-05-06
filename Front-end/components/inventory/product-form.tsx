"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

interface ProductFormProps {
  value: ProductFormData
  onChange: (data: ProductFormData) => void
  disabled?: boolean
  showAdvanced?: boolean
}

const categories = [
  "Women's Fashion",
  "Men's Fashion",
  "Accessories",
  "Electronics",
  "Others"
]

export function ProductForm({
  value,
  onChange,
  disabled = false,
  showAdvanced = true
}: ProductFormProps) {
  const updateField = (field: keyof ProductFormData, fieldValue: string | number) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <div className="grid gap-4 py-4">
      {/* Basic Information */}
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-xs">Product Name *</Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Cotton Kurti - Blue"
          className="h-8 text-xs"
          disabled={disabled}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description" className="text-xs">Description</Label>
        <Textarea
          id="description"
          value={value.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Product description..."
          className="min-h-[60px] text-xs resize-none"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sku" className="text-xs">SKU *</Label>
          <Input
            id="sku"
            value={value.sku}
            onChange={(e) => updateField('sku', e.target.value)}
            placeholder="CK001"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category" className="text-xs">Category</Label>
          <Select
            value={value.category}
            onValueChange={(v) => updateField('category', v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="currentStock" className="text-xs">
            {showAdvanced ? 'Initial Stock' : 'Current Stock'}
          </Label>
          <Input
            id="currentStock"
            type="number"
            value={value.currentStock}
            onChange={(e) => updateField('currentStock', parseInt(e.target.value) || 0)}
            placeholder="50"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reorderLevel" className="text-xs">Reorder Level</Label>
          <Input
            id="reorderLevel"
            type="number"
            value={value.reorderLevel}
            onChange={(e) => updateField('reorderLevel', parseInt(e.target.value) || 0)}
            placeholder="10"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="costPrice" className="text-xs">Cost Price (৳)</Label>
          <Input
            id="costPrice"
            type="number"
            value={value.costPrice}
            onChange={(e) => updateField('costPrice', parseFloat(e.target.value) || 0)}
            placeholder="800"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sellingPrice" className="text-xs">Selling Price (৳)</Label>
          <Input
            id="sellingPrice"
            type="number"
            value={value.sellingPrice}
            onChange={(e) => updateField('sellingPrice', parseFloat(e.target.value) || 0)}
            placeholder="1200"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </div>
      </div>

      {value.costPrice > 0 && value.sellingPrice > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-xs">
            <span>Profit Margin</span>
            <span className="font-medium">
              ৳{(value.sellingPrice - value.costPrice).toFixed(2)} (
              {((value.sellingPrice - value.costPrice) / value.costPrice * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
