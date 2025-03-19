"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductsPaginationProps {
  currentPage: number
  totalPages: number
}

export default function ProductsPagination({ currentPage, totalPages }: ProductsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    // Create a new URLSearchParams object to preserve all existing parameters
    const params = new URLSearchParams(searchParams.toString())

    // Update the page parameter
    params.set("page", pageNumber.toString())

    return `/products?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push(-1) // -1 represents ellipsis
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push(-2) // -2 represents ellipsis
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-8 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(createPageURL(currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {getPageNumbers().map((pageNumber, index) => {
          // Render ellipsis
          if (pageNumber < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            )
          }

          // Render page number
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => router.push(createPageURL(pageNumber))}
              className={currentPage === pageNumber ? "bg-primary text-primary-foreground" : ""}
            >
              {pageNumber}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(createPageURL(currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}

