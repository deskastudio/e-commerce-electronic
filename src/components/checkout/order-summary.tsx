import Image from "next/image"

const orderItems = [
  {
    id: 1,
    name: "LCD Monitor",
    image: "/placeholder.svg?height=80&width=80",
    price: 650,
  },
  {
    id: 2,
    name: "H1 Gamepad",
    image: "/placeholder.svg?height=80&width=80",
    price: 1100,
  },
]

export default function OrderSummary() {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="space-y-6 rounded-md border p-6">
      {orderItems.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex flex-1 justify-between">
            <span className="font-medium">{item.name}</span>
            <span>${item.price}</span>
          </div>
        </div>
      ))}

      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  )
}

