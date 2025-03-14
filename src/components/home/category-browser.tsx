import Link from "next/link"
import { ChevronLeft, ChevronRight, Smartphone, Monitor, Watch, Camera, Headphones, Gamepad } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Category {
  id: number
  name: string
  icon: React.ReactNode
  href: string
}

const categories: Category[] = [
  {
    id: 1,
    name: "Phones",
    icon: <Smartphone className="h-6 w-6" />,
    href: "#",
  },
  {
    id: 2,
    name: "Computers",
    icon: <Monitor className="h-6 w-6" />,
    href: "#",
  },
  {
    id: 3,
    name: "SmartWatch",
    icon: <Watch className="h-6 w-6" />,
    href: "#",
  },
  {
    id: 4,
    name: "Camera",
    icon: <Camera className="h-6 w-6 text-white" />,
    href: "#",
  },
  {
    id: 5,
    name: "HeadPhones",
    icon: <Headphones className="h-6 w-6" />,
    href: "#",
  },
  {
    id: 6,
    name: "Gaming",
    icon: <Gamepad className="h-6 w-6" />,
    href: "#",
  },
]

export default function CategoryBrowser() {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-5 bg-primary" />
          <h2 className="text-xl font-semibold">Categories</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <h2 className="mb-6 text-2xl font-bold">Browse By Category</h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={`flex flex-col items-center justify-center rounded-md border p-6 transition-colors hover:border-primary ${
              category.id === 4 ? "bg-primary" : ""
            }`}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              {category.icon}
            </div>
            <span className={`text-sm font-medium ${category.id === 4 ? "text-white" : ""}`}>
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
