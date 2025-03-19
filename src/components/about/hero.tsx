import Image from "next/image"

export default function AboutHero() {
  return (
    <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Our Story</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Launched in 2015, Exclusive is South Asia premier online shopping marketplace with an active presence in
            Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500
            sellers and 300 brands and serves 3 millions customers across the region.
          </p>
          <p>
            Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse
            assortment in categories ranging from consumer.
          </p>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-pink-400 lg:aspect-auto">
        <Image src="/placeholder.svg?height=600&width=800" alt="Happy shoppers" fill className="object-cover" />
      </div>
    </div>
  )
}

