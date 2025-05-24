// app/admin/categories/[id]/page.tsx - Category Detail
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Package, Calendar, Hash, Eye } from "lucide-react";
import { Metadata } from "next";
import DeleteCategoryButton from "@/components/admin/categories/delete-category-button"; 

// Updated imports with new structure
import { CategoryService, ProductService } from "@/lib/database/services";
import { Category } from "@/types";

interface CategoryDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  try {
    const category = await CategoryService.getCategoryById(params.id);
    
    if (!category) {
      return {
        title: "Kategori Tidak Ditemukan | Admin Panel",
      };
    }
    
    return {
      title: `${category.name} | Admin Panel`,
      description: `Detail kategori ${category.name}`,
    };
  } catch (error) {
    return {
      title: "Error | Admin Panel",
    };
  }
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  try {
    const [category, products] = await Promise.all([
      CategoryService.getCategoryById(params.id),
      ProductService.getProductsByCategory(params.id)
    ]);
    
    if (!category) {
      notFound();
    }

    return <CategoryDetailContent category={category} productCount={products.length} />;
  } catch (error) {
    console.error('Error loading category:', error);
    notFound();
  }
}

function CategoryDetailContent({ 
  category, 
  productCount 
}: { 
  category: Category; 
  productCount: number;
}) {
  // Format created date
  const createdDate = new Date(category.createdAt);
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(createdDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                Slug: {category.slug}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Dibuat: {formattedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/categories/${category.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Kategori
            </Link>
          </Button>
          <DeleteCategoryButton 
            id={category.id} 
            name={category.name} 
            productCount={productCount}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>Detail lengkap kategori</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Status</h3>
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
                </div>
                
                <div>
                  <h3 className="font-medium">Jumlah Produk</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{productCount}</span>
                    {productCount > 0 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products?category=${category.slug}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          Lihat
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <h3 className="font-medium">Slug URL</h3>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </div>
                
                <div className="col-span-2">
                  <h3 className="font-medium">Deskripsi</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description || "Tidak ada deskripsi"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products in this category */}
          {productCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Produk dalam Kategori Ini
                </CardTitle>
                <CardDescription>
                  {productCount} produk dalam kategori {category.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Kategori ini memiliki {productCount} produk aktif
                  </p>
                  <Button asChild>
                    <Link href={`/admin/products?category=${category.slug}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Semua Produk
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Image */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              {category.imageUrl ? (
                <div className="overflow-hidden rounded-md border">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded border border-dashed">
                  <div className="text-center">
                    <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Tidak ada gambar kategori
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Produk</span>
                </div>
                <span className="font-medium">{productCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Dibuat</span>
                </div>
                <span className="font-medium text-sm">
                  {new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }).format(createdDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">URL Slug</span>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}