// src/app/page.tsx - Homepage Updated
import HeroSection from "@/components/home/hero-section";
import FlashSales from "@/components/home/flash-sales";
import CategoryBrowser from "@/components/home/category-browser";
import BestSelling from "@/components/home/best-selling";
import MusicPromo from "@/components/home/music-promo";
import ExploreProducts from "@/components/home/explore-product";
import NewArrivals from "@/components/home/new-arrival";
import Features from "@/components/home/features";

// Import services untuk data real
import { ProductService } from "@/lib/database/services/product-service";
import { CategoryService } from "@/lib/database/services/category-service";
import { Product } from "@/types/product";
import Link from "next/link";

export const metadata = {
  title: "Electronic Commerce - Toko Elektronik Online Terpercaya",
  description: "Belanja produk elektronik berkualitas dengan harga terbaik. Smartphone, laptop, accessories, dan lainnya."
};

export default async function HomePage() {
  let flashSaleProducts: Product[] = [];
  let bestSellingProducts: Product[] = [];
  let exploreProducts: Product[] = [];
  let categories: unknown[] = [];
  let hasError = false;
  let errorMessage = '';

  try {
    const [flashResult, bestResult, exploreResult, categoriesResult] = await Promise.all([
      ProductService.getProductsPaginated(1, 4, { status: 'active' }).catch(() => {
        return { products: [], total: 0 };
      }),
      ProductService.getProductsPaginated(1, 4, { status: 'active' }).catch(() => {
        return { products: [], total: 0 };
      }),
      ProductService.getProductsPaginated(1, 8, { status: 'active' }).catch(() => {
        return { products: [], total: 0 };
      }),
      CategoryService.getCategoriesForSelect().catch(() => {
        return [];
      })
    ]);

    flashSaleProducts = flashResult.products || [];
    bestSellingProducts = bestResult.products || [];
    exploreProducts = exploreResult.products || [];
    categories = categoriesResult || [];

  } catch (error) {
    hasError = true;
    errorMessage = (error as Error).message;
  }

  // Jika ada error, tampilkan fallback UI
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Selamat Datang di Electronic Commerce
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
          </p>
          <div className="space-y-2 text-sm text-red-600 mb-4">
            <p>Error: {errorMessage}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section dengan Sidebar */}
      <HeroSection />

      {/* Debug Info - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 p-4 m-4 rounded">
          <h3 className="font-bold text-blue-800">🔍 Homepage Debug Info:</h3>
          <div className="text-sm text-blue-700 grid grid-cols-2 gap-2">
            <div>📍 Route: / (homepage)</div>
            <div>🛍️ Flash Sale: {flashSaleProducts.length} products</div>
            <div>🏆 Best Selling: {bestSellingProducts.length} products</div>
            <div>🔍 Explore: {exploreProducts.length} products</div>
            <div>📂 Categories: {categories.length} categories</div>
            <div>🖼️ Layout: With Header/Footer</div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        
        {/* Flash Sales Section */}
        {flashSaleProducts.length > 0 && (
          <FlashSales products={flashSaleProducts} />
        )}

        {/* Category Browser */}
        <CategoryBrowser />

        {/* Best Selling Products */}
        {bestSellingProducts.length > 0 && (
          <BestSelling products={bestSellingProducts} />
        )}

        {/* Music Promo Banner */}
        <MusicPromo />

        {/* Explore Our Products - Main Section */}
        <ExploreProducts products={exploreProducts} />

        {/* No Products Fallback */}
        {exploreProducts.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Belum Ada Produk
              </h3>
              <p className="text-red-600 mb-6">
                Saat ini belum ada produk yang tersedia. Silakan tambahkan produk melalui panel admin.
              </p>
              <div className="space-y-3">
                <Link 
                  href="/admin/products/new" 
                  className="inline-block bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
                >
                  Tambah Produk Pertama
                </Link>
                <br />
                <Link
                  href="/admin/products" 
                  className="inline-block text-red-600 hover:text-red-800 text-sm"
                >
                  Kelola Produk di Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* New Arrivals */}
        <NewArrivals />

        {/* Features Section */}
        <Features />

      </div>
    </>
  );
}