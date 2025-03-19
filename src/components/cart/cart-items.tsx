"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const initialCartItems = [
  {
    id: 1,
    name: "LCD Monitor",
    image: "/placeholder.svg?height=80&width=80",
    price: 550,
    quantity: 1,
  },
  {
    id: 2,
    name: "H1 Gamepad",
    image: "/placeholder.svg?height=80&width=80",
    price: 550,
    quantity: 2,
  },
]

export default function CartItems() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="w-[20%]">Price</TableHead>
              <TableHead className="w-[20%]">Quantity</TableHead>
              <TableHead className="w-[20%] text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <div className="flex w-24 items-center">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 bg-gray-50"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value)
                        if (!isNaN(val)) {
                          updateQuantity(item.id, val)
                        }
                      }}
                      className="h-8 w-8 border text-center"
                    />
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 bg-gray-50"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-right">${item.price * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/">Return To Shop</Link>
        </Button>
        <Button variant="outline">Update Cart</Button>
      </div>
    </div>
  )
}

