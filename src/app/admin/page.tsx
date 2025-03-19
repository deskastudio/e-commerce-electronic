import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Welcome back, Admin</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              +12.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              +4.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {/* In a real app, you would use a chart library here */}
              <div className="flex h-full items-end gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 100) + 20
                  return (
                    <div key={i} className="relative flex-1">
                      <div
                        className="absolute bottom-0 w-full rounded-t bg-primary"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>Latest customer registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "John Doe", email: "john@example.com", date: "2 minutes ago" },
                { name: "Jane Smith", email: "jane@example.com", date: "1 hour ago" },
                { name: "Robert Johnson", email: "robert@example.com", date: "3 hours ago" },
                { name: "Emily Davis", email: "emily@example.com", date: "5 hours ago" },
                { name: "Michael Wilson", email: "michael@example.com", date: "1 day ago" },
              ].map((customer, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{customer.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Products</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#ORD-001",
                    customer: "John Doe",
                    products: 3,
                    date: "Mar 15, 2023",
                    amount: "$125.00",
                    status: "Delivered",
                  },
                  {
                    id: "#ORD-002",
                    customer: "Jane Smith",
                    products: 1,
                    date: "Mar 14, 2023",
                    amount: "$75.00",
                    status: "Processing",
                  },
                  {
                    id: "#ORD-003",
                    customer: "Robert Johnson",
                    products: 2,
                    date: "Mar 13, 2023",
                    amount: "$156.00",
                    status: "Delivered",
                  },
                  {
                    id: "#ORD-004",
                    customer: "Emily Davis",
                    products: 4,
                    date: "Mar 12, 2023",
                    amount: "$253.00",
                    status: "Shipped",
                  },
                  {
                    id: "#ORD-005",
                    customer: "Michael Wilson",
                    products: 2,
                    date: "Mar 11, 2023",
                    amount: "$89.00",
                    status: "Delivered",
                  },
                ].map((order, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{order.products}</td>
                    <td className="px-4 py-3">{order.date}</td>
                    <td className="px-4 py-3">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

