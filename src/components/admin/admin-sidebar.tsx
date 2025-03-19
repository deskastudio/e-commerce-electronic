"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, BarChart3, Tags } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold text-primary">Exclusive</span>
          <span className="text-sm text-muted-foreground">Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 ${
                pathname === item.href ? "bg-gray-100 font-medium text-primary" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Link
          href="/admin/logout"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </div>
  )
}

