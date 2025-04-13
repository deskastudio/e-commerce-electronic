import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById } from "@/lib/products-db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Package, 
  Tag, 
  ShoppingCart,
  DollarSign 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProductButton from "@/components/admin/delete-product-button";
import { Metadata } from "next";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);
  
  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Admin Panel",
    };
  }
  
  return {
    title: `${product.name} | Admin Panel`,
    description: `Detail produk untuk ${product.name}`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }
  
  // Format created date
  const createdDate = new Date(product.createdAt);
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(createdDate);
  
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
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                SKU: {product.sku || "-"}
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
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Produk
            </Link>
          </Button>
          <DeleteProductButton id={product.id} name={product.name} />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Produk</CardTitle>
              <CardDescription>Detail lengkap produk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Status</h3>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeClass()}
                  >
                    {getStatusText()}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium">Kategori</h3>
                  <p className="text-sm capitalize">{product.category}</p>
                </div>
                
                <div className="col-span-2">
                  <h3 className="font-medium">Deskripsi</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                
                <div className="col-span-2">
                  <h3 className="font-medium">Tag</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length === 0 && (
                      <span className="text-sm text-muted-foreground">Tidak ada tag</span>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Harga</h3>
                  <p className="text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
                
                {product.discountPrice && (
                  <div>
                    <h3 className="font-medium">Harga Diskon</h3>
                    <p className="text-sm">Rp {product.discountPrice.toLocaleString('id-ID')}</p>
                  </div>
                )}
                
                {product.cost && (
                  <div>
                    <h3 className="font-medium">Biaya per Item</h3>
                    <p className="text-sm">Rp {product.cost.toLocaleString('id-ID')}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Stok</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      product.stock > 10 ? "bg-green-500" : 
                      product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <p className="text-sm">{product.stock}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">SKU</h3>
                  <p className="text-sm">{product.sku || "-"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Barcode</h3>
                  <p className="text-sm">{product.barcode || "-"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Produk Fisik</h3>
                  <p className="text-sm">{product.isPhysical ? "Ya" : "Tidak"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Kena Pajak</h3>
                  <p className="text-sm">{product.isTaxable ? "Ya" : "Tidak"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Perlu Pengiriman</h3>
                  <p className="text-sm">{product.isShippingRequired ? "Ya" : "Tidak"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {product.images.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded border border-dashed">
                    <p className="text-sm text-muted-foreground">Tidak ada gambar produk</p>
                  </div>
                ) : (
                  product.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-md border">
                      <Image
                        src={image}
                        alt={`${product.name} - Gambar ${index + 1}`}
                        width={300}
                        height={300}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistik Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Terjual</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Pendapatan</span>
                </div>
                <span className="font-medium">Rp 0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Margin Profit</span>
                </div>
                <span className="font-medium">-</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}