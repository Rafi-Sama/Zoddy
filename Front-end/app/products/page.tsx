"use client"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Download,
  Edit,
  Archive,
  Package,
  Grid3X3,
  List,
  AlertTriangle,
  TrendingUp,
  Search,
  Copy
} from "lucide-react"
const mockProducts = [
  {
    id: "1",
    name: "Cotton Kurti - Blue",
    description: "Premium cotton kurti with traditional embroidery",
    category: "Women's Fashion",
    price: 1200,
    costPrice: 800,
    stock: 25,
    sku: "CK001",
    image: null,
    bestseller: true,
    lowStock: false
  },
  {
    id: "2",
    name: "Silk Scarf - Red",
    description: "Elegant silk scarf with floral patterns",
    category: "Accessories",
    price: 500,
    costPrice: 300,
    stock: 8,
    sku: "SS002",
    image: null,
    bestseller: false,
    lowStock: true
  },
  {
    id: "3",
    name: "Designer Saree",
    description: "Handwoven designer saree with golden work",
    category: "Women's Fashion",
    price: 3500,
    costPrice: 2200,
    stock: 12,
    sku: "DS003",
    image: null,
    bestseller: true,
    lowStock: false
  },
  {
    id: "4",
    name: "Casual T-shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    category: "Men's Fashion",
    price: 450,
    costPrice: 250,
    stock: 0,
    sku: "CT004",
    image: null,
    bestseller: false,
    lowStock: false
  },
  {
    id: "5",
    name: "Embroidered Shirt",
    description: "Traditional shirt with intricate embroidery",
    category: "Men's Fashion",
    price: 1800,
    costPrice: 1200,
    stock: 15,
    sku: "ES005",
    image: null,
    bestseller: false,
    lowStock: false
  },
  {
    id: "6",
    name: "Matching Blouse",
    description: "Designer blouse to match sarees",
    category: "Women's Fashion",
    price: 800,
    costPrice: 500,
    stock: 6,
    sku: "MB006",
    image: null,
    bestseller: false,
    lowStock: true
  }
]
export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const getStockColor = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800"
    if (stock <= 10) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }
  const getStockStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock"
    if (stock <= 10) return "Low Stock"
    return "In Stock"
  }
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Products" }
      ]}
    >
      {/* Summary Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Total Products</CardTitle>
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{mockProducts.length}</div>
            <p className="text-[10px] text-muted-foreground">
              Active products in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Total Value</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ৳{mockProducts.reduce((acc, product) => acc + (product.price * product.stock), 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Total inventory value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">
              {mockProducts.filter(p => p.stock <= 10 && p.stock > 0).length}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Products need restocking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <CardTitle className="text-xs font-medium">Out of Stock</CardTitle>
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {mockProducts.filter(p => p.stock === 0).length}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Products unavailable
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 h-8 text-xs"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="womens">Womens Fashion</SelectItem>
                  <SelectItem value="mens">Mens Fashion</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="lowstock">Low Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="bestselling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-xs px-3">
                <Download className="h-3.5 w-3.5 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="h-8 text-xs px-3">
                <Download className="h-3.5 w-3.5 mr-2" />
                Import
              </Button>
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none h-8 px-3"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none h-8 px-3"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button className="bg-accent hover:bg-accent/90 h-8 text-xs px-3">
                <Plus className="h-3.5 w-3.5 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Products Display */}
      {viewMode === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow relative">
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
                  <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0">Out of Stock</Badge>
                </div>
              )}
              {product.bestseller && (
                <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground z-20 text-[9px] px-1.5 py-0">
                  Bestseller
                </Badge>
              )}
              <CardHeader className="pb-2">
                {/* Product Image Placeholder */}
                <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center mb-2">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Category</span>
                  <span className="text-xs">{product.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="font-bold text-sm">৳{product.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Stock</span>
                  <Badge className={`${getStockColor(product.stock)} text-[9px] px-1.5 py-0`}>
                    {product.stock} units
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">SKU</span>
                  <span className="text-xs font-mono">{product.sku}</span>
                </div>
                {product.stock <= 10 && product.stock > 0 && (
                  <div className="p-1.5 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center gap-1.5 text-yellow-800 text-xs">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Low stock warning
                    </div>
                  </div>
                )}
                <div className="flex gap-1.5 pt-1.5">
                  <Button variant="outline" className="flex-1 h-6 text-[10px] px-2">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" className="h-6 px-2">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" className="h-6 px-2">
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Products List</CardTitle>
            <CardDescription className="text-xs">Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 text-xs">Product</th>
                    <th className="text-left py-2 px-2 text-xs">Category</th>
                    <th className="text-left py-2 px-2 text-xs">Price</th>
                    <th className="text-left py-2 px-2 text-xs">Cost Price</th>
                    <th className="text-left py-2 px-2 text-xs">Stock</th>
                    <th className="text-left py-2 px-2 text-xs">SKU</th>
                    <th className="text-left py-2 px-2 text-xs">Status</th>
                    <th className="text-left py-2 px-2 text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-xs">{product.name}</div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1">{product.description}</div>
                          </div>
                          {product.bestseller && (
                            <Badge className="bg-accent text-accent-foreground text-[9px] px-1.5 py-0">Bestseller</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-xs">{product.category}</td>
                      <td className="py-2 px-2 font-medium text-xs">৳{product.price}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">৳{product.costPrice}</td>
                      <td className="py-2 px-2">
                        <span className="font-medium text-xs">{product.stock}</span>
                        {product.stock <= 10 && product.stock > 0 && (
                          <AlertTriangle className="inline h-3.5 w-3.5 ml-1 text-yellow-600" />
                        )}
                      </td>
                      <td className="py-2 px-2 font-mono text-xs">{product.sku}</td>
                      <td className="py-2 px-2">
                        <Badge className={`${getStockColor(product.stock)} text-[9px] px-1.5 py-0`}>
                          {getStockStatus(product.stock)}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" className="h-6 px-2">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" className="h-6 px-2">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" className="h-6 px-2">
                            <Archive className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  )
}