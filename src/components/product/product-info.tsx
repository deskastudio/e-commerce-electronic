"use client"

import { useState } from "react"
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductInfoProps {
  productId?: number
}

export default function ProductInfo({ productId = 1 }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(2)
  const [selectedColor, setSelectedColor] = useState("white")
  const [selectedSize, setSelectedSize] = useState("M")

  // In a real app, you would fetch product data based on the ID
  // For this example, we'll just use the ID in the component

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Havic HV G-92 Gamepad</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="h-4 w-4 fill-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">(150 Reviews)</span>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-600">
            In Stock
          </Badge>
        </div>
      </div>

      <div>
        <span className="text-2xl font-bold">$192.00</span>
      </div>

      <p className="text-muted-foreground">
        PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free removal Pressure
        sensitive. Product ID: {productId}
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-medium">Colours:</h3>
          <div className="flex gap-2">
            <button
              className={`h-6 w-6 rounded-full bg-white ${
                selectedColor === "white" ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
              onClick={() => setSelectedColor("white")}
              aria-label="White color"
            />
            <button
              className={`h-6 w-6 rounded-full bg-red-500 ${
                selectedColor === "red" ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
              onClick={() => setSelectedColor("red")}
              aria-label="Red color"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Size:</h3>
          <div className="flex gap-2">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                  selectedSize === size ? "border-primary bg-primary text-white" : "border-gray-300 bg-white"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-gray-50"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center border">{quantity}</div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 bg-gray-50"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button className="bg-primary text-white">Buy Now</Button>
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-md border p-4">
        <div className="flex items-center gap-4">
          <Truck className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Free Delivery</h3>
            <p className="text-sm text-muted-foreground">Enter your postal code for Delivery Availability</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <RotateCcw className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Return Delivery</h3>
            <p className="text-sm text-muted-foreground">Free 30 Days Delivery Returns. Details</p>
          </div>
        </div>
      </div>
    </div>
  )
}

