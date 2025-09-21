// src/components/product/products-pagination.tsx
"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductsPaginationProps {
  currentPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
  totalPages?: number;
}

export default function ProductPagination({ 
  currentPage, 
  searchParams, 
  totalPages = 10 
}: ProductsPaginationProps) {
  const router = useRouter();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams();
    
    // Preserve all existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        if (Array.isArray(value)) {
          params.set(key, value[0]);
        } else {
          params.set(key, value);
        }
      }
    });
    
    params.set('page', pageNumber.toString());
    return `/products?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) end = 4;
      if (currentPage >= totalPages - 1) start = totalPages - 3;

      if (start > 2) pageNumbers.push(-1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) pageNumbers.push(-2);
      if (totalPages > 1) pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber < 0) {
          return <span key={`ellipsis-${index}`} className="px-2">...</span>;
        }

        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() => router.push(createPageURL(pageNumber))}
            className={currentPage === pageNumber ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}