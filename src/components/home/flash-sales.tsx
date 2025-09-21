// src/components/flash-sales.tsx - Fixed Hydration Error
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProductImage from "@/components/admin/products/product-image"
import { getFirstValidImage } from "@/lib/utils/image-helpers"
import { Product } from "@/types/product"

interface FlashSalesProps {
  products?: Product[];
}

export default function FlashSales({ products = [] }: FlashSalesProps) {
  // FIXED: Initialize with stable values to prevent hydration mismatch
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  })
  
  // FIXED: Track if component is mounted to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // FIXED: Set mounted flag after component mounts
    setIsMounted(true)
    
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

  // Format price to Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // FIXED: Use stable discount calculation based on product ID
  const calculateDiscountPrice = (product: Product): { discountPrice: number; discount: number } => {
    // Use product ID to generate consistent discount (not random)
    const productIdNum = parseInt(product.id.slice(-2), 16) || 1;
    const discount = 20 + (productIdNum % 30); // 20-50% discount based on ID
    const discountPrice = Math.floor(product.price * (100 - discount) / 100);
    return { discountPrice, discount };
  };

  // FIXED: Don't render dynamic content until mounted
  if (!isMounted) {
    return (
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-red-500" />
            <h2 className="text-xl font-semibold text-red-500">Todays</h2>
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
          <h2 className="text-3xl font-bold">Flash Sales</h2>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Days</span>
              <span className="text-3xl font-semibold">03</span>
            </div>
            <span className="text-3xl text-red-500">:</span>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Hours</span>
              <span className="text-3xl font-semibold">23</span>
            </div>
            <span className="text-3xl text-red-500">:</span>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Minutes</span>
              <span className="text-3xl font-semibold">19</span>
            </div>
            <span className="text-3xl text-red-500">:</span>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Seconds</span>
              <span className="text-3xl font-semibold">56</span>
            </div>
          </div>
          <Button variant="link" className="hidden text-red-500 md:flex">
            View All Products
          </Button>
        </div>

        {/* Loading placeholder */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-[280px] rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-red-500" />
          <h2 className="text-xl font-semibold text-red-500">Todays</h2>
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
        <h2 className="text-3xl font-bold">Flash Sales</h2>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Days</span>
            <span className="text-3xl font-semibold">{String(timeLeft.days).padStart(2, "0")}</span>
          </div>
          <span className="text-3xl text-red-500">:</span>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Hours</span>
            <span className="text-3xl font-semibold">{String(timeLeft.hours).padStart(2, "0")}</span>
          </div>
          <span className="text-3xl text-red-500">:</span>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Minutes</span>
            <span className="text-3xl font-semibold">{String(timeLeft.minutes).padStart(2, "0")}</span>
          </div>
          <span className="text-3xl text-red-500">:</span>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Seconds</span>
            <span className="text-3xl font-semibold">{String(timeLeft.seconds).padStart(2, "0")}</span>
          </div>
        </div>
        <Button variant="link" className="hidden text-red-500 md:flex">
          View All Products
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => {
          const { discountPrice, discount } = calculateDiscountPrice(product);
          const firstImage = getFirstValidImage(product.images);
          
          return (
            <Card key={product.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <div className="relative bg-gray-50 p-4">
                <Badge className="absolute left-4 top-4 bg-red-500 text-white z-10">
                  -{discount}%
                </Badge>
                
                <div className="absolute right-4 top-4 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white shadow-sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Link href={`/product/${product.id}`}>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white shadow-sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <Link href={`/product/${product.id}`}>
                  <div className="flex h-[200px] items-center justify-center">
                    <ProductImage
                      src={firstImage}
                      alt={product.name}
                      width={180}
                      height={180}
                      className="h-full w-full object-contain hover:scale-105 transition-transform"
                      fallbackText={product.name ? product.name.charAt(0) : 'P'}
                    />
                  </div>
                </Link>

                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add To Cart
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium hover:text-red-500 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-red-500">
                    {formatRupiah(discountPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatRupiah(product.price)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "fill-yellow-400" : "fill-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">(88)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button className="bg-red-500 text-white hover:bg-red-600 px-8">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  )
}