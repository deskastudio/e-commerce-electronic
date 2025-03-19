"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recommendedItems = [
  {
    id: 1,
    name: "ASUS FHD Gaming Laptop",
    image: "/placeholder.svg?height=200&width=200",
    price: 960,
    originalPrice: 1160,
    discount: 20,
    rating: 5,
    reviews: 65,
  },
  {
    id: 2,
    name: "IPS LCD Gaming Monitor",
    image: "/placeholder.svg?height=200&width=200",
    price: 1160,
    originalPrice: 1160,
    rating: 5,
    reviews: 65,
  },
  {
    id: 3,
    name: "HAVIT HV-G92 Gamepad",
    image: "/placeholder.svg?height=200&width=200",
    price: 560,
    originalPrice: 560,
    isNew: true,
    rating: 5,
    reviews: 65,
  },
  {
    id: 4,
    name: "AK-900 Wired Keyboard",
    image: "/placeholder.svg?height=200&width=200",
    price: 200,
    originalPrice: 200,
    rating: 5,
    reviews: 65,
  },
]

export default function RecommendedItems() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-primary"></div>
          <h2 className="text-lg font-semibold">Just For You</h2>
        </div>
        <button className="text-sm font-medium hover:underline">See All</button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recommendedItems.map((item) => (
          <div key={item.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
              {item.discount && (
                <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">
                  -{item.discount}%
                </Badge>
              )}
              {item.isNew && <Badge className="absolute left-2 top-2 z-10 bg-green-500 text-white">NEW</Badge>}
              <button
                className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 opacity-80 transition-opacity hover:opacity-100"
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
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
              <div className="flex items-center">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                </div>
                <span className="ml-2 text-xs text-muted-foreground">({item.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

