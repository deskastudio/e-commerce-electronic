"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"

interface Address {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export default function AddressPage() {
  const [addresses] = useState<Address[]>([
    {
      id: 1,
      name: "Md Rimel",
      address: "123 Main St",
      city: "Kingston",
      state: "NY",
      zip: "5236",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      name: "Md Rimel",
      address: "456 Second Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11201",
      country: "United States",
      isDefault: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Address Book</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-red-500 hover:bg-red-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" className="bg-gray-50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip/Postal Code</Label>
                  <Input id="zip" className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" className="bg-gray-50" />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-500 hover:bg-red-600">
                  Save Address
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{address.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                  {address.isDefault && (
                    <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Default Address
                    </span>
                  )}
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
