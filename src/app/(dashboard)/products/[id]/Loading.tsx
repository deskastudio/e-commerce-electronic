// src/app/product/[id]/loading.tsx - Loading UI for Product Detail
export default function ProductDetailLoading() {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Skeleton */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
  
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-300 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
  
            {/* Product Info Skeleton */}
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              </div>
  
              {/* Price */}
              <div className="h-10 bg-gray-300 rounded w-1/3 animate-pulse"></div>
  
              {/* Badges */}
              <div className="flex items-center gap-4">
                <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
  
              {/* Details */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/5 animate-pulse"></div>
              </div>
  
              {/* Quantity */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded w-40 animate-pulse"></div>
              </div>
  
              {/* Buttons */}
              <div className="space-y-3">
                <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>
                <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-300 rounded flex-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-300 rounded flex-1 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Description Skeleton */}
          <div className="mb-16 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
            </div>
          </div>
  
          {/* Specifications Skeleton */}
          <div className="mb-16 space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/5 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between py-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Related Products Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
              <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // src/app/product/[id]/not-found.tsx - Product Not Found Page
  import Link from 'next/link';
  import { Button } from '@/components/ui/button';
  import { Home, Search, ArrowLeft } from 'lucide-react';
  
  export default function ProductNotFound() {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          {/* 404 Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-red-500" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Produk Tidak Ditemukan
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Maaf, produk yang Anda cari tidak tersedia atau telah dihapus. 
            Silakan coba produk lain atau kembali ke halaman utama.
          </p>
  
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Jelajahi Semua Produk
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Halaman Sebelumnya
            </Button>
          </div>
  
          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Butuh bantuan? 
              <Link href="/contact" className="text-red-600 hover:text-red-700 ml-1">
                Hubungi customer service kami
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }