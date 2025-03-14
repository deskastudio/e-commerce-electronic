import type React from "react"
import { Truck, HeadphonesIcon, ShieldCheck } from "lucide-react"

interface Feature {
  id: number
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    id: 1,
    icon: <Truck className="h-6 w-6" />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
  },
  {
    id: 2,
    icon: <HeadphonesIcon className="h-6 w-6" />,
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
]

export default function Features() {
  return (
    <section className="mb-16 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-sm font-bold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

