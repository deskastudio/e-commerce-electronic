"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from "embla-carousel-react"

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="relative flex h-[300px] min-w-0 flex-[0_0_100%] flex-col items-start justify-center bg-black p-6 text-white md:h-[400px] md:p-10 lg:h-[400px] lg:p-16">
            <div className="absolute inset-0 z-0">
              <Image
                src="/placeholder.svg?height=400&width=1200"
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
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
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
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full ${index === selectedIndex ? "bg-primary" : "bg-gray-400"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}

