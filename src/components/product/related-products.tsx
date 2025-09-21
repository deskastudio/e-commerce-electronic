// src/components/product/related-products.tsx - FIXED dengan SimpleProductImage
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SimpleProductImage from '@/components/product/simple-product-image';
import { Product } from '@/types/product';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Filter out current product and limit to 4 products
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 4);

  // Format price to Indonesian Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get first valid image
  const getFirstValidImage = (images: string[]): string => {
    if (!images || images.length === 0) {
      return '/placeholder.svg';
    }
    
    const validImage = images.find(img => img && img.trim() !== '');
    return validImage || '/placeholder.svg';
  };

  // Get condition badge
  const getConditionBadge = (condition: string) => {
    if (condition === 'new') {
      return <Badge className="bg-green-100 text-green-800 text-xs">BARU</Badge>;
    }
    return null;
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Produk Terkait</h2>
        <Link href="/products">
          <Button variant="outline">
            Lihat Semua Produk
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const firstImage = getFirstValidImage(product.images || []);
          
          return (
            <Card key={product.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative bg-gray-100 p-4">
                {/* Condition Badge */}
                <div className="absolute top-2 left-2 z-10">
                  {getConditionBadge(product.condition)}
                </div>

                {/* Action Buttons */}
                <div className="absolute right-2 top-2 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white shadow-sm"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Link href={`/product/${product.id}`}>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Product Image */}
                <Link href={`/product/${product.id}`}>
                  <div className="flex h-[200px] items-center justify-center">
                    <SimpleProductImage
                      src={firstImage}
                      alt={product.name}
                      width={180}
                      height={180}
                      className="h-full w-full object-contain hover:scale-105 transition-transform"
                      fallbackText={product.name ? product.name.charAt(0) : 'P'}
                    />
                  </div>
                </Link>

                {/* Add to Cart on Hover */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <CardContent className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-red-600 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Brand & Model */}
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{product.brand}</span>
                  {product.model && <span className="ml-1">{product.model}</span>}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-lg font-bold text-red-600">
                    {formatRupiah(product.price)}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      product.stock > 10 ? "bg-green-500" : 
                      product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    <span>
                      {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <Link href={`/product/${product.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Rating Placeholder */}
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
                  <span className="ml-2 text-xs text-gray-500">(4.0)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View More Button */}
      <div className="text-center">
        <Link href="/products">
          <Button variant="outline" className="px-8">
            Jelajahi Produk Lainnya
          </Button>
        </Link>
      </div>

      {/* Debug Info - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Related Products Debug (FIXED):</strong> Showing {relatedProducts.length} related products
        </div>
      )}
    </section>
  );
}