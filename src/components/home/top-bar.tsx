"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TopBar() {
  return (
    <div className="w-full bg-black py-2 text-xs text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="text-xs">
          <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
          <Button variant="link" className="h-auto p-0 px-1 text-xs font-bold text-white underline">
            ShopNow
          </Button>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="h-auto p-0 px-1 text-xs text-white">
                English <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

