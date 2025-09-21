// app/checkout/page.tsx
import BillingForm from "@/components/checkout/billing-form"
import OrderSummary from "@/components/checkout/order-summary"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap space-x-2 text-sm text-muted-foreground">
            <a href="/account" className="hover:text-foreground">
              Account
            </a>
            <span>/</span>
            <a href="/account" className="hover:text-foreground">
              My Account
            </a>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">
              Product
            </Link>
            <span>/</span>
            <a href="/cart" className="hover:text-foreground">
              View Cart
            </a>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </nav>

          {/* Main Checkout Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Billing Form - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <BillingForm />
            </div>
            
            {/* Order Summary - Takes 1/3 of the space */}
            <div>
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}