"use client"

import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const relatedProducts = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    image: "/placeholder.svg?height=200&width=200",
    price: 120,
    originalPrice: 160,
    discount: 40,
    rating: 5,
    reviews: 88,
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    image: "/placeholder.svg?height=200&width=200",
    price: 960,
    originalPrice: 1160,
    discount: 35,
    rating: 4,
    reviews: 75,
  },
  {
    id: 3,
    name: "IPS LCD Gaming Monitor",
    image: "/placeholder.svg?height=200&width=200",
    price: 370,
    originalPrice: 400,
    discount: 30,
    rating: 4.5,
    reviews: 99,
  },
  {
    id: 4,
    name: "RGB liquid CPU Cooler",
    image: "/placeholder.svg?height=200&width=200",
    price: 160,
    originalPrice: 170,
    discount: 0,
    rating: 5,
    reviews: 65,
  },
]

export default function RelatedProducts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 bg-primary"></div>
        <h2 className="text-lg font-semibold">Related Item</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
              {product.discount > 0 && (
                <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">
                  -{product.discount}%
                </Badge>
              )}
              <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
                <button className="rounded-full bg-white p-1.5 opacity-80 transition-opacity hover:opacity-100">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-white p-1.5 opacity-80 transition-opacity hover:opacity-100">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="mt-4 space-y-2">
              {product.id === 2 && (
                <Button className="w-full bg-black text-white hover:bg-black/90">Add To Cart</Button>
              )}
              <h3 className="font-medium">{product.name}</h3>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

