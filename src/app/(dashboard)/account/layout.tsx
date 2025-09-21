import type React from "react"
import Link from "next/link"
import AccountSidebar from "@/components/account/account-sidebar"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <span>My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-red-500">Md Rimel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  </div>
  )
}
