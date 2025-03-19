import type React from "react"
import Link from "next/link"

interface AccountLayoutProps {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <nav className="flex space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/account" className="text-foreground">
            My Account
          </Link>
        </nav>
        <div className="text-sm">
          Welcome! <span className="text-primary">Md Rimel</span>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64">
          <nav className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Manage My Account</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/account" className="block text-primary hover:underline">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/account/address" className="block text-muted-foreground hover:text-foreground">
                    Address Book
                  </Link>
                </li>
                <li>
                  <Link href="/account/payment" className="block text-muted-foreground hover:text-foreground">
                    My Payment Options
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">My Orders</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/account/returns" className="block text-muted-foreground hover:text-foreground">
                    My Returns
                  </Link>
                </li>
                <li>
                  <Link href="/account/cancellations" className="block text-muted-foreground hover:text-foreground">
                    My Cancellations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                <Link href="/account/wishlist" className="text-muted-foreground hover:text-foreground">
                  My Wishlist
                </Link>
              </h3>
            </div>
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

