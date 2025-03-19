"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const wishlistItems = [
  {
    id: 1,
    name: "Gucci duffle bag",
    image: "/placeholder.svg?height=200&width=200",
    price: 960,
    originalPrice: 1160,
    discount: 20,
  },
  {
    id: 2,
    name: "RGB liquid CPU Cooler",
    image: "/placeholder.svg?height=200&width=200",
    price: 1960,
    originalPrice: 1960,
  },
  {
    id: 3,
    name: "GP11 Shooter USB Gamepad",
    image: "/placeholder.svg?height=200&width=200",
    price: 550,
    originalPrice: 550,
  },
  {
    id: 4,
    name: "Quilted Satin Jacket",
    image: "/placeholder.svg?height=200&width=200",
    price: 750,
    originalPrice: 750,
  },
]

export default function WishlistItems() {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {wishlistItems.map((item) => (
        <div key={item.id} className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
            {item.discount && (
              <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">-{item.discount}%</Badge>
            )}
            <button
              className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 opacity-80 transition-opacity hover:opacity-100"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="mt-4 space-y-2">
            <Button className="w-full bg-black text-white hover:bg-black/90">Add To Cart</Button>
            <h3 className="font-medium">{item.name}</h3>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">${item.price}</span>
              {item.originalPrice > item.price && (
                <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

