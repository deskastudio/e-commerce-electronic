import { Truck, HeadphonesIcon, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8" />,
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
]

export default function Features() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">{feature.icon}</div>
          <h3 className="mb-2 text-sm font-bold">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

