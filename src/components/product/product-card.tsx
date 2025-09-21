// components/shop/product/product-card.tsx - FINAL FIXED VERSION
"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductImage from "@/components/admin/products/product-image";
import { getFirstValidImage } from "@/lib/utils/image-helpers";
import { useCart } from "@/providers/cart-provider";
import { Product, getProductId, getProductName, getProductPrice, getProductStock, validateProductForCart } from "@/types/product";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  showDiscount?: boolean;
  className?: string;
}

export default function ProductCard({ 
  product, 
  showDiscount = false,
  className = ""
}: ProductCardProps) {
  const { addToCart, isLoading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Format price to Indonesian Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get condition text in Indonesian
  const getConditionText = (condition: string): string => {
    const conditionMap: Record<string, string> = {
      'new': 'Baru',
      'refurbished': 'Refurbished', 
      'used-like-new': 'Bekas Seperti Baru',
      'used-good': 'Bekas Kondisi Baik'
    };
    return conditionMap[condition] || condition;
  };

  // Get condition badge color
  const getConditionBadgeClass = (condition: string): string => {
    const colorMap: Record<string, string> = {
      'new': 'bg-green-100 text-green-800',
      'refurbished': 'bg-blue-100 text-blue-800',
      'used-like-new': 'bg-orange-100 text-orange-800',
      'used-good': 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[condition] || 'bg-gray-100 text-gray-800';
  };

  // Handle Add to Cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    const stock = getProductStock(product);
    if (stock <= 0) {
      toast.error('Produk habis', {
        description: 'Stok produk tidak tersedia'
      });
      return;
    }

    // Validate product data before proceeding
    const validation = validateProductForCart(product);
    if (!validation.isValid) {
      console.error('Product validation failed:', validation.errors);
      toast.error('Data produk tidak valid', {
        description: validation.errors.join(', ')
      });
      return;
    }

    setIsAdding(true);
    
    // Create proper cart item with all required fields using helper functions
    const cartItem = {
      productId: getProductId(product),
      name: getProductName(product),
      price: getProductPrice(product),
      quantity: 1,
      image: getFirstValidImage(product.images) || '',
      variant: undefined // No variants for now
    };

    console.log('=== ADD TO CART DEBUG ===');
    console.log('Original product:', product);
    console.log('Cart item to add:', cartItem);
    console.log('Validation passed:', validation);

    try {
      console.log('Calling addToCart with:', cartItem);
      await addToCart(cartItem);

      setJustAdded(true);
      toast.success('Produk berhasil ditambahkan!', {
        description: `${cartItem.name} telah ditambahkan ke keranjang`
      });

      // Reset success state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gagal menambahkan produk', {
        description: error instanceof Error ? error.message : 'Silakan coba lagi'
      });
    } finally {
      setIsAdding(false);
    }
  };

  const firstImage = getFirstValidImage(product.images);
  const isOutOfStock = getProductStock(product) <= 0;
  const isButtonDisabled = isAdding || cartLoading || isOutOfStock;

  return (
    <Card className={`group overflow-hidden border shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Image Container */}
      <div className="relative bg-gray-50 p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 space-y-1">
          {product.condition === 'new' && (
            <Badge className="bg-green-500 text-white text-xs">Baru</Badge>
          )}
          {showDiscount && (
            <Badge className="bg-red-500 text-white text-xs">
              Promo
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-gray-500 text-white text-xs">Habis</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white shadow-sm"
            title="Tambah ke Wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Link href={`/product/${product.id || product._id}`}>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white shadow-sm"
              title="Lihat Detail"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Product Image */}
        <Link href={`/product/${product.id || product._id}`} className="block">
          <div className="flex h-[200px] items-center justify-center">
            <ProductImage
              src={firstImage}
              alt={product.name || 'Product'}
              width={180}
              height={180}
              className={`h-full w-full object-contain hover:scale-105 transition-transform ${
                isOutOfStock ? 'opacity-50' : ''
              }`}
              fallbackText={product.name ? product.name.charAt(0) : 'P'}
            />
          </div>
        </Link>

        {/* Add to Cart Button (appears on hover) */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
            className={`w-full text-white text-sm ${
              justAdded 
                ? 'bg-green-600 hover:bg-green-700' 
                : isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            size="sm"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menambahkan...
              </>
            ) : justAdded ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Ditambahkan!
              </>
            ) : isOutOfStock ? (
              <>
                Stok Habis
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Tambah ke Keranjang
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <Link href={`/product/${product.id || product._id}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.name || 'Produk Tidak Dikenal'}
          </h3>
        </Link>

        {/* Brand & Model */}
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">{product.brand || 'Unknown Brand'}</span>
          {product.model && <span className="ml-1">{product.model}</span>}
        </div>

        {/* Price */}
        <div className="mb-2">
          <span className={`text-lg font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
            {formatRupiah(product.price || 0)}
          </span>
        </div>

        {/* Condition & Stock */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs ${getConditionBadgeClass(product.condition || 'new')}`}
          >
            {getConditionText(product.condition || 'new')}
          </Badge>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full mr-1 ${
              (product.stock || 0) > 10 ? "bg-green-500" : 
              (product.stock || 0) > 0 ? "bg-yellow-500" : "bg-red-500"
            }`}></div>
            <span>
              {(product.stock || 0) > 0 ? `Stok: ${product.stock}` : 'Habis'}
            </span>
          </div>
        </div>

        {/* Warranty Info */}
        {product.warranty && (
          <div className="text-xs text-gray-500 mt-2">
            <span>Garansi: {product.warranty}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}