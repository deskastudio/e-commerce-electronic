"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("query") || "");

  // Create a URL with the updated search params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      if (searchValue) {
        router.push(`/admin/products?${createQueryString("query", searchValue)}`);
      } else {
        // If search is empty, remove query param
        const params = new URLSearchParams(searchParams.toString());
        params.delete("query");
        router.push(`/admin/products?${params.toString()}`);
      }
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="search"
        placeholder="Cari produk..."
        className="w-full"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        disabled={isPending}
      />
      <Button type="submit" size="icon" disabled={isPending}>
        <Search className="h-4 w-4" />
        <span className="sr-only">Cari</span>
      </Button>
    </form>
  );
}