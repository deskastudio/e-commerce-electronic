import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import ProductsHeader from "@/components/products/products-header"
import ProductsGrid from "@/components/products/products-grid"
import ProductsSidebar from "@/components/products/products-sidebar"
import ProductsPagination from "@/components/products/products-pagination"
import Link from "next/link"

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse and validate page parameter
  const page =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page) > 0
        ? Number.parseInt(searchParams.page)
        : 1
      : 1

  // Parse category parameter (can be string or array)
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : Array.isArray(searchParams.category)
        ? searchParams.category[0]
        : undefined

  // Parse search parameter
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined

  // Parse sort parameter
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined

  // Parse price range parameters
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined

  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined

  // Parse brand parameter
  const brand =
    typeof searchParams.brand === "string"
      ? searchParams.brand.split(",")
      : Array.isArray(searchParams.brand)
        ? searchParams.brand
        : undefined

  // Parse rating parameter
  const rating =
    typeof searchParams.rating === "string"
      ? searchParams.rating.split(",").map((r) => Number.parseInt(r))
      : Array.isArray(searchParams.rating)
        ? searchParams.rating.map((r) => Number.parseInt(r as string))
        : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <nav className="mb-8 flex space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Products</span>
            {category && (
              <>
                <span>/</span>
                <span className="text-foreground capitalize">{category}</span>
              </>
            )}
          </nav>

          <ProductsHeader initialSearch={search} />

          <div className="mt-8 grid gap-8 lg:grid-cols-4">
            <ProductsSidebar
              initialCategories={category ? [category] : []}
              initialBrands={brand || []}
              initialRatings={rating || []}
              initialPriceRange={[minPrice || 0, maxPrice || 1000]}
            />
            <div className="lg:col-span-3">
              <ProductsGrid
                page={page}
                category={category}
                search={search}
                sort={sort}
                minPrice={minPrice}
                maxPrice={maxPrice}
                brand={brand}
                rating={rating}
              />
              <ProductsPagination currentPage={page} totalPages={5} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

