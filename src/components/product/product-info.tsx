// components/product/product-info.tsx - FIXED VERSION
'use client';

import { useState } from 'react';
import { Heart, Minus, Plus, ShoppingCart, Share2, Truck, Shield, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/providers/cart-provider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, cart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get product ID (handle both id and _id)
  const productId = product.id || product._id || '';
  
  // Check if item is already in cart
  const existingItem = cart?.items?.find(item => item.productId === productId);
  const currentQuantityInCart = existingItem?.quantity || 0;
  const availableStock = (product.stock || 0) - currentQuantityInCart;

  // Format price to Indonesian Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get condition text and color
  const getConditionInfo = (condition: string) => {
    const conditionMap = {
      'new': { text: 'Baru', color: 'bg-green-100 text-green-800' },
      'refurbished': { text: 'Refurbished', color: 'bg-blue-100 text-blue-800' },
      'used-like-new': { text: 'Bekas Seperti Baru', color: 'bg-orange-100 text-orange-800' },
      'used-good': { text: 'Bekas Kondisi Baik', color: 'bg-yellow-100 text-yellow-800' }
    };
    return conditionMap[condition as keyof typeof conditionMap] || { text: condition, color: 'bg-gray-100 text-gray-800' };
  };

  // Get first valid image
  const getFirstValidImage = (images: string[]): string => {
    if (!images || images.length === 0) return '';
    const validImage = images.find(img => img && img.trim() !== '');
    return validImage || '';
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isLoading || availableStock < quantity) return;

    // Validate product data
    if (!productId) {
      toast.error('Error: Product ID tidak ditemukan');
      return;
    }

    if (!product.name) {
      toast.error('Error: Nama produk tidak ditemukan');
      return;
    }

    if (typeof product.price !== 'number' || product.price <= 0) {
      toast.error('Error: Harga produk tidak valid');
      return;
    }

    setIsLoading(true);
    try {
      // Create cart item with correct structure
      const cartItem = {
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: getFirstValidImage(product.images || []),
        variant: undefined
      };

      console.log('Adding to cart from product info:', cartItem);
      
      await addToCart(cartItem);
      
      setShowSuccess(true);
      toast.success('Produk berhasil ditambahkan!', {
        description: `${product.name} (${quantity}x) telah ditambahkan ke keranjang`
      });
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Gagal menambahkan produk', {
        description: error instanceof Error ? error.message : 'Silakan coba lagi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      // Add to cart first, then redirect to checkout
      await handleAddToCart();
      if (!isLoading) {
        router.push('/checkout');
      }
    } catch (error) {
      console.error('Failed to buy now:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link produk telah disalin ke clipboard');
    }
  };

  const conditionInfo = getConditionInfo(product.condition || 'new');
  const isOutOfStock = (product.stock || 0) <= 0 || availableStock <= 0;

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name || 'Produk Tidak Dikenal'}
        </h1>
        <div className="flex items-center gap-3 text-lg text-gray-600">
          <span className="font-medium">{product.brand || 'Unknown Brand'}</span>
          {product.model && (
            <>
              <span>•</span>
              <span>{product.model}</span>
            </>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-red-600">
          {formatRupiah(product.price || 0)}
        </div>
        <div className="text-sm text-gray-500">
          *Harga sudah termasuk PPN
        </div>
      </div>

      {/* Condition & Stock Status */}
      <div className="flex items-center gap-4">
        <Badge className={conditionInfo.color}>
          {conditionInfo.text}
        </Badge>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            availableStock > 10 ? 'bg-green-500' :
            availableStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            availableStock > 10 ? 'text-green-600' :
            availableStock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {availableStock > 0 ? `${availableStock} unit tersedia` : 'Stok habis'}
          </span>
        </div>
      </div>

      {/* SKU & Category */}
      <div className="text-sm text-gray-600 space-y-1">
        {product.sku && <div>SKU: <span className="font-mono">{product.sku}</span></div>}
        {product.category && <div>Kategori: <span className="capitalize">{product.category.replace('-', ' ')}</span></div>}
        {product.warranty && (
          <div>Garansi: <span className="text-green-600 font-medium">{product.warranty}</span></div>
        )}
      </div>

      {/* Cart Info */}
      {currentQuantityInCart > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            📦 {currentQuantityInCart} item sudah ada di keranjang
          </p>
        </div>
      )}

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Jumlah:</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-12 text-center font-medium">
                {quantity}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= availableStock}
                className="h-10 w-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <span className="text-sm text-gray-500">
              (Maksimal {availableStock} unit)
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {isOutOfStock ? (
          <Button disabled className="w-full h-12 text-lg bg-gray-300 text-gray-500">
            Stok Habis
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleAddToCart}
              disabled={isLoading || quantity > availableStock}
              className={`w-full h-12 text-lg font-medium transition-all duration-200 ${
                showSuccess 
                  ? 'bg-green-600 hover:bg-green-600' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                  Menambahkan...
                </>
              ) : showSuccess ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Berhasil Ditambahkan!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Tambah ke Keranjang {quantity > 1 && `(${quantity})`}
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleBuyNow}
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50 h-12 text-lg font-medium"
            >
              Beli Sekarang
            </Button>
          </>
        )}
        
        {/* Wishlist & Share */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Tersimpan' : 'Simpan'}
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>

      {/* Quick Cart Actions */}
      {session && currentQuantityInCart > 0 && (
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/cart')}
            >
              Lihat Keranjang
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/checkout')}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="border-t pt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Truck className="w-5 h-5 text-green-600" />
            <span>Gratis ongkir untuk pembelian di atas Rp 500.000</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Jaminan keaslian produk</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <RotateCcw className="w-5 h-5 text-orange-600" />
            <span>30 hari pengembalian tanpa ribet</span>
          </div>
        </div>
      </div>

      {/* Debug Info - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border-t">
          <strong>Debug Info:</strong>
          <div>Product ID: {productId}</div>
          <div>Available Stock: {availableStock}</div>
          <div>In Cart: {currentQuantityInCart}</div>
          <div>Selected Quantity: {quantity}</div>
          <div>Product Name: {product.name}</div>
          <div>Product Price: {product.price}</div>
        </div>
      )}
    </div>
  );
}