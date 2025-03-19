"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductsSidebar from "./products-sidebar"

// Update the ProductsHeader component to handle search more robustly
interface ProductsHeaderProps {
  initialSearch?: string
}

export default function ProductsHeader({ initialSearch = "" }: ProductsHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new URLSearchParams object from the current URL
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove the search parameter
    if (searchQuery && searchQuery.trim() !== "") {
      params.set("search", searchQuery.trim())
    } else {
      params.delete("search")
    }

    // Reset to first page on new search
    params.set("page", "1")

    // Navigate to the new URL
    router.push(`/products?${params.toString()}`)
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Showing 1-12 of 120 results</span>
        </div>

        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down your product search with filters.</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <ProductsSidebar />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <Select defaultValue={searchParams.get("sort") || "newest"} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

