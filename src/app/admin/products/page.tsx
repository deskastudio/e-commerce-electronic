import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Mock product data
const products = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name:
    i % 4 === 0
      ? "HAVIT HV-G92 Gamepad"
      : i % 4 === 1
        ? "AK-900 Wired Keyboard"
        : i % 4 === 2
          ? "IPS LCD Gaming Monitor"
          : "RGB liquid CPU Cooler",
  image: "/placeholder.svg?height=50&width=50",
  price: i % 4 === 0 ? 120 : i % 4 === 1 ? 960 : i % 4 === 2 ? 370 : 160,
  category: i % 4 === 0 ? "Gaming" : i % 4 === 1 ? "Accessories" : i % 4 === 2 ? "Monitors" : "Components",
  stock: Math.floor(Math.random() * 100),
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Draft" : "Archived",
}))

export default function AdminProducts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search products..." className="w-full" />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Filter by:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="monitors">Monitors</SelectItem>
              <SelectItem value="components">Components</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">#{product.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image width={50} height={50}
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/products/${product.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>42</strong> products
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            3
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            4
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            5
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

