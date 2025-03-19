"use client"

import { useState } from "react"
import Image from "next/image"

const productImages = [
  "/placeholder.svg?height=500&width=500",
  "/placeholder.svg?height=500&width=500",
  "/placeholder.svg?height=500&width=500",
  "/placeholder.svg?height=500&width=500",
]

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-4">
        {productImages.map((image, index) => (
          <button
            key={index}
            className={`relative h-20 w-20 overflow-hidden rounded-md border ${
              selectedImage === index ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </button>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-md bg-gray-100">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center p-8 text-center text-muted-foreground">
            <p>Image not available</p>
          </div>
        ) : (
          <Image
            src={productImages[selectedImage] || "/placeholder.svg"}
            alt="Product image"
            width={500}
            height={500}
            className="h-auto w-full object-contain"
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  )
}

