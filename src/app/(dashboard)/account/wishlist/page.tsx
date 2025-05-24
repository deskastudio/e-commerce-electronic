"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"

interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  inStock: boolean
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Smartphone X Pro",
      price: 799.99,
      originalPrice: 899.99,
      image: "/placeholder.svg",
      inStock: true,
    },
    {
      id: 2,
      name: "Wireless Earbuds",
      price: 149.99,
      image: "/placeholder.svg",
      inStock: true,
    },
    {
      id: 3,
      name: "Smart Watch Series 5",
      price: 299.99,
      originalPrice: 349.99,
      image: "/placeholder.svg",
      inStock: false,
    },
  ])

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">My Wishlist</h1>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white rounded-full h-8 w-8"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-base mb-1 line-clamp-2">{item.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium text-red-500">${item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {item.inStock ? (
                    <Badge className="bg-green-100 text-green-800 font-normal">In Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 font-normal">
                      Out of Stock
                    </Badge>
                  )}
                  <Button size="sm" className="bg-red-500 hover:bg-red-600" disabled={!item.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">
              Add items to your wishlist to keep track of products you are interested in.
            </p>
            <Button className="bg-red-500 hover:bg-red-600">Browse Products</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
