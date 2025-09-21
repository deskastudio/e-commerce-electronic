"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Search, User, Menu, X, ChevronRight, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CartIcon from "@/components/cart/cart-icon"

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// Helper function to get user initials
function getUserInitials(name?: string | null): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // User Account Section Component
  const UserAccountSection = () => {
    if (isLoading) {
      return (
        <Button variant="ghost" size="icon" disabled className="hidden md:flex">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="sr-only">Loading...</span>
        </Button>
      )
    }

    if (session?.user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden md:flex h-8 gap-2 px-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" alt={session.user.name || ''} />
                <AvatarFallback className="text-xs">
                  {getUserInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate max-w-20">
                {session.user.name || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{session.user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">My Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cart">My Cart</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // Not logged in - show login button
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <User className="h-4 w-4 mr-2" />
          Login
        </Button>
      </Link>
    )
  }

  // Mobile User Section
  const MobileUserSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm">Loading...</span>
        </div>
      )
    }

    if (session?.user) {
      return (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={session.user.name || ''} />
              <AvatarFallback className="text-sm">
                {getUserInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{session.user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <Link href="/account" className="text-sm font-medium hover:text-red-600 transition-colors">
              My Account
            </Link>
            <Link href="/account/orders" className="text-sm font-medium hover:text-red-600 transition-colors">
              My Orders
            </Link>
            <Link href="/cart" className="text-sm font-medium hover:text-red-600 transition-colors">
              My Cart
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      )
    }

    // Not logged in - show login/register
    return (
      <div className="border-t pt-4 mt-4">
        <div className="grid gap-2">
          <Link href="/auth/login" className="text-sm font-medium hover:text-red-600 transition-colors">
            Login
          </Link>
          <Link href="/auth/signup" className="text-sm font-medium hover:text-red-600 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                Exclusive
              </Link>
              
              {/* Mobile Search */}
              <div className="relative">
                <Input
                  type="search"
                  placeholder="What are you looking for?"
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Categories */}
              <div className="grid gap-2 pt-4">
                {[
                  { name: "Women's Fashion", href: "/products?category=womens-fashion" },
                  { name: "Men's Fashion", href: "/products?category=mens-fashion" },
                  { name: "Electronics", href: "/products?category=electronics" },
                  { name: "Home & Lifestyle", href: "/products?category=home-lifestyle" },
                  { name: "Medicine", href: "/products?category=medicine" },
                  { name: "Sports & Outdoor", href: "/products?category=sports-outdoor" },
                  { name: "Baby's & Toys", href: "/products?category=baby-toys" },
                  { name: "Groceries & Pets", href: "/products?category=groceries-pets" },
                  { name: "Health & Beauty", href: "/products?category=health-beauty" },
                ].map((category) => (
                  <Link 
                    key={category.name} 
                    href={category.href} 
                    className="flex items-center justify-between text-sm font-medium hover:text-red-600 transition-colors"
                  >
                    {category.name}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>

              {/* Mobile User Section */}
              <MobileUserSection />
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter">Exclusive</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          {!session && !isLoading && (
            <Link
              href="/auth/signup"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Sign Up
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Desktop Search */}
          <div className={cn("hidden items-center md:flex", isSearchOpen ? "flex-1" : "")}>
            {isSearchOpen ? (
              <div className="relative flex w-full max-w-sm items-center">
                <Input
                  type="search"
                  placeholder="What are you looking for?"
                  className="pr-10 rounded-md border-gray-300"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </div>
            ) : (
              <div className="relative flex items-center">
                <Input
                  type="search"
                  placeholder="What are you looking for?"
                  className="w-64 rounded-md border-gray-300"
                  onFocus={() => setIsSearchOpen(true)}
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <CartIcon 
            size="md" 
            className="text-gray-700 hover:text-red-600 transition-colors" 
          />

          {/* User Account Section */}
          <UserAccountSection />
        </div>
      </div>
    </header>
  )
}