import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Arrival {
  id: number
  title: string
  description: string
  image: string
  link: string
}

const newArrivals: Arrival[] = [
  {
    id: 1,
    title: "PlayStation 5",
    description: "Black and White version of the PS5 coming out on sale.",
    image: "/placeholder.svg?height=400&width=300",
    link: "#",
  },
  {
    id: 2,
    title: "Women's Collections",
    description: "Featured woman collections that give you another vibe.",
    image: "/placeholder.svg?height=200&width=300",
    link: "#",
  },
  {
    id: 3,
    title: "Speakers",
    description: "Amazon wireless speakers for crisp sound quality.",
    image: "/placeholder.svg?height=150&width=200",
    link: "#",
  },
  {
    id: 4,
    title: "Perfume",
    description: "GUCCI INTENSE OUD EDP for unisex fragrances.",
    image: "/placeholder.svg?height=150&width=200",
    link: "#",
  },
]

export default function NewArrivals() {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-10 w-5 bg-primary" />
        <h2 className="text-xl font-semibold">Featured</h2>
      </div>

      <h2 className="mb-8 text-2xl font-bold">New Arrival</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative col-span-1 row-span-2 overflow-hidden rounded-lg bg-gray-100 lg:col-span-2 lg:row-span-2">
          <div className="absolute inset-0">
            <Image
              src={newArrivals[0].image || "/placeholder.svg"}
              alt={newArrivals[0].title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">{newArrivals[0].title}</h3>
            <p className="mb-4 text-sm text-white/80">{newArrivals[0].description}</p>
            <Button asChild variant="link" className="group p-0 text-white">
              <Link href={newArrivals[0].link} className="flex items-center">
                Shop Now
                <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative col-span-1 overflow-hidden rounded-lg bg-gray-100 lg:col-span-2">
          <div className="absolute inset-0">
            <Image
              src={newArrivals[1].image || "/placeholder.svg"}
              alt={newArrivals[1].title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">{newArrivals[1].title}</h3>
            <p className="mb-4 text-sm text-white/80">{newArrivals[1].description}</p>
            <Button asChild variant="link" className="group p-0 text-white">
              <Link href={newArrivals[1].link} className="flex items-center">
                Shop Now
                <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative col-span-1 overflow-hidden rounded-lg bg-gray-100">
          <div className="absolute inset-0">
            <Image
              src={newArrivals[2].image || "/placeholder.svg"}
              alt={newArrivals[2].title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">{newArrivals[2].title}</h3>
            <p className="mb-4 text-sm text-white/80">{newArrivals[2].description}</p>
            <Button asChild variant="link" className="group p-0 text-white">
              <Link href={newArrivals[2].link} className="flex items-center">
                Shop Now
                <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative col-span-1 overflow-hidden rounded-lg bg-gray-100">
          <div className="absolute inset-0">
            <Image
              src={newArrivals[3].image || "/placeholder.svg"}
              alt={newArrivals[3].title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">{newArrivals[3].title}</h3>
            <p className="mb-4 text-sm text-white/80">{newArrivals[3].description}</p>
            <Button asChild variant="link" className="group p-0 text-white">
              <Link href={newArrivals[3].link} className="flex items-center">
                Shop Now
                <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

