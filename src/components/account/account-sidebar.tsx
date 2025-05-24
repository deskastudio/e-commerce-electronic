"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/database/services/utils"

const AccountSidebar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      title: "Manage My Account",
      items: [
        { name: "My Profile", href: "/account/profile" },
        { name: "Address Book", href: "/account/address" },
        { name: "My Payment Options", href: "/account/payment" },
      ],
    },
    {
      title: "My Orders",
      items: [
        { name: "Order History", href: "/account/orders" },
        { name: "My Returns", href: "/account/returns" },
        { name: "My Cancellations", href: "/account/cancellations" },
      ],
    },
    {
      title: "My Wishlist",
      items: [{ name: "My Wishlist", href: "/account/wishlist" }],
    },
  ]

  return (
    <div className="space-y-6">
      {navItems.map((section) => (
        <div key={section.title} className="space-y-3">
          <h3 className="font-medium text-base">{section.title}</h3>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "block text-sm py-1",
                    isActive(item.href) ? "text-red-500 font-medium" : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default AccountSidebar
