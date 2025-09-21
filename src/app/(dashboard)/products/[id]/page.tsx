// src/app/product/[id]/page.tsx - FIXED Product Detail Page
import { notFound } from 'next/navigation';
import { ProductService } from '@/lib/database/services/product-service';
import ProductGallery from '@/components/product/product-gallery';
import ProductInfo from '@/components/product/product-info';
import RelatedProducts from '@/components/product/related-products';
import Breadcrumb from '@/components/product/breadcrumbs';
import { Metadata } from 'next';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// FIXED: Generate metadata dynamically
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    console.log('🔄 Generating metadata for product ID:', params.id);
    const product = await ProductService.getProductById(params.id);
    
    if (!product) {
      return {
        title: 'Produk Tidak Ditemukan',
        description: 'Produk yang Anda cari tidak tersedia'
      };
    }

    return {
      title: `${product.name} - ${product.brand} ${product.model} | Electronic Commerce`,
      description: `${product.description.substring(0, 160)}...`,
      keywords: `${product.name}, ${product.brand}, ${product.model}, ${product.category}, elektronik`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.length > 0 ? product.images.map(img => ({ url: img })) : [],
        // FIXED: Use 'website' instead of 'product' to avoid OpenGraph error
        type: 'website',
        siteName: 'Electronic Commerce'
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: product.images?.length > 0 ? [product.images[0]] : []
      }
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    return {
      title: 'Error Loading Product',
      description: 'Terjadi kesalahan saat memuat produk'
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  console.log('🔍 =================================');
  console.log('🔍 PRODUCT DETAIL PAGE STARTING');
  console.log('🔍 Product ID from params:', params.id);
  console.log('🔍 =================================');

  let product;
  let relatedProducts = [];
  let hasError = false;
  let errorMessage = '';

  try {
    // Validate ID parameter
    if (!params.id || params.id.trim() === '') {
      console.log('❌ Invalid product ID parameter');
      notFound();
    }

    console.log('🔄 Step 1: Fetching product data...');
    
    // Get product by ID
    product = await ProductService.getProductById(params.id);
    
    if (!product) {
      console.log('❌ Product not found with ID:', params.id);
      console.log('📝 Debugging info:');
      console.log('   - Make sure product exists in database');
      console.log('   - Check if ID format is correct (ObjectId)');
      console.log('   - Verify database connection');
      notFound();
    }

    console.log('✅ Step 1 Complete: Product loaded successfully');
    console.log('📦 Product Name:', product.name);
    console.log('🏷️ Product SKU:', product.sku);
    console.log('📂 Product Category:', product.category);
    console.log('🖼️ Number of Images:', product.images?.length || 0);
    console.log('💰 Price:', product.price);
    console.log('📊 Stock:', product.stock);

    console.log('🔄 Step 2: Fetching related products...');
    
    // Get related products (same category, excluding current product)
    try {
      const relatedResult = await ProductService.getProductsPaginated(1, 4, {
        category: product.category,
        status: 'active'
      });
      
      // Filter out current product
      relatedProducts = relatedResult.products.filter(p => p.id !== product.id);
      console.log('✅ Step 2 Complete: Related products loaded:', relatedProducts.length);
    } catch (relatedError) {
      console.error('⚠️ Error loading related products (non-critical):', relatedError);
      // Don't fail the entire page for related products error
      relatedProducts = [];
    }

  } catch (fetchError) {
    console.error('❌ Critical error in product detail page:', fetchError);
    hasError = true;
    errorMessage = (fetchError as Error).message;
    
    // Log additional debugging info
    console.log('🔍 Debugging Info:');
    console.log('   - Requested ID:', params.id);
    console.log('   - Error message:', errorMessage);
    console.log('   - Error stack:', (fetchError as Error).stack);
    
    notFound();
  }

  console.log('🔍 =================================');
  console.log('🔍 RENDERING PRODUCT DETAIL PAGE');
  console.log('🔍 =================================');

  // If error occurred, show error page
  if (hasError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, terjadi kesalahan saat memuat detail produk.
          </p>
          <div className="text-sm text-red-600 mb-4">
            Error: {errorMessage}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <Breadcrumb product={product} />

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Gallery */}
          <ProductGallery 
            images={product.images || []} 
            productName={product.name}
          />

          {/* Product Information */}
          <ProductInfo product={product} />
        </div>

        {/* Product Description */}
        <div className="mb-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Deskripsi Produk</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Spesifikasi</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Brand</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Model</span>
                  <span className="text-gray-900">{product.model}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">SKU</span>
                  <span className="text-gray-900 font-mono text-sm">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Kondisi</span>
                  <span className="text-gray-900">
                    {product.condition === 'new' ? 'Baru' : 
                     product.condition === 'refurbished' ? 'Refurbished' :
                     product.condition === 'used-like-new' ? 'Bekas Seperti Baru' :
                     'Bekas Kondisi Baik'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Kategori</span>
                  <span className="text-gray-900 capitalize">{product.category.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Stok</span>
                  <span className={`font-medium ${
                    product.stock > 10 ? 'text-green-600' :
                    product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
                  </span>
                </div>
                {product.warranty && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-600">Garansi</span>
                    <span className="text-gray-900">{product.warranty}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status === 'active' ? 'Tersedia' :
                     product.status === 'draft' ? 'Draft' : 'Diarsipkan'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts 
            products={relatedProducts}
            currentProductId={product.id}
          />
        )}
      </div>
    </div>
  );
}