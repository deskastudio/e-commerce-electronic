// app/admin/products/page.tsx - Updated with new structure
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Edit, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteProductButton from "@/components/admin/products/delete-product-button";
import ProductSearch from "@/components/admin/products/product-search";
import ProductFilter from "@/components/admin/products/product-filter";

// Updated imports with new structure
import { ProductService, CategoryService } from "@/lib/database/services";
import { ProductSearchParams } from "@/types";

interface ProductsPageProps {
  searchParams: ProductSearchParams;
}

export default async function AdminProducts({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  
  try {
    // Get products with new service layer
    const result = await ProductService.getProductsPaginated(page, limit, searchParams);
    const { products, total, totalPages } = result;
    
    // Get categories with new service layer
    const categories = await CategoryService.getCategoriesForSelect();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Produk</h1>
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada produk ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">#{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="font-medium">
                          <Link href={`/admin/products/${product.id}`} className="hover:underline">
                            {product.name}
                          </Link>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground line-through">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          <span>Rp {product.discountPrice.toLocaleString('id-ID')}</span>
                        </div>
                      ) : (
                        <span>Rp {product.price.toLocaleString('id-ID')}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          product.stock > 10 ? "bg-green-500" : 
                          product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                        }`}></span>
                        <span>{product.stock}</span>
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
                        <Button variant="outline" size="icon" asChild>
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
                  <Link href={`/admin/products?page=${page - 1}`}>
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

              {[...Array(totalPages)].map((_, i) => (
                <Button 
                  key={i} 
                  variant={page === i + 1 ? "default" : "outline"} 
                  size="sm" 
                  className="h-8 w-8"
                  asChild={page !== i + 1}
                >
                  {page !== i + 1 ? (
                    <Link href={`/admin/products?page=${i + 1}`}>
                      {i + 1}
                    </Link>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                asChild={page !== totalPages}
              >
                {page !== totalPages ? (
                  <Link href={`/admin/products?page=${page + 1}`}>
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
    console.error('Error loading products:', error);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Produk</h1>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>
        
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">
            Gagal memuat data produk. Silakan coba lagi.
          </p>
        </div>
      </div>
    );
  }
}