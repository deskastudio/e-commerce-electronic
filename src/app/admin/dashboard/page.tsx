// app/admin/dashboard/page.tsx - Admin Dashboard
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Tag, 
  ShoppingCart, 
  AlertCircle, 
  TrendingUp,
  Eye,
  Plus,
  BarChart3
} from "lucide-react";

// Updated imports with new structure
import { ProductService, CategoryService, UploadService } from "@/lib/database/services";

export const metadata = {
  title: "Dashboard | Admin Panel",
  description: "Dashboard admin untuk mengelola toko online"
};

export default async function AdminDashboard() {
  try {
    // Get all statistics in parallel
    const [
      productStats,
      categories,
      lowStockProducts,
      uploadStats
    ] = await Promise.all([
      ProductService.getProductStats(),
      CategoryService.getCategoriesWithProductCount(),
      ProductService.getLowStockProducts(5),
      UploadService.getUploadStats('products')
    ]);

    const activeCategories = categories.filter(cat => cat.isActive).length;
    const categoriesWithProducts = categories.filter(cat => cat.productCount > 0).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang di admin panel. Kelola toko online Anda dengan mudah.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produk
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {productStats.active} aktif, {productStats.draft} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kategori
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeCategories} aktif, {categoriesWithProducts} berisi produk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stok Rendah
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{productStats.lowStock}</div>
              <p className="text-xs text-muted-foreground">
                produk dengan stok ≤ 5
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                File Upload
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadStats.totalFiles}</div>
              <p className="text-xs text-muted-foreground">
                {uploadStats.totalSizeMB} MB total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Stok Rendah
                </CardTitle>
                <CardDescription>
                  Produk yang perlu direstock segera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku || "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={
                            product.stock === 0 
                              ? "bg-red-100 text-red-800" 
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {product.stock === 0 ? "Habis" : `${product.stock} tersisa`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin/products?stock=low">
                        Lihat Semua ({lowStockProducts.length - 5} lagi)
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Kategori Populer
              </CardTitle>
              <CardDescription>
                Kategori dengan produk terbanyak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories
                  .sort((a, b) => b.productCount - a.productCount)
                  .slice(0, 5)
                  .map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <Link 
                          href={`/admin/categories/${category.id}`}
                          className="font-medium hover:underline"
                        >
                          {category.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          /{category.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {category.productCount} produk
                        </Badge>
                        {category.productCount > 0 && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/products?category=${category.slug}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/categories">
                    <Tag className="mr-2 h-4 w-4" />
                    Kelola Semua Kategori
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Akses fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <Link href="/admin/products/new">
                  <Package className="h-6 w-6" />
                  <span>Tambah Produk</span>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link href="/admin/categories/new">
                  <Tag className="h-6 w-6" />
                  <span>Tambah Kategori</span>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link href="/admin/products">
                  <Eye className="h-6 w-6" />
                  <span>Lihat Produk</span>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link href="/admin/categories">
                  <TrendingUp className="h-6 w-6" />
                  <span>Kelola Kategori</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">
              Gagal memuat data dashboard. Silakan coba lagi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}