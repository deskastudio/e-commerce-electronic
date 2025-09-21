// app/admin/products/[id]/page.tsx - Minimal Product Detail Page
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Package, 
  ShoppingCart,
  DollarSign,
  Box
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProductButton from "@/components/admin/products/delete-product-button";
import ProductImage from "@/components/admin/products/product-image";
import { Metadata } from "next";
import { ProductService } from "@/lib/database/services/product-service";
import { Product } from '@/types/product';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    const product = await ProductService.getProductById(params.id);
    
    if (!product) {
      return {
        title: "Produk Tidak Ditemukan | Admin Panel",
      };
    }
    
    return {
      title: `${product.brand} ${product.model} - ${product.name} | Admin Panel`,
      description: `Detail produk ${product.brand} ${product.model} - SKU: ${product.sku}`,
    };
  } catch (error) {
    return {
      title: "Error | Admin Panel",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    console.log('🔄 Loading product detail for ID:', params.id);
    
    const product = await ProductService.getProductById(params.id);
    
    if (!product) {
      console.log('❌ Product not found:', params.id);
      notFound();
    }

    console.log('✅ Product loaded:', product.name, '- SKU:', product.sku);
    
    return <ProductDetailContent product={product} />;
  } catch (error) {
    console.error('❌ Error loading product detail:', error);
    notFound();
  }
}

// Get condition text and color
const getConditionInfo = (condition: string) => {
  const conditionMap: Record<string, { text: string; class: string }> = {
    'new': { text: 'Baru', class: 'bg-green-100 text-green-800' },
    'refurbished': { text: 'Refurbished', class: 'bg-blue-100 text-blue-800' },
    'used-like-new': { text: 'Bekas Seperti Baru', class: 'bg-orange-100 text-orange-800' },
    'used-good': { text: 'Bekas Kondisi Baik', class: 'bg-yellow-100 text-yellow-800' }
  };
  return conditionMap[condition] || { text: condition, class: 'bg-gray-100 text-gray-800' };
};

// Separate component to handle the UI
function ProductDetailContent({ product }: { product: Product }) {
  // Format created date
  const createdDate = new Date(product.createdAt);
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(createdDate);
  
  // Format currency to Indonesian Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Get status text and badge color
  const getStatusText = () => {
    switch (product.status) {
      case "active":
        return "Aktif";
      case "draft":
        return "Draft";
      case "archived":
        return "Diarsipkan";
      default:
        return product.status;
    }
  };
  
  const getStatusBadgeClass = () => {
    switch (product.status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  const conditionInfo = getConditionInfo(product.condition);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.brand} {product.model}</h1>
            <p className="text-lg text-muted-foreground mb-2">{product.name}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                SKU: {product.sku}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Dibuat: {formattedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Produk
            </Link>
          </Button>
          <DeleteProductButton id={product.id} name={`${product.brand} ${product.model}`} />
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Informasi Produk
              </CardTitle>
              <CardDescription>Detail lengkap produk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeClass()}
                  >
                    {getStatusText()}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Kondisi</h3>
                  <Badge
                    variant="outline"
                    className={conditionInfo.class}
                  >
                    {conditionInfo.text}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Kategori</h3>
                  <p className="font-medium capitalize">{product.category.replace('-', ' ')}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Garansi</h3>
                  <p className="font-medium">{product.warranty || 'Tidak ada'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Deskripsi</h3>
                <p className="text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Price and Stock Information */}
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Harga Jual</h3>
                  <p className="text-2xl font-bold text-primary">{formatRupiah(product.price)}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Stok Tersedia</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-full ${
                      product.stock > 10 ? "bg-green-500" : 
                      product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <p className="text-xl font-bold">{product.stock} unit</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.stock > 10 ? 'Stok aman' : 
                     product.stock > 0 ? 'Stok terbatas' : 'Stok habis'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {!product.images || product.images.length === 0 || 
                 (product.images.length === 1 && product.images[0] === "/placeholder.svg") ? (
                  <div className="flex h-40 items-center justify-center rounded border border-dashed bg-gray-50">
                    <div className="text-center">
                      <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground">Tidak ada gambar produk</p>
                    </div>
                  </div>
                ) : (
                  product.images
                    .filter(image => image && image !== "/placeholder.svg")
                    .map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-md border">
                        <div className="relative hover:scale-105 transition-transform">
                          <ProductImage
                            src={image}
                            alt={`${product.brand} ${product.model} - Gambar ${index + 1}`}
                            width={300}
                            height={300}
                            className="h-auto w-full object-cover"
                            fallbackText={product.name}
                          />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Stok Tersedia</span>
                </div>
                <span className="font-medium">{product.stock}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Harga Jual</span>
                </div>
                <span className="font-medium">
                  {formatRupiah(product.price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Terjual</span>
                </div>
                <span className="font-medium">0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ditambahkan</span>
                </div>
                <span className="font-medium text-xs">{formattedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Produk
                </Link>
              </Button>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/products?query=${product.sku}`}>
                  <Package className="mr-2 h-4 w-4" />
                  Cari SKU: {product.sku}
                </Link>
              </Button>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/products?brand=${product.brand.toLowerCase()}`}>
                  <Package className="mr-2 h-4 w-4" />
                  Lihat Produk {product.brand}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}