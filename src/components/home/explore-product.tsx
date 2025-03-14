import Image from "next/image"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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

const exploreProducts: Product[] = [
  {
    id: 1,
    name: "Breed Dry Dog Food",
    category: "Dog Food",
    image: "/placeholder.svg?height=200&width=200",
    price: 100,
    originalPrice: 120,
    rating: 4,
    reviews: 35,
  },
  {
    id: 2,
    name: "CANON EOS DSLR Camera",
    category: "Camera",
    image: "/placeholder.svg?height=200&width=200",
    price: 360,
    originalPrice: 400,
    rating: 4.5,
    reviews: 95,
  },
  {
    id: 3,
    name: "ASUS FHD Gaming Laptop",
    category: "Laptop",
    image: "/placeholder.svg?height=200&width=200",
    price: 700,
    originalPrice: 800,
    rating: 5,
    reviews: 325,
  },
  {
    id: 4,
    name: "Curology Product Set",
    category: "Skincare",
    image: "/placeholder.svg?height=200&width=200",
    price: 500,
    originalPrice: 600,
    rating: 4.5,
    reviews: 145,
  },
  {
    id: 5,
    name: "Kids Electric Car",
    category: "Toys",
    image: "/placeholder.svg?height=200&width=200",
    price: 960,
    originalPrice: 1160,
    rating: 5,
    reviews: 65,
  },
  {
    id: 6,
    name: "Jr. Zoom Soccer Cleats",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=200",
    price: 160,
    originalPrice: 200,
    rating: 4.5,
    reviews: 35,
  },
  {
    id: 7,
    name: "GP7 Video Game Controller",
    category: "Gaming",
    image: "/placeholder.svg?height=200&width=200",
    price: 160,
    originalPrice: 200,
    rating: 4.8,
    reviews: 55,
  },
  {
    id: 8,
    name: "Quilted Satin Jacket",
    category: "Fashion",
    image: "/placeholder.svg?height=200&width=200",
    price: 260,
    originalPrice: 330,
    rating: 4.9,
    reviews: 55,
  },
]

export default function ExploreProducts() {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-5 bg-primary" />
          <h2 className="text-xl font-semibold">Our Products</h2>
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

      <h2 className="mb-8 text-2xl font-bold">Explore Our Products</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {exploreProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative bg-gray-100 p-4">
              <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white">
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
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              </div>
              <div className="mt-2 flex items-center">
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
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="default">View All Products</Button>
      </div>
    </section>
  )
}

