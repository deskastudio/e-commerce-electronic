"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Update the ProductsGrid component to handle filtering and search
interface ProductsGridProps {
  page?: number
  category?: string
  search?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  brand?: string[] | undefined
  rating?: number[] | undefined
}

export default function ProductsGrid({
  page = 1,
  category,
  search,
  sort = "newest",
  minPrice = 0,
  maxPrice = 1000,
  brand,
  rating,
}: ProductsGridProps) {
  const [wishlist, setWishlist] = useState<number[]>([])

  // Filter products based on parameters
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (category && product.category !== category) return false

    // Filter by search
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false

    // Filter by price
    if (product.price < minPrice || product.price > maxPrice) return false

    // Filter by brand
    if (brand && brand.length > 0 && !brand.includes(product.brand)) return false

    // Filter by rating
    if (rating && rating.length > 0 && !rating.includes(Math.floor(product.rating))) return false

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "discount":
        return (b.discount || 0) - (a.discount || 0)
      case "newest":
      default:
        return b.id - a.id
    }
  })

  // Paginate products
  const itemsPerPage = 12
  const startIndex = (page - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  // Show message if no products found
  if (paginatedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="mb-2 text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {paginatedProducts.map((product) => (
        <div key={product.id} className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
            {product.discount > 0 && (
              <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">
                -{product.discount}%
              </Badge>
            )}
            <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
              <button
                className="rounded-full bg-white p-1.5 opacity-80 transition-opacity hover:opacity-100"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button className="rounded-full bg-white p-1.5 opacity-80 transition-opacity hover:opacity-100">
                <Eye className="h-4 w-4" />
              </button>
            </div>
            <Link href={`/product/${product.id}`}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            <Link href={`/product/${product.id}`} className="block">
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400" : "fill-gray-300"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
              </div>
              <span className="ml-2 text-xs text-muted-foreground">({product.reviews})</span>
            </div>
            <Button className="w-full bg-black text-white hover:bg-black/90" variant="default">
              Add To Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Add brand property to products
const products = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name:
    i % 4 === 0
      ? "HAVIT HV-G92 Gamepad"
      : i % 4 === 1
        ? "AK-900 Wired Keyboard"
        : i % 4 === 2
          ? "IPS LCD Gaming Monitor"
          : "RGB liquid CPU Cooler",
  image: "/placeholder.svg?height=200&width=200",
  price: i % 4 === 0 ? 120 : i % 4 === 1 ? 960 : i % 4 === 2 ? 370 : 160,
  originalPrice: i % 4 === 0 ? 160 : i % 4 === 1 ? 1160 : i % 4 === 2 ? 400 : 170,
  discount: i % 4 === 0 ? 25 : i % 4 === 1 ? 35 : i % 4 === 2 ? 30 : 0,
  rating: i % 3 === 0 ? 5 : i % 3 === 1 ? 4 : 4.5,
  reviews: Math.floor(Math.random() * 100) + 20,
  category: i % 4 === 0 ? "gaming" : i % 4 === 1 ? "accessories" : i % 4 === 2 ? "monitors" : "components",
  brand: i % 5 === 0 ? "havit" : i % 5 === 1 ? "asus" : i % 5 === 2 ? "msi" : i % 5 === 3 ? "logitech" : "razer",
}))

