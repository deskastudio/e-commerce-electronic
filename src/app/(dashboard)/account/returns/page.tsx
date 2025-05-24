"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Return {
  id: string
  orderId: string
  date: string
  status: "pending" | "approved" | "rejected" | "completed"
  items: {
    id: number
    name: string
    price: number
    quantity: number
    reason: string
    image: string
  }[]
}

export default function ReturnsPage() {
  const [returns] = useState<Return[]>([
    {
      id: "RTN-1001",
      orderId: "ORD-12345",
      date: "June 15, 2023",
      status: "completed",
      items: [
        {
          id: 2,
          name: "Wireless Earbuds",
          price: 149.99,
          quantity: 1,
          reason: "Defective product",
          image: "/placeholder.svg",
        },
      ],
    },
    {
      id: "RTN-1002",
      orderId: "ORD-12346",
      date: "July 10, 2023",
      status: "pending",
      items: [
        {
          id: 4,
          name: "Laptop Pro 16",
          price: 2499.99,
          quantity: 1,
          reason: "Wrong item received",
          image: "/placeholder.svg",
        },
      ],
    },
  ])

  const getStatusColor = (status: Return["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">My Returns</h1>

      {returns.length > 0 ? (
        <div className="space-y-6">
          {returns.map((returnItem) => (
            <Card key={returnItem.id}>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Return #{returnItem.id}</h3>
                      <p className="text-sm text-gray-600">
                        For Order #{returnItem.orderId} • Requested on {returnItem.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(returnItem.status)}>
                        {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                      </Badge>
                      <Link href={`/account/returns/${returnItem.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Items</h4>
                    <div className="space-y-4">
                      {returnItem.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600">Reason: {item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">You have no return requests.</p>
            <Button className="bg-red-500 hover:bg-red-600">Browse Products</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
