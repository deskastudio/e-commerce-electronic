"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFilterProps {
  categories: Array<{ id: string; name: string }>;
}

export default function ProductFilter({ categories }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentCategory = searchParams.get("category") || "all";
  const currentStatus = searchParams.get("status") || "all";
  
  // Create a URL with the updated filter params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      
      // Reset to page 1 when filters change
      params.set("page", "1");
      
      return params.toString();
    },
    [searchParams]
  );
  
  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      router.push(`/admin/products?${createQueryString("category", value)}`);
    });
  };
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    startTransition(() => {
      router.push(`/admin/products?${createQueryString("status", value)}`);
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Filter:</span>
      <Select 
        defaultValue={currentCategory} 
        onValueChange={handleCategoryChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        defaultValue={currentStatus} 
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
    </div>
  );
}