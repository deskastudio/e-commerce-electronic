"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartSummary() {
  // This would typically come from a cart context or API
  const subtotal = 1750
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="w-full max-w-md rounded-md border p-6">
      <h2 className="mb-4 text-lg font-bold">Cart Total</h2>
      <div className="space-y-2">
        <div className="flex justify-between border-b py-2">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span>Shipping:</span>
          <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>
        <div className="flex justify-between py-2 font-bold">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>
      <Button className="mt-4 w-full bg-primary text-primary-foreground" asChild>
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </div>
  )
}

