// app/admin/categories/page.tsx - FIXED VERSION dengan Edit & Delete buttons
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Calendar, Edit } from "lucide-react";
import DeleteCategoryButton from "@/components/admin/categories/delete-category-button";
import connectDB from "@/lib/database/connection";
import CategoryModel from "@/lib/database/models/Category";

// Types
interface CategoryWithProductCount {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const metadata = {
  title: "Kategori | Admin Dashboard",
  description: "Kelola kategori produk"
};

async function getCategories(): Promise<CategoryWithProductCount[]> {
  try {
    console.log('🔄 Fetching categories from database...');
    await connectDB();
    
    const categories = await CategoryModel.find()
      .sort({ name: 1 })
      .lean();

    console.log('✅ Found', categories.length, 'categories');

    return categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      productCount: 0, // TODO: Count actual products when Product model is ready
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

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

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              kategori tersedia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori Berisi</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.productCount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              memiliki produk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              produk total
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
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Belum ada kategori</h3>
              <p className="text-muted-foreground mb-4">
                Mulai dengan menambah kategori pertama Anda
              </p>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kategori
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-center">Jumlah Produk</TableHead>
                    <TableHead className="text-center">Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">
                          {category.description || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{category.productCount}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {category.createdAt 
                            ? new Date(category.createdAt).toLocaleDateString('id-ID')
                            : '-'
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <Button 
                            variant="outline" 
                            size="icon" 
                            asChild
                            className="h-8 w-8"
                          >
                            <Link 
                              href={`/admin/categories/${category.id}/edit`}
                              title={`Edit kategori "${category.name}"`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit kategori {category.name}</span>
                            </Link>
                          </Button>
                          
                          {/* Delete Button */}
                          <DeleteCategoryButton 
                            categoryId={category.id} 
                            categoryName={category.name}
                            productCount={category.productCount}
                            variant="icon"
                            size="icon"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-2">
              <p><strong>Categories loaded:</strong> {categories.length}</p>
              <p><strong>First category ID:</strong> {categories[0]?.id || 'None'}</p>
              <div className="mt-2">
                <strong>Categories:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(categories.map(c => ({ id: c.id, name: c.name })), null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}