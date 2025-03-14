import Link from "next/link"
import { ChevronRight } from "lucide-react"

const categories = [
  "Women's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Lifestyle",
  "Medicine",
  "Sports & Outdoor",
  "Baby's & Toys",
  "Groceries & Pets",
  "Health & Beauty",
]

export default function SidebarCategories() {
  return (
    <div className="h-full py-2">
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category}>
            <Link href="#" className="flex items-center justify-between py-1 text-sm hover:text-primary">
              <span>{category}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

