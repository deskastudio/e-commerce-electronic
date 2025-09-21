// src/app/products/page.tsx - FIXED VERSION with Correct Imports
import Link from "next/link";
import ProductHeader from "@/components/product/product-header";
import ProductsGrid from "@/components/product/product-grid";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

export const metadata = {
  title: "Products - Electronic Commerce",
  description: "Browse our wide selection of electronic products"
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log('🛍️ Products page loading with searchParams:', searchParams);

  // Parse parameters
  const page = typeof searchParams.page === "string" ? 
    Math.max(1, parseInt(searchParams.page)) : 1;
  
  const category = typeof searchParams.category === "string" ? 
    searchParams.category : undefined;
  
  const search = typeof searchParams.search === "string" ? 
    searchParams.search : undefined;
  
  const sort = typeof searchParams.sort === "string" ? 
    searchParams.sort : "newest";
  
  const minPrice = typeof searchParams.minPrice === "string" ? 
    parseInt(searchParams.minPrice) : 0;
  
  const maxPrice = typeof searchParams.maxPrice === "string" ? 
    parseInt(searchParams.maxPrice) : 10000000;
  
  const brand = typeof searchParams.brand === "string" ? 
    searchParams.brand.split(",") : undefined;
  
  const condition = typeof searchParams.condition === "string" ? 
    searchParams.condition : undefined;

  console.log('📊 Parsed filters:', {
    page, category, search, sort, minPrice, maxPrice, brand, condition
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Search & Sort */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Breadcrumb */}
          <nav className="mb-6 flex space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Products</span>
            {category && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">
                  {category.replace('-', ' ')}
                </span>
              </>
            )}
          </nav>

          {/* Header dengan Search & Sort */}
          <ProductHeader 
            initialSearch={search}
            currentSort={sort}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilter
              currentCategory={category}
              currentBrand={brand || []}
              currentCondition={condition}
              currentPriceRange={[minPrice, maxPrice]}
            />
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            <ProductsGrid
              page={page}
              category={category}
              search={search}
              sort={sort}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brand={brand}
              condition={condition}
            />
            
            <ProductPagination 
              currentPage={page}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </div>
  );
}