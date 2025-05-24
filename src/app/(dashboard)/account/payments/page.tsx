"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash2, CreditCard } from "lucide-react"

interface PaymentMethod {
  id: number
  cardNumber: string
  cardHolder: string
  expiryDate: string
  isDefault: boolean
}

export default function PaymentPage() {
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      cardNumber: "**** **** **** 4242",
      cardHolder: "Md Rimel",
      expiryDate: "09/25",
      isDefault: true,
    },
    {
      id: 2,
      cardNumber: "**** **** **** 5678",
      cardHolder: "Md Rimel",
      expiryDate: "12/24",
      isDefault: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">My Payment Options</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-red-500 hover:bg-red-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="**** **** **** ****" className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input id="cardHolder" className="bg-gray-50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" placeholder="MM/YY" className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" type="password" maxLength={4} className="bg-gray-50" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-500 hover:bg-red-600">
                  Save Payment Method
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-md">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{method.cardNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1">{method.cardHolder}</p>
                    <p className="text-sm text-gray-600">Expires: {method.expiryDate}</p>
                    {method.isDefault && (
                      <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Default Payment Method
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
