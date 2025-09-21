// src/components/product/product-filter.tsx - UPDATED with Real Data
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Loader2 } from 'lucide-react';

interface ProductsFiltersProps {
  currentCategory?: string;
  currentBrand: string[];
  currentCondition?: string;
  currentPriceRange: [number, number];
}

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterData {
  categories: FilterOption[];
  brands: FilterOption[];
  conditions: FilterOption[];
}

export default function ProductFilter({
  currentCategory,
  currentBrand,
  currentCondition,
  currentPriceRange
}: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState<[number, number]>(currentPriceRange);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentBrand);
  const [selectedCondition, setSelectedCondition] = useState<string>(currentCondition || '');
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    brands: [],
    conditions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching filter options from API...');
        const response = await fetch('/api/products/filters');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch filter options');
        }

        if (data.success) {
          setFilterData(data.data);
          console.log('✅ Filter options loaded:', data.data);
        } else {
          throw new Error(data.message || 'Failed to load filter options');
        }
      } catch (err) {
        console.error('❌ Error fetching filter options:', err);
        setError((err as Error).message);
        
        // Fallback to empty arrays if API fails
        setFilterData({
          categories: [],
          brands: [],
          conditions: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId]);
    } else {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','));
    } else {
      params.delete('brand');
    }
    
    // Apply condition filter
    if (selectedCondition) {
      params.set('condition', selectedCondition);
    } else {
      params.delete('condition');
    }
    
    // Apply price filter
    if (priceRange[0] > 0 || priceRange[1] < 10000000) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }
    
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    
    // Keep search and sort
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const navigateToCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', categoryId);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCondition || 
    priceRange[0] > 0 || priceRange[1] < 10000000;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memuat Filter...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm"
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filter Aktif</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Hapus Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedBrands.map(brandId => {
                const brand = filterData.brands.find(b => b.id === brandId);
                return brand ? (
                  <Badge key={brandId} variant="secondary" className="text-xs">
                    {brand.name}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleBrandChange(brandId, false)}
                    />
                  </Badge>
                ) : null;
              })}
              
              {selectedCondition && (
                <Badge variant="secondary" className="text-xs">
                  {filterData.conditions.find(c => c.id === selectedCondition)?.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedCondition('')}
                  />
                </Badge>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                <Badge variant="secondary" className="text-xs">
                  Rp {priceRange[0].toLocaleString()} - Rp {priceRange[1].toLocaleString()}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setPriceRange([0, 10000000])}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {filterData.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Kategori
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filterData.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigateToCategory(category.id)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-sm transition-colors ${
                  currentCategory === category.id 
                    ? 'bg-red-100 text-red-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-xs text-gray-500">({category.count})</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle>Rentang Harga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={10000000}
            step={100000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>Rp {priceRange[0].toLocaleString()}</span>
            <span>Rp {priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      {filterData.brands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filterData.brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                  />
                  <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({brand.count})</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conditions */}
      {filterData.conditions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kondisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filterData.conditions.map((condition) => (
              <div key={condition.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition.id}`}
                    checked={selectedCondition === condition.id}
                    onCheckedChange={(checked) => 
                      setSelectedCondition(checked ? condition.id : '')
                    }
                  />
                  <label htmlFor={`condition-${condition.id}`} className="text-sm cursor-pointer">
                    {condition.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({condition.count})</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Apply Filters Button */}
      <Button 
        onClick={applyFilters}
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={!hasActiveFilters}
      >
        Terapkan Filter
      </Button>
    </div>
  );
}