// components/admin/admin-layout.tsx - Admin Layout dengan Sidebar Toggle
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
  BarChart3,
  FileText,
  Warehouse,
  Percent,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Produk",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Kategori",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    name: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Pelanggan",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Inventori",
    href: "/admin/inventory",
    icon: Warehouse,
  },
  {
    name: "Kupon",
    href: "/admin/coupons",
    icon: Percent,
  },
  {
    name: "Laporan",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar({ 
  className, 
  isCollapsed = false 
}: { 
  className?: string;
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo */}
        <div className={`flex h-14 items-center border-b px-4 lg:h-[60px] transition-all duration-300 ${
          isCollapsed ? "lg:px-2" : "lg:px-6"
        }`}>
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6 flex-shrink-0" />
            {!isCollapsed && <span>Admin Panel</span>}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <nav className={`grid items-start text-sm font-medium transition-all duration-300 ${
            isCollapsed ? "px-2" : "px-2 lg:px-4"
          }`}>
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary group relative ${
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                  
                  {/* Tooltip untuk collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border shadow-md">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className={`mt-auto p-4 transition-all duration-300 ${
          isCollapsed ? "px-2" : ""
        }`}>
          <div className={`flex items-center gap-2 text-xs text-muted-foreground ${
            isCollapsed ? "justify-center" : ""
          }`}>
            <FileText className="h-3 w-3 flex-shrink-0" />
            {!isCollapsed && <span>Admin Panel v1.0</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`grid min-h-screen w-full transition-all duration-300 ${
      sidebarCollapsed 
        ? "md:grid-cols-[60px_1fr] lg:grid-cols-[60px_1fr]" 
        : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
    }`}>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block relative">
        <AdminSidebar isCollapsed={sidebarCollapsed} />
        
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-background border shadow-md hover:shadow-lg z-10"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Mobile Layout & Main Content */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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

        {/* Desktop Header dengan Toggle (Opsional) */}
        <header className="hidden md:flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
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