import { Users, ShoppingBag, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    id: 1,
    icon: <Users className="h-6 w-6" />,
    value: "10.5k",
    label: "Sellers active our site",
  },
  {
    id: 2,
    icon: <ShoppingBag className="h-6 w-6" />,
    value: "33k",
    label: "Monthly Products Sale",
  },
  {
    id: 3,
    icon: <Users className="h-6 w-6" />,
    value: "45.5k",
    label: "Customer active in our site",
  },
  {
    id: 4,
    icon: <Wallet className="h-6 w-6" />,
    value: "25k",
    label: "Annual gross sale in our site",
  },
]

export default function Stats() {
  return (
    <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.id} className="border-none bg-background shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">{stat.icon}</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

