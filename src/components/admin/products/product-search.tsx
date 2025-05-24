// components/admin/product-search.tsx - Updated with new structure
"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export default function ProductSearch({ 
  initialQuery = "",
  placeholder = "Cari produk...",
  className = ""
}: ProductSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // State for search input
  const [searchQuery, setSearchQuery] = useState(
    initialQuery || searchParams.get("query") || ""
  );
  
  // Function to create URL with search parameters
  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value.trim()) {
        params.set("query", value.trim());
      } else {
        params.delete("query");
      }
      
      // Reset to first page when search changes
      params.set("page", "1");
      
      return params.toString();
    },
    [searchParams]
  );
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      const queryString = createQueryString(searchQuery);
      router.push(`/admin/products${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    
    startTransition(() => {
      const queryString = createQueryString("");
      router.push(`/admin/products${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Update searchQuery when URL parameter changes (browser back/forward)
  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [searchParams, searchQuery]);
  
  return (
    <form 
      onSubmit={handleSearch} 
      className={`relative w-full max-w-sm flex items-center ${className}`}
    >
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full pl-8 pr-8"
          disabled={isPending}
          autoComplete="off"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
            onClick={handleClearSearch}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Hapus pencarian</span>
          </Button>
        )}
      </div>
      
      <Button 
        type="submit" 
        variant="secondary"
        className="ml-2 flex-shrink-0"
        disabled={isPending}
      >
        {isPending ? "Mencari..." : "Cari"}
      </Button>
      
      {/* Loading indicator */}
      {isPending && (
        <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Mencari produk...</span>
        </div>
      )}
    </form>
  );
}