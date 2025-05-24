// app/admin/categories/page.tsx - Categories Management
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteCategoryButton from "@/components/admin/categories/delete-category-button";

// Updated imports with new structure
import { CategoryService, ProductService } from "@/lib/database/services";
import { Category } from "@/types";

export const metadata = {
  title: "Manajemen Kategori | Admin Panel",
  description: "Kelola kategori produk"
};

export default async function CategoriesPage() {
  try {
    // Get categories with product count
    const [categoriesWithCount, productStats] = await Promise.all([
      CategoryService.getCategoriesWithProductCount(),
      ProductService.getProductStats()
    ]);

    const totalCategories = categoriesWithCount.length;
    const activeCategories = categoriesWithCount.filter(cat => cat.isActive).length;
    const categoriesWithProducts = categoriesWithCount.filter(cat => cat.productCount > 0).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kategori</h1>
            <p className="text-muted-foreground">
              Kelola kategori untuk mengorganisir produk Anda
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Kategori
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                {activeCategories} aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kategori Aktif
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCategories}</div>
              <p className="text-xs text-muted-foreground">
                dari {totalCategories} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kategori Berisi
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesWithProducts}</div>
              <p className="text-xs text-muted-foreground">
                memiliki produk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produk
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productStats.active}</div>
              <p className="text-xs text-muted-foreground">
                produk aktif
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
            <CardDescription>
              Kelola semua kategori produk Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-center">Jumlah Produk</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesWithCount.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Belum ada kategori. Tambah kategori pertama Anda.
                          </p>
                          <Button asChild size="sm">
                            <Link href="/admin/categories/new">
                              <Plus className="mr-2 h-4 w-4" />
                              Tambah Kategori
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    categoriesWithCount.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {category.imageUrl ? (
                              <Image
                                src={category.imageUrl}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <Link 
                                href={`/admin/categories/${category.id}`}
                                className="font-medium hover:underline"
                              >
                                {category.name}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate">
                            {category.description || "-"}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-medium">{category.productCount}</span>
                            {category.productCount > 0 && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/products?category=${category.slug}`}>
                                  <Eye className="h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              category.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {category.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/categories/${category.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <DeleteCategoryButton 
                              id={category.id} 
                              name={category.name}
                              productCount={category.productCount}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Kategori</h1>
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">
              Gagal memuat data kategori. Silakan coba lagi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}