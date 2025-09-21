// components/product/product-grid.tsx - FIXED VERSION
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingCart, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SimpleProductImage from "@/components/product/simple-product-image";
import { Product } from "@/types/product";
import { useCart } from "@/providers/cart-provider";
import { toast } from "sonner";

interface ProductsGridProps {
  page?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  condition?: string;
}

export default function ProductsGrid({
  page = 1,
  category,
  search,
  sort = "newest",
  minPrice = 0,
  maxPrice = 10000000,
  brand,
  condition,
}: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  const { addToCart, isLoading: cartLoading } = useCart();

  // Format price to Indonesian Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get condition text & badge
  const getConditionInfo = (condition: string) => {
    const conditionMap = {
      'new': { text: 'Baru', className: 'bg-green-100 text-green-800' },
      'refurbished': { text: 'Refurbished', className: 'bg-blue-100 text-blue-800' },
      'used-like-new': { text: 'Bekas Seperti Baru', className: 'bg-orange-100 text-orange-800' },
      'used-good': { text: 'Bekas Kondisi Baik', className: 'bg-yellow-100 text-yellow-800' }
    };
    return conditionMap[condition as keyof typeof conditionMap] || 
           { text: condition, className: 'bg-gray-100 text-gray-800' };
  };

  // Get first valid image
  const getFirstValidImage = (images: string[]): string => {
    if (!images || images.length === 0) {
      return '/placeholder.svg';
    }
    
    const validImage = images.find(img => img && img.trim() !== '');
    return validImage || '/placeholder.svg';
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', '12');
        params.set('status', 'active');
        
        if (search) params.set('query', search);
        if (category) params.set('category', category);
        if (condition) params.set('condition', condition);
        if (brand && brand.length > 0) params.set('brand', brand.join(','));
        
        // Map sort values
        if (sort) {
          const sortMap: Record<string, string> = {
            'newest': 'newest',
            'oldest': 'oldest',
            'price-low': 'price-asc',
            'price-high': 'price-desc',
            'name-asc': 'name-asc',
            'name-desc': 'name-desc',
            'stock-high': 'stock-high'
          };
          params.set('sort', sortMap[sort] || 'newest');
        }

        console.log('🔍 Fetching products with params:', params.toString());

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch products');
        }

        if (data.success) {
          setProducts(data.data.products || []);
          setTotal(data.data.total || 0);
          console.log('✅ Products loaded:', data.data.products.length);
        } else {
          throw new Error(data.message || 'Failed to load products');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, category, search, sort, brand, condition]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = product.id || product._id || '';
    
    if (!productId) {
      toast.error('Error: Product ID tidak ditemukan');
      return;
    }

    if ((product.stock || 0) <= 0) {
      toast.error('Produk habis', {
        description: 'Stok produk tidak tersedia'
      });
      return;
    }

    setAddingToCart(prev => new Set(prev).add(productId));

    try {
      const cartItem = {
        productId: productId,
        name: product.name || 'Produk Tidak Dikenal',
        price: product.price || 0,
        quantity: 1,
        image: getFirstValidImage(product.images || []),
        variant: undefined
      };

      console.log('Adding to cart from grid:', cartItem);
      
      await addToCart(cartItem);
      
      setJustAdded(prev => new Set(prev).add(productId));
      toast.success('Produk berhasil ditambahkan!', {
        description: `${product.name} telah ditambahkan ke keranjang`
      });

      // Reset success state after 2 seconds
      setTimeout(() => {
        setJustAdded(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gagal menambahkan produk', {
        description: 'Silakan coba lagi'
      });
    } finally {
      setAddingToCart(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(12).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Products</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  // No products found
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-7 7-7-7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Tidak Ada Produk</h3>
        <p className="text-gray-600 mb-4">
          {search || category ? 'Coba sesuaikan pencarian atau filter Anda' : 'Belum ada produk yang tersedia'}
        </p>
        {(search || category) && (
          <Link href="/products">
            <Button variant="outline">Lihat Semua Produk</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {products.length} dari {total} produk
          {search && ` untuk "${search}"`}
          {category && ` dalam kategori "${category.replace('-', ' ')}"`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const productId = product.id || product._id || '';
          const firstImage = getFirstValidImage(product.images || []);
          const conditionInfo = getConditionInfo(product.condition || 'new');
          const isOutOfStock = (product.stock || 0) <= 0;
          const isAddingThis = addingToCart.has(productId);
          const justAddedThis = justAdded.has(productId);
          
          return (
            <Card key={productId} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
              {/* Product Image Container */}
              <div className="relative bg-gray-50 p-4 overflow-hidden">
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 space-y-1">
                  <Badge className={`text-xs ${conditionInfo.className}`}>
                    {conditionInfo.text}
                  </Badge>
                  {isOutOfStock && (
                    <Badge className="bg-red-500 text-white text-xs">
                      Habis
                    </Badge>
                  )}
                </div>

                {/* Wishlist & Quick View */}
                <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white shadow-sm hover:shadow-md"
                    onClick={() => toggleWishlist(productId)}
                    title="Tambah ke Wishlist"
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(productId) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  <Link href={`/products/${productId}`}>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white shadow-sm hover:shadow-md"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </Link>
                </div>

                {/* Product Image */}
                <Link href={`/products/${productId}`} className="block">
                  <div className="flex h-[220px] items-center justify-center">
                    <SimpleProductImage
                      src={firstImage}
                      alt={product.name || 'Product'}
                      width={200}
                      height={200}
                      className={`h-full w-full object-contain hover:scale-105 transition-transform duration-300 ${
                        isOutOfStock ? 'opacity-50' : ''
                      }`}
                      fallbackText={product.name ? product.name.charAt(0) : 'P'}
                    />
                  </div>
                </Link>

                {/* Add to Cart Button (hover) */}
                {!isOutOfStock && (
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      className={`w-full text-white text-sm shadow-sm ${
                        justAddedThis 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      size="sm"
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isAddingThis || cartLoading}
                    >
                      {isAddingThis ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Menambahkan...
                        </>
                      ) : justAddedThis ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Ditambahkan!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Tambah ke Keranjang
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <CardContent className="p-4">
                <Link href={`/products/${productId}`}>
                  <h3 className="font-medium text-gray-900 hover:text-red-600 transition-colors line-clamp-2 mb-2 leading-tight">
                    {product.name || 'Produk Tidak Dikenal'}
                  </h3>
                </Link>

                {/* Brand & Model */}
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{product.brand || 'Unknown Brand'}</span>
                  {product.model && <span className="ml-1">• {product.model}</span>}
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className={`text-lg font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                    {formatRupiah(product.price || 0)}
                  </span>
                </div>

                {/* Stock & Warranty */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        (product.stock || 0) > 10 ? "bg-green-500" : 
                        (product.stock || 0) > 0 ? "bg-yellow-500" : "bg-red-500"
                      }`}></div>
                      <span>
                        {(product.stock || 0) > 0 ? `Stok: ${product.stock}` : 'Habis'}
                      </span>
                    </div>
                  </div>

                  {product.warranty && (
                    <div className="text-xs text-gray-500">
                      <span>🛡️ Garansi: {product.warranty}</span>
                    </div>
                  )}
                </div>

                {/* Rating (placeholder) */}
                <div className="mt-3 flex items-center">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < 4 ? "fill-yellow-400" : "fill-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">(4.0)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}