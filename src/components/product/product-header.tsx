// src/components/product/products-header.tsx
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductsHeaderProps {
  initialSearch?: string;
  currentSort?: string;
}

export default function ProductHeader({ 
  initialSearch = '', 
  currentSort = 'newest' 
}: ProductsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    
    params.set('page', '1'); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Produk Elektronik</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex w-full max-w-md items-center space-x-2">
          <Input
            type="search"
            placeholder="Cari produk, brand, atau model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Sort & Filter Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          {initialSearch && (
            <span>Hasil pencarian untuk {initialSearch}</span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Urutkan:</span>
          <Select value={currentSort} onValueChange={handleSort}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
              <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
              <SelectItem value="name-asc">Nama: A-Z</SelectItem>
              <SelectItem value="name-desc">Nama: Z-A</SelectItem>
              <SelectItem value="stock-high">Stok Terbanyak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}