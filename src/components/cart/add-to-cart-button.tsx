// components/product/add-to-cart-button.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/cart-provider'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
  variant?: {
    size?: string
    color?: string
    [key: string]: any
  }
  quantity?: number
  className?: string
  disabled?: boolean
}

export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className = "",
  disabled = false
}: AddToCartButtonProps) {
  const { addToCart, isLoading: cartLoading } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        variant
      })

      setJustAdded(true)
      toast.success('Produk berhasil ditambahkan ke keranjang!', {
        description: `${product.name} (${quantity}x)`
      })

      // Reset success state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      toast.error('Gagal menambahkan produk ke keranjang', {
        description: 'Silakan coba lagi'
      })
    } finally {
      setIsAdding(false)
    }
  }

  const isButtonDisabled = disabled || isAdding || cartLoading

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isButtonDisabled}
      className={className}
      size="lg"
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Menambahkan...
        </>
      ) : justAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Ditambahkan!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Tambah ke Keranjang
        </>
      )}
    </Button>
  )
}