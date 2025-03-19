import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock category data
const categories = [
  { id: 1, name: "Gaming", products: 35, status: "Active", description: "Gaming accessories and peripherals" },
  { id: 2, name: "Accessories", products: 42, status: "Active", description: "Computer and phone accessories" },
  { id: 3, name: "Monitors", products: 28, status: "Active", description: "Computer monitors and displays" },
  { id: 4, name: "Components", products: 47, status: "Active", description: "Computer components and parts" },
  { id: 5, name: "Laptops", products: 25, status: "Active", description: "Laptops and notebooks" },
  { id: 6, name: "Peripherals", products: 33, status: "Active", description: "Computer peripherals" },
  { id: 7, name: "Smartphones", products: 18, status: "Draft", description: "Mobile phones and smartphones" },
  { id: 8, name: "Tablets", products: 12, status: "Draft", description: "Tablets and e-readers" },
  { id: 9, name: "Wearables", products: 8, status: "Archived", description: "Smartwatches and fitness trackers" },
  { id: 10, name: "Audio", products: 22, status: "Active", description: "Headphones, speakers, and audio equipment" },
]

export default function AdminCategories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search categories..." className="w-full" />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">#{category.id}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.products}</TableCell>
                <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${
                      category.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : category.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/categories/${category.id}`}>
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
          Showing <strong>1-10</strong> of <strong>10</strong> categories
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 bg-primary text-white">
            1
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

