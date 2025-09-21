// app/admin/products/page.tsx - Enhanced Product List Page with Fixed Image Handling
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Edit, Plus, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteProductButton from "@/components/admin/products/delete-product-button";
import ProductSearch from "@/components/admin/products/product-search";
import ProductFilter from "@/components/admin/products/product-filter";
import ProductImage from "@/components/admin/products/product-image";

// Fixed imports
import { ProductService } from "@/lib/database/services/product-service";
import { CategoryService } from "@/lib/database/services/category-service";
import { getFirstValidImage } from '@/lib/utils/image-helpers';

interface ProductSearchParams {
  page?: string;
  query?: string;
  category?: string;
  status?: string;
  condition?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minStock?: string;
  maxStock?: string;
  hasWarranty?: string;
}

interface ProductsPageProps {
  searchParams: ProductSearchParams;
}

export const metadata = {
  title: "Produk | Admin Dashboard",
  description: "Kelola semua produk Anda"
};

// Format currency to Indonesian Rupiah
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Get condition text in Indonesian
const getConditionText = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    'new': 'Baru',
    'refurbished': 'Refurbished',
    'used-like-new': 'Bekas Seperti Baru',
    'used-good': 'Bekas Kondisi Baik'
  };
  return conditionMap[condition] || condition;
};

// Get condition badge color
const getConditionBadgeClass = (condition: string): string => {
  const colorMap: Record<string, string> = {
    'new': 'bg-green-100 text-green-800',
    'refurbished': 'bg-blue-100 text-blue-800',
    'used-like-new': 'bg-orange-100 text-orange-800',
    'used-good': 'bg-yellow-100 text-yellow-800'
  };
  return colorMap[condition] || 'bg-gray-100 text-gray-800';
};

// Build URL with preserved params
const buildUrl = (newParams: Record<string, string>, searchParams: ProductSearchParams): string => {
  const params = new URLSearchParams();
  
  // Preserve existing params
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== 'page') {
      params.set(key, value);
    }
  });
  
  // Add new params
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  
  return `/admin/products?${params.toString()}`;
};

// Active filters component
function ActiveFilters({ searchParams }: { searchParams: ProductSearchParams }) {
  const activeFilters = [];
  
  if (searchParams.category && searchParams.category !== "all") {
    activeFilters.push({ key: 'category', label: `Kategori: ${searchParams.category}`, value: searchParams.category });
  }
  
  if (searchParams.status) {
    const statuses = searchParams.status.split(',');
    statuses.forEach(status => {
      const statusLabel = status === 'active' ? 'Aktif' : status === 'draft' ? 'Draft' : 'Arsip';
      activeFilters.push({ key: 'status', label: `Status: ${statusLabel}`, value: status });
    });
  }
  
  if (searchParams.condition) {
    const conditions = searchParams.condition.split(',');
    conditions.forEach(condition => {
      activeFilters.push({ key: 'condition', label: `Kondisi: ${getConditionText(condition)}`, value: condition });
    });
  }
  
  if (searchParams.brand && searchParams.brand !== "all") {
    activeFilters.push({ key: 'brand', label: `Brand: ${searchParams.brand}`, value: searchParams.brand });
  }
  
  if (searchParams.minPrice || searchParams.maxPrice) {
    const min = searchParams.minPrice ? formatRupiah(parseInt(searchParams.minPrice)) : 'Min';
    const max = searchParams.maxPrice ? formatRupiah(parseInt(searchParams.maxPrice)) : 'Max';
    activeFilters.push({ key: 'price', label: `Harga: ${min} - ${max}`, value: 'price' });
  }
  
  if (searchParams.minStock || searchParams.maxStock) {
    const min = searchParams.minStock || '0';
    const max = searchParams.maxStock || '∞';
    activeFilters.push({ key: 'stock', label: `Stok: ${min} - ${max}`, value: 'stock' });
  }
  
  if (searchParams.hasWarranty && searchParams.hasWarranty !== "all") {
    const warrantyLabel = searchParams.hasWarranty === 'true' ? 'Ada Garansi' : 'Tanpa Garansi';
    activeFilters.push({ key: 'hasWarranty', label: warrantyLabel, value: searchParams.hasWarranty });
  }
  
  if (activeFilters.length === 0) return null;
  
  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([paramKey, paramValue]) => {
      if (paramValue && paramKey !== 'page') {
        if (paramKey === key) {
          if (key === 'status' || key === 'condition') {
            // Handle multiple values
            const values = paramValue.split(',').filter(v => v !== value);
            if (values.length > 0) {
              params.set(paramKey, values.join(','));
            }
          } else if (key === 'price') {
            // Remove price filters
            if (paramKey !== 'minPrice' && paramKey !== 'maxPrice') {
              params.set(paramKey, paramValue);
            }
          } else if (key === 'stock') {
            // Remove stock filters
            if (paramKey !== 'minStock' && paramKey !== 'maxStock') {
              params.set(paramKey, paramValue);
            }
          }
          // For other single-value filters, just skip
        } else {
          params.set(paramKey, paramValue);
        }
      }
    });
    
    return `/admin/products?${params.toString()}`;
  };
  
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.query) params.set('query', searchParams.query);
    return `/admin/products?${params.toString()}`;
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Filter aktif:</span>
      {activeFilters.map((filter, index) => (
        <Badge key={`${filter.key}-${filter.value}-${index}`} variant="secondary" className="gap-1">
          {filter.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href={removeFilter(filter.key, filter.value)}>
              <X className="h-3 w-3" />
            </Link>
          </Button>
        </Badge>
      ))}
      <Button variant="outline" size="sm" asChild>
        <Link href={clearAllFilters()}>
          Hapus Semua
        </Link>
      </Button>
    </div>
  );
}

