// components/admin/products/product-filter.tsx - Fixed Version
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Filter,
  RotateCcw,
  Package,
  DollarSign,
  Star,
  Archive,
  Tag
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFilterProps {
  categories: Category[];
  brands?: string[];
}

interface FilterState {
  category: string;
  status: string[];
  condition: string[];
  priceRange: [number, number];
  brand: string;
  stockRange: [number, number];
  hasWarranty: boolean | null;
}

const statusOptions = [
  { value: "active", label: "Aktif", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "draft", label: "Draft", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "archived", label: "Arsip", color: "bg-gray-100 text-gray-800 border-gray-200" }
];

const conditionOptions = [
  { value: "new", label: "Baru", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "refurbished", label: "Refurbished", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "used-like-new", label: "Bekas Seperti Baru", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "used-good", label: "Bekas Kondisi Baik", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
];

const pricePresets = [
  { label: "< 1 Juta", min: 0, max: 1000000 },
  { label: "1-5 Juta", min: 1000000, max: 5000000 },
  { label: "5-10 Juta", min: 5000000, max: 10000000 },
  { label: "10-20 Juta", min: 10000000, max: 20000000 },
  { label: "> 20 Juta", min: 20000000, max: 50000000 }
];

export default function ProductFilter({ categories, brands = [] }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "all",
    status: searchParams.get("status")?.split(",").filter(Boolean) || [],
    condition: searchParams.get("condition")?.split(",").filter(Boolean) || [],
    priceRange: [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 50000000
    ],
    brand: searchParams.get("brand") || "all",
    stockRange: [
      Number(searchParams.get("minStock")) || 0,
      Number(searchParams.get("maxStock")) || 1000
    ],
    hasWarranty: searchParams.get("hasWarranty") === "true" ? true : 
                 searchParams.get("hasWarranty") === "false" ? false : null
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        applyFilters();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "all",
      status: searchParams.get("status")?.split(",").filter(Boolean) || [],
      condition: searchParams.get("condition")?.split(",").filter(Boolean) || [],
      priceRange: [
        Number(searchParams.get("minPrice")) || 0,
        Number(searchParams.get("maxPrice")) || 50000000
      ],
      brand: searchParams.get("brand") || "all",
      stockRange: [
        Number(searchParams.get("minStock")) || 0,
        Number(searchParams.get("maxStock")) || 1000
      ],
      hasWarranty: searchParams.get("hasWarranty") === "true" ? true : 
                   searchParams.get("hasWarranty") === "false" ? false : null
    });
  }, [searchParams]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category && filters.category !== "all") count++;
    if (filters.status.length > 0) count++;
    if (filters.condition.length > 0) count++;
    if (filters.brand && filters.brand !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000) count++;
    if (filters.stockRange[0] > 0 || filters.stockRange[1] < 1000) count++;
    if (filters.hasWarranty !== null) count++;
    return count;
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    const query = searchParams.get("query");
    if (query) params.set("query", query);
    
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    if (filters.status.length > 0) params.set("status", filters.status.join(","));
    if (filters.condition.length > 0) params.set("condition", filters.condition.join(","));
    if (filters.brand && filters.brand !== "all") params.set("brand", filters.brand);
    if (filters.priceRange[0] > 0) params.set("minPrice", filters.priceRange[0].toString());
    if (filters.priceRange[1] < 50000000) params.set("maxPrice", filters.priceRange[1].toString());
    if (filters.stockRange[0] > 0) params.set("minStock", filters.stockRange[0].toString());
    if (filters.stockRange[1] < 1000) params.set("maxStock", filters.stockRange[1].toString());
    if (filters.hasWarranty !== null) params.set("hasWarranty", filters.hasWarranty.toString());
    
    params.set("page", "1");
    
    router.push(`/admin/products?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get("query");
    if (query) params.set("query", query);
    params.set("page", "1");
    
    setFilters({
      category: "all",
      status: [],
      condition: [],
      priceRange: [0, 50000000],
      brand: "all",
      stockRange: [0, 1000],
      hasWarranty: null
    });
    
    router.push(`/admin/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }));
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      condition: checked 
        ? [...prev.condition, condition]
        : prev.condition.filter(c => c !== condition)
    }));
  };

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleBrandSelect = (brand: string) => {
    if (brand === "custom") {
      setFilters(prev => ({ ...prev, brand: customBrand || "all" }));
    } else {
      setFilters(prev => ({ ...prev, brand }));
      setCustomBrand("");
    }
  };

  const handlePricePreset = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {getActiveFilterCount() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[450px] flex flex-col h-full">
        <SheetHeader className="pb-4 flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Produk
          </SheetTitle>
          <SheetDescription>
            Gunakan filter untuk menyaring produk sesuai kebutuhan Anda
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 pb-6 pr-4">
            {/* Category Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <Label className="text-sm font-medium">Kategori</Label>
              </div>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Price Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <Label className="text-sm font-medium">Rentang Harga</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {pricePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className={`text-xs h-8 ${
                      filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => handlePricePreset(preset.min, preset.max)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={50000000}
                    step={100000}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                  <span>{formatRupiah(filters.priceRange[0])}</span>
                  <span>{formatRupiah(filters.priceRange[1])}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Minimum</Label>
                    <Input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [Number(e.target.value), prev.priceRange[1]] 
                      }))}
                      className="text-sm h-8"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Maksimum</Label>
                    <Input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [prev.priceRange[0], Number(e.target.value)] 
                      }))}
                      className="text-sm h-8"
                      placeholder="50000000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                <Label className="text-sm font-medium">Status</Label>
              </div>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleStatusChange(option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`status-${option.value}`}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2 flex-1"
                    >
                      <Badge variant="outline" className={`${option.color} text-xs`}>
                        {option.label}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Condition Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <Label className="text-sm font-medium">Kondisi</Label>
              </div>
              <div className="space-y-2">
                {conditionOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={`condition-${option.value}`}
                      checked={filters.condition.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleConditionChange(option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`condition-${option.value}`}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2 flex-1"
                    >
                      <Badge variant="outline" className={`${option.color} text-xs`}>
                        {option.label}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {brands.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <Label className="text-sm font-medium">Brand</Label>
                  </div>
                  <Select
                    value={filters.brand || "all"}
                    onValueChange={handleBrandSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Brand</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Brand Lainnya...</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {filters.brand === customBrand && customBrand && (
                    <Input
                      placeholder="Masukkan nama brand"
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      onBlur={() => handleBrandSelect("custom")}
                      className="text-sm h-8"
                    />
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Stock Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rentang Stok</Label>
              <div className="space-y-3">
                <div className="px-2">
                  <Slider
                    value={filters.stockRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, stockRange: value as [number, number] }))}
                    max={1000}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                  <span>{filters.stockRange[0]} unit</span>
                  <span>{filters.stockRange[1]} unit</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Minimum</Label>
                    <Input
                      type="number"
                      value={filters.stockRange[0]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        stockRange: [Number(e.target.value), prev.stockRange[1]] 
                      }))}
                      className="text-sm h-8"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Maksimum</Label>
                    <Input
                      type="number"
                      value={filters.stockRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        stockRange: [prev.stockRange[0], Number(e.target.value)] 
                      }))}
                      className="text-sm h-8"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Warranty Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Garansi</Label>
              <Select
                value={filters.hasWarranty === null ? "all" : filters.hasWarranty.toString()}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  hasWarranty: value === "all" ? null : value === "true" 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status garansi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="true">Ada Garansi</SelectItem>
                  <SelectItem value="false">Tanpa Garansi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-4" />
          </div>
        </ScrollArea>

        <div className="border-t bg-background pt-4 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={getActiveFilterCount() === 0}
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Filter
              </Button>
              <Button 
                onClick={applyFilters} 
                size="sm"
                className="flex-1"
              >
                Lihat Hasil
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white text-primary">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </div>
            
            {getActiveFilterCount() > 0 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground h-6"
                >
                  Hapus semua filter aktif ({getActiveFilterCount()})
                </Button>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground text-center">
              {getActiveFilterCount() === 0 
                ? "Tidak ada filter yang diterapkan" 
                : `${getActiveFilterCount()} filter aktif`
              }
              <div className="mt-1 text-xs opacity-75">
                Tekan Ctrl+Enter untuk menerapkan filter
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}