"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
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
              <div className="grid gap-2 pt-4">
                {[
                  "Women's Fashion",
                  "Men's Fashion",
                  "Electronics",
                  "Home & Lifestyle",
                  "Medicine",
                  "Sports & Outdoor",
                  "Baby's & Toys",
                  "Groceries & Pets",
                  "Health & Beauty",
                ].map((category) => (
                  <Link key={category} href="#" className="flex items-center justify-between text-sm font-medium">
                    {category}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter">Exclusive</span>
        </Link>
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
          <Link
            href="/signup"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Sign Up
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className={cn("hidden items-center md:flex", isSearchOpen ? "flex-1" : "")}>
            {isSearchOpen ? (
              <div className="relative flex w-full max-w-sm items-center">
                <Input
                  type="search"
                  placeholder="What are you looking for?"
                  className="pr-10 rounded-md border-gray-300"
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
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

