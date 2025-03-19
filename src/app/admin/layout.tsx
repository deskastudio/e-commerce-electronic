import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  // In a real application, you would check for admin authentication here
  // For example:
  // const session = await getServerSession(authOptions)
  // if (!session || session.user.role !== "admin") {
  //   redirect("/login")
  // }

  // For demo purposes, we'll just render the admin layout
  // In a real app, you would implement proper authentication

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

