// components/cart/cart-icon.tsx
"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/providers/cart-provider"
import { cn } from "@/lib/database/simple.utils"

interface CartIconProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showCount?: boolean
}

export default function CartIcon({ 
  size = "md", 
  className = "",
  showCount = true 
}: CartIconProps) {
  const { cart, isLoading } = useCart()
  
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-4 w-4"
      case "lg":
        return "h-6 w-6"
      default:
        return "h-5 w-5"
    }
  }

  const getBadgeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-4 w-4 text-xs"
      case "lg":
        return "h-6 w-6 text-sm"
      default:
        return "h-5 w-5 text-xs"
    }
  }

  return (
    <Link href="/cart">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("relative", className)}
      >
        <ShoppingCart className={getSizeClasses(size)} />
        
        {showCount && cart.itemCount > 0 && (
          <span 
            className={cn(
              "absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center font-medium",
              getBadgeClasses(size)
            )}
          >
            {cart.itemCount > 99 ? "99+" : cart.itemCount}
          </span>
        )}
        
        {isLoading && (
          <span className="absolute inset-0 bg-background/50 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        
        <span className="sr-only">
          Shopping cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
        </span>
      </Button>
    </Link>
  )
}