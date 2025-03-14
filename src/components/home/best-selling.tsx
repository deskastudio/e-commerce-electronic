import Image from "next/image"
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: number
  name: string
  category: string
  image: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
}

const bestSellingProducts: Product[] = [
  {
    id: 1,
    name: "The north coat",
    category: "Coat",
    image: "/placeholder.svg?height=200&width=200",
    price: 260,
    originalPrice: 360,
    rating: 5,
    reviews: 65,
  },
  {
    id: 2,
    name: "Gucci duffle bag",
    category: "Bag",
    image: "/placeholder.svg?height=200&width=200",
    price: 960,
    originalPrice: 1160,
    rating: 4.5,
    reviews: 65,
  },
  {
    id: 3,
    name: "RGB liquid CPU Cooler",
    category: "Electronics",
    image: "/placeholder.svg?height=200&width=200",
    price: 160,
    originalPrice: 170,
    rating: 4.5,
    reviews: 65,
  },
  {
    id: 4,
    name: "Small BookShelf",
    category: "Furniture",
    image: "/placeholder.svg?height=200&width=200",
    price: 360,
    originalPrice: 400,
    rating: 5,
    reviews: 65,
  },
]

export default function BestSelling() {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-5 bg-primary" />
          <h2 className="text-xl font-semibold">This Month</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Best Selling Products</h2>
        <Button variant="outline">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bestSellingProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border-none shadow-none">
            <div className="relative bg-gray-100 p-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <div className="flex h-[200px] items-center justify-center">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="h-auto max-h-[150px] w-auto object-contain"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-primary">${product.price}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400" : "fill-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                </div>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
