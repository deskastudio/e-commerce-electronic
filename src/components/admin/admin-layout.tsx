// components/admin/admin-layout.tsx - Admin Layout Component
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  Home,
  BarChart3,
  FileText,
  Bell,
  Search
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Produk",
    href: "/admin/products",
    icon: Package,
    current: false,
    badge: "New",
  },
  {
    name: "Kategori",
    href: "/admin/categories",
    icon: Tag,
    current: false,
  },
  {
    name: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingCart,
    current: false,
    disabled: true,
  },
  {
    name: "Pelanggan",
    href: "/admin/customers",
    icon: Users,
    current: false,
    disabled: true,
  },
  {
    name: "Laporan",
    href: "/admin/reports",
    icon: BarChart3,
    current: false,
    disabled: true,
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
    current: false,
    disabled: true,
  },
];

function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  } ${
                    item.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto h-5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.disabled && (
                    <Badge variant="outline" className="ml-auto h-5 text-xs">
                      Soon
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>Admin Panel v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden border-r bg-muted/40 md:block" />

      {/* Mobile Layout */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}