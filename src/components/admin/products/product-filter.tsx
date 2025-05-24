// components/admin/product-filter.tsx - Updated with new structure
"use client";

import { useCallback, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Updated imports with new structure
import { CategorySelectOption } from "@/types";

interface ProductFilterProps {
  categories: CategorySelectOption[];
  initialCategory?: string;
  initialStatus?: string;
}

export default function ProductFilter({ 
  categories,
  initialCategory = "all",
  initialStatus = "all" 
}: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || initialCategory;
  const currentStatus = searchParams.get("status") || initialStatus;
  
  // Create a URL with the updated filter params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value === "all") {
        // If value is "all", remove parameter from URL
        params.delete(name);
      } else {
        params.set(name, value);
      }
      
      // Reset to page 1 when filters change
      params.set("page", "1");
      
      return params.toString();
    },
    [searchParams]
  );
  
  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      const queryString = createQueryString("category", value);
      router.push(`/admin/products${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    startTransition(() => {
      const queryString = createQueryString("status", value);
      router.push(`/admin/products${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  // Ensure UI matches URL parameters when component mounts
  useEffect(() => {
    // This helps when page is reloaded or accessed directly
    // to ensure UI is in sync with URL parameters
  }, [currentCategory, currentStatus]);
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm">Filter:</span>
      
      {/* Category Filter */}
      <Select 
        defaultValue={currentCategory} 
        value={currentCategory}
        onValueChange={handleCategoryChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select 
        defaultValue={currentStatus} 
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="archived">Diarsipkan</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Loading indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Memfilter...</span>
        </div>
      )}
    </div>
  );
}