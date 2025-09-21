// app/admin/products/[id]/edit/page.tsx - Edit Product Page (Minimal)
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductForm from "@/components/admin/products/product-form";
import { ProductService } from "@/lib/database/services/product-service";
import { CategoryService } from "@/lib/database/services/category-service";

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductEditPageProps): Promise<Metadata> {
  try {
    const product = await ProductService.getProductById(params.id);
    
    if (!product) {
      return {
        title: "Produk Tidak Ditemukan | Admin Panel",
      };
    }
    
    return {
      title: `Edit ${product.brand} ${product.model} - ${product.name} | Admin Panel`,
      description: `Edit produk ${product.brand} ${product.model} - SKU: ${product.sku}`,
    };
  } catch (error) {
    return {
      title: "Error | Admin Panel",
    };
  }
}

export default async function EditProductPage({ params }: ProductEditPageProps) {
  try {
    console.log('🔄 Loading edit product page for ID:', params.id);
    
    // Get product and categories in parallel
    const [product, categories] = await Promise.all([
      ProductService.getProductById(params.id),
      CategoryService.getCategoriesForSelect()
    ]);
    
    if (!product) {
      console.log('❌ Product not found:', params.id);
      notFound();
    }

    console.log('✅ Product loaded for edit:', product.name, '- SKU:', product.sku);
    console.log('✅ Categories loaded for edit:', categories.length);
    console.log('📊 Complete product data for edit:', JSON.stringify(product, null, 2));
    
    if (!categories || categories.length === 0) {
      return (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Tidak ada kategori yang tersedia. Silakan tambahkan kategori terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Product Info Header */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Mengedit Produk</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span><strong>Brand:</strong> {product.brand}</span>
                <span><strong>Model:</strong> {product.model}</span>
                <span><strong>SKU:</strong> {product.sku}</span>
                <span><strong>Kondisi:</strong> {
                  product.condition === 'new' ? 'Baru' :
                  product.condition === 'refurbished' ? 'Refurbished' :
                  product.condition === 'used-like-new' ? 'Bekas Seperti Baru' : 
                  'Bekas Kondisi Baik'
                }</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Stok Saat Ini</div>
              <div className="text-2xl font-bold">{product.stock}</div>
            </div>
          </div>
        </div>
        
        <ProductForm 
          initialData={product} 
          categories={categories} 
          isEditing={true}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading edit product page:', error);
    
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Terjadi kesalahan saat memuat halaman edit produk. Silakan coba lagi atau hubungi administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }
}