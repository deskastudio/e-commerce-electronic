import TopBar from "@/components/home/top-bar"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import BillingForm from "@/components/checkout/billing-form"
import OrderSummary from "@/components/checkout/order-summary"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <nav className="mb-8 flex flex-wrap space-x-2 text-sm text-muted-foreground">
            <a href="/account" className="hover:text-foreground">
              Account
            </a>
            <span>/</span>
            <a href="/account" className="hover:text-foreground">
              My Account
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-foreground">
              Product
            </a>
            <span>/</span>
            <a href="/cart" className="hover:text-foreground">
              View Cart
            </a>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BillingForm />
            </div>
            <div>
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

