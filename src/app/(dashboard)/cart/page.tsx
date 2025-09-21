// app/cart/page.tsx - COMPLETELY FIXED VERSION
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/providers/cart-provider'

// FIXED: Robust currency formatting function
const formatCurrency = (amount: number | string | undefined): string => {
  // Handle undefined, null, or invalid values
  let numericAmount = 0;
  
  if (typeof amount === 'number' && !isNaN(amount)) {
    numericAmount = amount;
  } else if (typeof amount === 'string') {
    const parsed = parseFloat(amount);
    numericAmount = isNaN(parsed) ? 0 : parsed;
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

// FIXED: Safe number calculation
const safeCalculate = (price: number | string | undefined, quantity: number | string | undefined): number => {
  const safePrice = typeof price === 'number' && !isNaN(price) ? price : 
                   typeof price === 'string' ? (parseFloat(price) || 0) : 0;
  const safeQuantity = typeof quantity === 'number' && !isNaN(quantity) ? quantity : 
                      typeof quantity === 'string' ? (parseInt(quantity) || 1) : 1;
  
  return safePrice * safeQuantity;
};

export default function CartPage() {
  const { cart, isLoading, removeFromCart, updateQuantity, clearCart } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  // Debug cart data
  useEffect(() => {
    console.log('🛒 Cart Debug Info:', {
      cart,
      itemsCount: cart?.items?.length || 0,
      total: cart?.total,
      itemCount: cart?.itemCount
    });
    
    if (cart?.items) {
      cart.items.forEach((item, index) => {
        console.log(`📦 Item ${index + 1}:`, {
          id: item.id,
          name: item.name,
          price: item.price,
          priceType: typeof item.price,
          quantity: item.quantity,
          quantityType: typeof item.quantity,
          image: item.image
        });
      });
    }
  }, [cart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    }
  }

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => new Set(prev).add(itemId))
  }

  const getImageSrc = (item: any) => {
    if (imageErrors.has(item.id)) {
      return '/placeholder.svg?height=80&width=80&text=No+Image'
    }
    return item.image || '/placeholder.svg?height=80&width=80&text=Product+Image'
  }

  // Loading state
  if (isLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading cart...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </nav>

          {!cart || cart.items.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-bold mb-2">Keranjang Anda Kosong</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Sepertinya Anda belum menambahkan produk apapun ke keranjang. 
                Mari mulai berbelanja!
              </p>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Mulai Berbelanja
                </Button>
              </Link>
            </div>
          ) : (
            // Cart Content
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">
                    Keranjang Belanja ({cart.itemCount || cart.items.length} item{(cart.itemCount || cart.items.length) !== 1 ? 's' : ''})
                  </h1>
                  {cart.items.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Kosongkan
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => {
                    // FIXED: Ensure we have valid data for each item
                    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
                    const itemTotal = itemPrice * itemQuantity;
                    
                    return (
                      <Card key={item.id} className="relative">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Product Image - FIXED */}
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                              <Image
                                src={getImageSrc(item)}
                                alt={item.name || 'Product'}
                                fill
                                className="object-cover"
                                onError={() => handleImageError(item.id)}
                                unoptimized={getImageSrc(item).includes('placeholder.svg')}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium mb-1 truncate">
                                {item.name || 'Unknown Product'}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {formatCurrency(itemPrice)} per item
                              </p>
                              
                              {/* Variants */}
                              {item.variant && (
                                <div className="flex gap-2 mb-3">
                                  {item.variant.size && (
                                    <Badge variant="secondary">Size: {item.variant.size}</Badge>
                                  )}
                                  {item.variant.color && (
                                    <Badge variant="secondary">Color: {item.variant.color}</Badge>
                                  )}
                                </div>
                              )}

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.id, itemQuantity - 1)}
                                    disabled={itemQuantity <= 1 || updatingItems.has(item.id)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={itemQuantity}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value)
                                      if (value > 0 && value <= 999) {
                                        handleQuantityChange(item.id, value)
                                      }
                                    }}
                                    className="h-8 w-16 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="1"
                                    max="999"
                                    disabled={updatingItems.has(item.id)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.id, itemQuantity + 1)}
                                    disabled={updatingItems.has(item.id) || itemQuantity >= 999}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={updatingItems.has(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Hapus
                                </Button>
                              </div>
                            </div>

                            {/* Item Total - FIXED */}
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                {formatCurrency(itemTotal)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {itemQuantity} × {formatCurrency(itemPrice)}
                              </p>
                              {updatingItems.has(item.id) && (
                                <div className="mt-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary - FIXED */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.itemCount || cart.items.length} item{(cart.itemCount || cart.items.length) !== 1 ? 's' : ''})</span>
                      <span>{formatCurrency(cart.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(cart.total)}</span>
                    </div>
                    
                    {/* Debug Info (remove in production) */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
                        <p><strong>Debug:</strong></p>
                        <p>Cart Total: {cart.total} (type: {typeof cart.total})</p>
                        <p>Item Count: {cart.itemCount}</p>
                        <p>Items Length: {cart.items.length}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Link href="/checkout" className="w-full">
                      <Button size="lg" className="w-full gap-2">
                        Lanjut ke Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/products" className="w-full">
                      <Button variant="outline" size="lg" className="w-full">
                        Lanjut Berbelanja
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}