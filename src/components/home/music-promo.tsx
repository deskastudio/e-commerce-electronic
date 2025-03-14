import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MusicPromo() {
  return (
    <section className="my-10 overflow-hidden rounded-lg bg-black text-white">
      <div className="flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center md:p-12">
        <div className="space-y-4">
          <h3 className="text-sm font-medium uppercase text-green-500">Categories</h3>
          <h2 className="text-3xl font-bold md:text-4xl">
            Enhance Your <br />
            Music Experience
          </h2>
          <div className="flex space-x-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <span className="h-2 w-2 rounded-full bg-black"></span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button asChild className="bg-green-500 text-white hover:bg-green-600">
            <Link href="#">Buy Now!</Link>
          </Button>
        </div>
        <div className="relative h-[200px] w-[200px] md:h-[250px] md:w-[250px]">
          <div className="absolute inset-0 rounded-full bg-gray-800"></div>
          <div className="absolute inset-4 rounded-full bg-gray-700"></div>
          <div className="absolute inset-8 rounded-full bg-gray-600"></div>
          <div className="absolute inset-12 rounded-full bg-gray-500"></div>
        </div>
      </div>
    </section>
  )
}

