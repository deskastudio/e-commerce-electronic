// src/components/best-selling.tsx - Updated untuk menggunakan data real
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductImage from "@/components/admin/products/product-image"
import { getFirstValidImage } from "@/lib/utils/image-helpers"
import { Product } from "@/types/product"

interface BestSellingProps {
  products?: Product[];
}

export default function BestSelling({ products = [] }: BestSellingProps) {
  // Format price to Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-red-500" />
          <h2 className="text-xl font-semibold text-red-500">This Month</h2>
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
        <Button variant="outline" asChild>
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => {
          const firstImage = getFirstValidImage(product.images);
          
          return (
            <Card key={product.id} className="group overflow-hidden border-none shadow-none">
              <div className="relative bg-gray-100 p-4">
                <div className="absolute right-4 top-4 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Link href={`/product/${product.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <Link href={`/product/${product.id}`}>
                  <div className="flex h-[200px] items-center justify-center">
                    <ProductImage
                      src={firstImage}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="h-auto max-h-[150px] w-auto object-contain hover:scale-105 transition-transform"
                      fallbackText={product.name ? product.name.charAt(0) : 'P'}
                    />
                  </div>
                </Link>
              </div>
              
              <CardContent className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium hover:text-red-500 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold text-red-500">
                    {formatRupiah(product.price)}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? "fill-yellow-400" : "fill-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">(65)</span>
                </div>
                
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">{product.brand}</span>
                  {product.model && <span className="ml-1">{product.model}</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  )
}