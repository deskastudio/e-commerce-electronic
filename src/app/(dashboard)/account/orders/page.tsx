"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: string
  date: string
  status: "delivered" | "processing" | "shipped" | "cancelled"
  total: number
  items: {
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }[]
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-12345",
      date: "June 12, 2023",
      status: "delivered",
      total: 1299.98,
      items: [
        {
          id: 1,
          name: "Smartphone X Pro",
          price: 799.99,
          quantity: 1,
          image: "/placeholder.svg",
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          price: 149.99,
          quantity: 1,
          image: "/placeholder.svg",
        },
        {
          id: 3,
          name: "Phone Case",
          price: 24.99,
          quantity: 2,
          image: "/placeholder.svg",
        },
      ],
    },
    {
      id: "ORD-12346",
      date: "July 3, 2023",
      status: "processing",
      total: 2499.99,
      items: [
        {
          id: 4,
          name: "Laptop Pro 16",
          price: 2499.99,
          quantity: 1,
          image: "/placeholder.svg",
        },
      ],
    },
  ])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-600">+{order.items.length - 2} more items</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                      <p className="text-sm">
                        Total: <span className="font-medium">${order.total.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Package className="mr-2 h-4 w-4" />
                        Track Order
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