export default async function AdminProducts({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  
  try {
    console.log('🔄 Loading products page...');
    console.log('📥 Search params:', searchParams);
    
    // Get products and categories in parallel
    const [result, categories] = await Promise.all([
      ProductService.getProductsPaginated(page, limit, searchParams),
      CategoryService.getCategoriesForSelect() // Server-side method
    ]);
    
    const { products, total, totalPages } = result;
    
    console.log('✅ Products loaded:', products.length, 'of', total);
    console.log('✅ Categories loaded:', categories.length);
    
    // Check if any filters are active
    const hasActiveFilters = Object.entries(searchParams).some(([key, value]) => 
      value && key !== 'page' && key !== 'query' && 
      !(key === 'category' && value === 'all') && 
      !(key === 'brand' && value === 'all') && 
      !(key === 'hasWarranty' && value === 'all')
    );
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produk</h1>
            <p className="text-muted-foreground">
              Kelola semua produk Anda
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ProductSearch />
          <ProductFilter categories={categories} />
        </div>

        {/* Active Filters */}
        {hasActiveFilters && <ActiveFilters searchParams={searchParams} />}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">SKU</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    {hasActiveFilters || searchParams.query ? (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground">
                          Tidak ada produk yang sesuai dengan filter
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/products">
                              Lihat Semua Produk
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href="/admin/products/new">
                              <Plus className="mr-2 h-4 w-4" />
                              Tambah Produk
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground">
                          Belum ada produk
                        </p>
                        <Button size="sm" asChild>
                          <Link href="/admin/products/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Produk Pertama
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs">
                      <span className="font-medium">{product.sku || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <ProductImage
                            src={getFirstValidImage(product.images)}
                            alt={product.name || 'Product'}
                            width={48}
                            height={48}
                            className="h-full w-full"
                            fallbackText={product.name ? product.name.charAt(0) : 'P'}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link 
                            href={`/admin/products/${product.id}`} 
                            className="font-medium hover:underline block truncate"
                            title={product.name || 'Product'}
                          >
                            {product.name || 'Unnamed Product'}
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{product.brand || 'No Brand'}</div>
                        <div className="text-sm text-muted-foreground">{product.model || 'No Model'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      <span className="font-medium">{product.category.replace('-', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getConditionBadgeClass(product.condition)}
                      >
                        {getConditionText(product.condition)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatRupiah(product.price)}
                      </div>
                      {product.warranty && (
                        <div className="text-xs text-muted-foreground">
                          Garansi: {product.warranty}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          product.stock > 10 ? "bg-green-500" : 
                          product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                        }`}></span>
                        <span className="font-medium">{product.stock}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.stock > 10 ? 'Aman' : 
                         product.stock > 0 ? 'Terbatas' : 'Habis'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status === "active" ? "Aktif" : 
                         product.status === "draft" ? "Draft" : "Arsip"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild title="Lihat Detail">
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Lihat Detail</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild title="Edit Produk">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Statistics */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Produk Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.stock <= 10 && p.stock > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Stok Terbatas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {products.filter(p => p.condition === 'new').length}
              </div>
              <div className="text-sm text-muted-foreground">Produk Baru</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock === 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Stok Habis</div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Menampilkan <strong>{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</strong> dari{" "}
              <strong>{total}</strong> produk
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                asChild={page !== 1}
              >
                {page !== 1 ? (
                  <Link href={buildUrl({ page: (page - 1).toString() }, searchParams)}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Halaman sebelumnya</span>
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Halaman sebelumnya</span>
                  </span>
                )}
              </Button>

              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNumber = page <= 3 ? i + 1 : page - 2 + i;
                if (pageNumber > totalPages) return null;
                
                return (
                  <Button 
                    key={pageNumber} 
                    variant={page === pageNumber ? "default" : "outline"} 
                    size="sm" 
                    className="h-8 w-8"
                    asChild={page !== pageNumber}
                  >
                    {page !== pageNumber ? (
                      <Link href={buildUrl({ page: pageNumber.toString() }, searchParams)}>
                        {pageNumber}
                      </Link>
                    ) : (
                      <span>{pageNumber}</span>
                    )}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                asChild={page !== totalPages}
              >
                {page !== totalPages ? (
                  <Link href={buildUrl({ page: (page + 1).toString() }, searchParams)}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Halaman berikutnya</span>
                  </Link>
                ) : (
                  <span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Halaman berikutnya</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading products page:', error);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produk</h1>
            <p className="text-muted-foreground">
              Kelola semua produk Anda
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>
        
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Gagal memuat data produk
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }
}