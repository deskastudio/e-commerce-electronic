import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function HeroBanner() {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="relative flex h-[400px] w-full flex-col items-start justify-center bg-black p-6 text-white md:h-[500px] md:p-10 lg:h-[600px] lg:p-16">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="iPhone"
                  fill
                  className="object-cover opacity-80"
                  priority
                />
              </div>
              <div className="z-10 max-w-md space-y-4">
                <div className="flex items-center">
                  <div className="mr-2">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Apple"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-sm font-medium">iPhone 15 Series</p>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                  Up to 10% <br /> off Voucher
                </h1>
                <div>
                  <Button asChild variant="link" className="group p-0 text-white">
                    <Link href="#" className="flex items-center">
                      Shop Now
                      <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <span key={index} className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary" : "bg-gray-400"}`} />
          ))}
        </div>
        <CarouselPrevious className="absolute left-4 top-1/2" />
        <CarouselNext className="absolute right-4 top-1/2" />
      </Carousel>
    </div>
  )
}

