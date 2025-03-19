"use client"

import Image from "next/image"
import Link from "next/link"
import { Twitter, Instagram, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const team = [
  {
    id: 1,
    name: "Tom Cruise",
    position: "Founder & Chairman",
    image: "/placeholder.svg?height=400&width=300",
    social: {
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    id: 2,
    name: "Emma Watson",
    position: "Managing Director",
    image: "/placeholder.svg?height=400&width=300",
    social: {
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    id: 3,
    name: "Will Smith",
    position: "Product Designer",
    image: "/placeholder.svg?height=400&width=300",
    social: {
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
]

export default function Team() {
  return (
    <div className="mb-16">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {team.map((member) => (
            <CarouselItem key={member.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="border-none shadow-none">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                    <div className="mt-2 flex justify-center space-x-4">
                      <Link href={member.social.twitter} className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-4 w-4" />
                      </Link>
                      <Link href={member.social.instagram} className="text-muted-foreground hover:text-foreground">
                        <Instagram className="h-4 w-4" />
                      </Link>
                      <Link href={member.social.linkedin} className="text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

