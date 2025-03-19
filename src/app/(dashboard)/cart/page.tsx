import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import CartItems from "@/components/cart/cart-items"
import CartSummary from "@/components/cart/cart-summary"
import Link from "next/link"

export default function CartPage() {
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
            <span className="text-foreground">Cart</span>
          </nav>

          <div className="space-y-8">
            <CartItems />

            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div className="flex w-full max-w-md gap-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Apply Coupon
                </button>
              </div>

              <CartSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

