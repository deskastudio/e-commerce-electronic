"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  category: string
  image: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
}

const flashSaleProducts: Product[] = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    category: "Gaming",
    image: "/placeholder.svg?height=200&width=200",
    price: 120,
    originalPrice: 160,
    discount: 25,
    rating: 5,
    reviews: 88,
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    category: "Gaming",
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
    category: "Gaming",
    image: "/placeholder.svg?height=200&width=200",
    price: 370,
    originalPrice: 400,
    discount: 30,
    rating: 4.5,
    reviews: 99,
  },
  {
    id: 4,
    name: "S-Series Comfort Chair",
    category: "Furniture",
    image: "/placeholder.svg?height=200&width=200",
    price: 375,
    originalPrice: 400,
    discount: 25,
    rating: 4.5,
    reviews: 99,
  },
]

export default function FlashSales() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-primary" />
          <h2 className="text-xl font-semibold">Flash Sales</h2>
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

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Days</span>
            <span className="text-3xl font-semibold">{String(timeLeft.days).padStart(2, "0")}</span>
          </div>
          <span className="text-3xl">:</span>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Hours</span>
            <span className="text-3xl font-semibold">{String(timeLeft.hours).padStart(2, "0")}</span>
          </div>
          <span className="text-3xl">:</span>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Minutes</span>
            <span className="text-3xl font-semibold">{String(timeLeft.minutes).padStart(2, "0")}</span>
          </div>
          <span className="text-3xl">:</span>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Seconds</span>
            <span className="text-3xl font-semibold">{String(timeLeft.seconds).padStart(2, "0")}</span>
          </div>
        </div>
        <Button variant="link" className="hidden text-primary md:flex">
          View All Products
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flashSaleProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border">
            <div className="relative pt-4">
              <Badge className="absolute left-4 top-6 bg-primary text-primary-foreground">-{product.discount}%</Badge>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-6 h-8 w-8 rounded-full bg-background/80"
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
              <h3 className="line-clamp-1 font-medium">{product.name}</h3>
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

      <div className="mt-8 flex justify-center md:hidden">
        <Button variant="default" className="bg-primary text-white">
          View All Products
        </Button>
      </div>
    </section>
  )
}

