"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const categories = [
  { id: "gaming", name: "Gaming", count: 35 },
  { id: "accessories", name: "Accessories", count: 42 },
  { id: "monitors", name: "Monitors", count: 28 },
  { id: "components", name: "Components", count: 47 },
  { id: "laptops", name: "Laptops", count: 25 },
  { id: "peripherals", name: "Peripherals", count: 33 },
]

const brands = [
  { id: "havit", name: "Havit", count: 15 },
  { id: "asus", name: "Asus", count: 18 },
  { id: "msi", name: "MSI", count: 12 },
  { id: "logitech", name: "Logitech", count: 22 },
  { id: "razer", name: "Razer", count: 17 },
]

// Update the ProductsSidebar component to handle filters more robustly
interface ProductsSidebarProps {
  initialCategories?: string[]
  initialBrands?: string[]
  initialRatings?: number[]
  initialPriceRange?: [number, number]
}

export default function ProductsSidebar({
  initialCategories = [],
  initialBrands = [],
  initialRatings = [],
  initialPriceRange = [0, 1000],
}: ProductsSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands)
  const [selectedRatings, setSelectedRatings] = useState<number[]>(initialRatings)

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(
      checked ? [...selectedCategories, categoryId] : selectedCategories.filter((id) => id !== categoryId),
    )
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands(checked ? [...selectedBrands, brandId] : selectedBrands.filter((id) => id !== brandId))
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    setSelectedRatings(checked ? [...selectedRatings, rating] : selectedRatings.filter((r) => r !== rating))
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Apply category filter
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    } else {
      params.delete("category")
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","))
    } else {
      params.delete("brand")
    }

    // Apply rating filter
    if (selectedRatings.length > 0) {
      params.set("rating", selectedRatings.join(","))
    } else {
      params.delete("rating")
    }

    // Apply price filter
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // Reset to page 1 when filtering
    params.set("page", "1")

    router.push(`/products?${params.toString()}`)
  }

  const resetFilters = () => {
    setPriceRange([0, 1000])
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedRatings([])

    // Keep only search and sort parameters
    const params = new URLSearchParams()
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")

    if (search) params.set("search", search)
    if (sort) params.set("sort", sort)
    params.set("page", "1")

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["categories", "price", "brands", "rating"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-semibold">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">({category.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="text-lg font-semibold">Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">({brand.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-lg font-semibold">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "fill-yellow-400" : "fill-gray-300"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                    </div>
                    <span className="ml-1">& Up</span>
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full bg-primary text-white">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

