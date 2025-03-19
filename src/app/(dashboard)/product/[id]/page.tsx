import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import ProductGallery from "@/components/product/product-gallery"
import ProductInfo from "@/components/product/product-info"
import RelatedProducts from "@/components/product/related-products"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProductPage({ params }: { params: { id: string } }) {
  // Validate the ID parameter
  const productId = Number.parseInt(params.id)

  // In a real app, you would fetch product data based on the ID
  // For this example, we'll use hardcoded data and validate the ID

  // Check if the ID is valid
  if (isNaN(productId) || productId < 1) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="mb-4 text-3xl font-bold">Product Not Found</h1>
              <p className="mb-8 text-muted-foreground">
                The product youre looking for doesnt exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <nav className="mb-8 flex flex-wrap space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <a href="/products" className="hover:text-foreground">
              Products
            </a>
            <span>/</span>
            <a href="/products?category=gaming" className="hover:text-foreground">
              Gaming
            </a>
            <span>/</span>
            <span className="text-foreground">Havic HV G-92 Gamepad</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2">
            <ProductGallery />
            <ProductInfo productId={productId} />
          </div>

          <div className="mt-16">
            <RelatedProducts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

