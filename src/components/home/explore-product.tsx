// src/components/explore-product.tsx - Dengan Debug
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProductImage from "@/components/admin/products/product-image"
import { getFirstValidImage } from "@/lib/utils/image-helpers"
import { Product } from "@/types/product"

interface ExploreProductsProps {
  products?: Product[];
}

export default function ExploreProducts({ products = [] }: ExploreProductsProps) {
  console.log('🔍 ExploreProducts component received products:', products.length);
  
  // Format price to Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get condition badge
  const getConditionBadge = (condition: string) => {
    if (condition === 'new') {
      return <Badge className="bg-green-100 text-green-800 text-xs">NEW</Badge>;
    }
    return null;
  };

  // Generate stable review count based on product ID
  const getReviewCount = (productId: string): number => {
    const idNum = parseInt(productId.slice(-2), 16) || 1;
    return 50 + (idNum % 150);
  };

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-red-500" />
          <h2 className="text-xl font-semibold text-red-500">Our Products</h2>
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

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>Debug:</strong> Received {products.length} products
          {products.length > 0 && (
            <div className="mt-2">
              <strong>First product:</strong> {products[0].name} - {formatRupiah(products[0].price)}
            </div>
          )}
        </div>
      )}

      {products.length === 0 ? (
        // Show placeholder when no products
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              There are currently no products available to display.
            </p>
            <Link href="/admin/products">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Add Products in Admin
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product, index) => {
              const firstImage = getFirstValidImage(product.images);
              const reviewCount = getReviewCount(product.id);
              
              console.log(`🖼️ Product ${index + 1} (${product.name}) image:`, firstImage);
              
              return (
                <Card key={product.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative bg-gray-100 p-4">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 space-y-1">
                      {getConditionBadge(product.condition)}
                    </div>
                    
                    {/* Action Buttons */}
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
                            className={`h-4 w-4 ${i < 4 ? "fill-yellow-400" : "fill-gray-300"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({reviewCount})
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">{product.brand}</span>
                      {product.model && <span className="ml-1">{product.model}</span>}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full group-hover:bg-black group-hover:text-white transition-colors">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="mt-8 flex justify-center">
            <Button className="bg-red-500 text-white hover:bg-red-600 px-8">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  )
}