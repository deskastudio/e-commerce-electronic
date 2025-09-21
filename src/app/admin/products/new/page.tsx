// app/admin/products/new/page.tsx - New Product Page (Minimal)
import { Metadata } from "next";
import ProductForm from "@/components/admin/products/product-form";
import { CategoryService } from "@/lib/database/services/category-service";

export const metadata: Metadata = {
  title: "Tambah Produk Baru | Admin Panel",
  description: "Tambahkan produk baru ke toko anda"
};

export default async function NewProductPage() {
  try {
    console.log('🔄 Loading new product page...');
    
    // Get categories using server-side method
    const categories = await CategoryService.getCategoriesForSelect();
    
    console.log('✅ Categories loaded for new product:', categories.length);
    
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
      <ProductForm 
        categories={categories}
        isEditing={false}
      />
    );
  } catch (error) {
    console.error('❌ Error loading new product page:', error);
    
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
                  Terjadi kesalahan saat memuat halaman. Silakan coba lagi atau hubungi administrator.
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