// providers/cart-provider.tsx - FIXED VERSION
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Cart, CartItem, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
    updatedAt: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let stored = localStorage.getItem('guest-session-id');
      if (!stored) {
        stored = crypto.randomUUID();
        localStorage.setItem('guest-session-id', stored);
      }
      return stored;
    }
    return crypto.randomUUID();
  });

  // FIXED: Robust data validation and type conversion
  const validateCartData = (cartData: any): Cart => {
    if (!cartData || typeof cartData !== 'object') {
      return {
        items: [],
        total: 0,
        itemCount: 0,
        updatedAt: new Date().toISOString()
      };
    }

    const validatedItems = Array.isArray(cartData.items) 
      ? cartData.items.map((item: any) => ({
          id: item.id || item._id || String(Math.random()),
          productId: String(item.productId || ''),
          name: String(item.name || 'Unknown Product'),
          price: Number(item.price) || 0,
          quantity: Math.max(1, Number(item.quantity) || 1),
          image: String(item.image || ''),
          variant: item.variant || {},
          addedAt: item.addedAt || new Date().toISOString()
        }))
      : [];

    // Recalculate totals to ensure accuracy
    const total = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = validatedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cartData.id,
      userId: cartData.userId,
      sessionId: cartData.sessionId,
      items: validatedItems,
      total: Math.round(total * 100) / 100, // Round to 2 decimal places
      itemCount,
      updatedAt: cartData.updatedAt || new Date().toISOString()
    };
  };

  // Enhanced localStorage operations with validation
  const saveCartToLocalStorage = (cartData: Cart) => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = session?.user?.id ? `user-cart-${session.user.id}` : 'guest-cart';
        const validatedCart = validateCartData(cartData);
        localStorage.setItem(storageKey, JSON.stringify(validatedCart));
        console.log('💾 Cart saved to localStorage:', validatedCart);
      } catch (error) {
        console.error('❌ Failed to save cart to localStorage:', error);
      }
    }
  };

  const loadCartFromLocalStorage = (): Cart | null => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = session?.user?.id ? `user-cart-${session.user.id}` : 'guest-cart';
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
          const cartData = JSON.parse(stored);
          const validatedCart = validateCartData(cartData);
          console.log('📂 Cart loaded from localStorage:', validatedCart);
          return validatedCart;
        }
      } catch (error) {
        console.error('❌ Failed to load cart from localStorage:', error);
      }
    }
    return null;
  };

  // Fetch cart from server with enhanced error handling
  const fetchCart = async () => {
    if (status === 'loading') return;
    
    console.log('🔄 Fetching cart from server...');
    
    // Try localStorage first for immediate UI update
    const localCart = loadCartFromLocalStorage();
    if (localCart && localCart.items.length > 0) {
      console.log('⚡ Using localStorage cart while fetching from server');
      setCart(localCart);
    }
    
    setIsLoading(true);
    try {
      const identifier = session?.user?.id 
        ? { userId: session.user.id }
        : { sessionId };

      console.log('📤 Fetch request:', { action: 'get', ...identifier });

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', ...identifier })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Server response:', data);
        
        if (data.cart) {
          const validatedCart = validateCartData(data.cart);
          setCart(validatedCart);
          saveCartToLocalStorage(validatedCart);
        } else {
          // No cart found, keep localStorage cart or use empty cart
          if (!localCart || localCart.items.length === 0) {
            const emptyCart = validateCartData({});
            setCart(emptyCart);
          }
        }
      } else {
        console.warn('⚠️ Server fetch failed, using localStorage cart');
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      // Keep localStorage cart on error
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced add to cart with robust data validation
  const addToCart = async (item: Omit<CartItem, 'id' | 'addedAt'>) => {
    console.log('🛒 Adding item to cart:', item);

    // FIXED: Validate and sanitize item data
    if (!item.productId || !item.name) {
      console.error('❌ Invalid item data: missing productId or name');
      throw new Error('Invalid item data');
    }

    const sanitizedItem = {
      productId: String(item.productId),
      name: String(item.name),
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      image: String(item.image || ''),
      variant: item.variant || {}
    };

    console.log('✅ Sanitized item:', sanitizedItem);

    // Calculate new cart state optimistically
    const currentItems = [...cart.items];
    const existingItemIndex = currentItems.findIndex(
      cartItem => cartItem.productId === sanitizedItem.productId &&
      JSON.stringify(cartItem.variant || {}) === JSON.stringify(sanitizedItem.variant || {})
    );

    let newItems: CartItem[];
    if (existingItemIndex > -1) {
      newItems = [...currentItems];
      newItems[existingItemIndex].quantity += sanitizedItem.quantity;
    } else {
      const newItem: CartItem = {
        ...sanitizedItem,
        id: crypto.randomUUID(),
        addedAt: new Date().toISOString()
      };
      newItems = [...currentItems, newItem];
    }

    // Calculate totals
    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    const newCart: Cart = {
      ...cart,
      items: newItems,
      total: Math.round(total * 100) / 100,
      itemCount,
      updatedAt: new Date().toISOString()
    };

    // Update state immediately for better UX
    setCart(newCart);
    saveCartToLocalStorage(newCart);

    // Sync with server
    setIsLoading(true);
    try {
      const identifier = session?.user?.id 
        ? { userId: session.user.id }
        : { sessionId };

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'add', 
          item: sanitizedItem,
          ...identifier 
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.cart) {
          const validatedCart = validateCartData(responseData.cart);
          setCart(validatedCart);
          saveCartToLocalStorage(validatedCart);
        }
      } else {
        console.warn('⚠️ Server sync failed, keeping local cart');
      }
    } catch (error) {
      console.error('❌ Server sync error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced remove item with error handling
  const removeFromCart = async (itemId: string) => {
    console.log('🗑️ Removing item from cart:', itemId);

    // Optimistic update
    const newItems = cart.items.filter(item => item.id !== itemId);
    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    const newCart: Cart = {
      ...cart,
      items: newItems,
      total: Math.round(total * 100) / 100,
      itemCount,
      updatedAt: new Date().toISOString()
    };

    setCart(newCart);
    saveCartToLocalStorage(newCart);

    // Sync with server
    try {
      const identifier = session?.user?.id 
        ? { userId: session.user.id }
        : { sessionId };

      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'remove', 
          itemId,
          ...identifier 
        })
      });
    } catch (error) {
      console.error('❌ Remove sync error:', error);
    }
  };

  // Enhanced update quantity with validation
  const updateQuantity = async (itemId: string, quantity: number) => {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    
    if (safeQuantity <= 0) {
      return removeFromCart(itemId);
    }

    console.log('🔄 Updating quantity:', itemId, safeQuantity);

    // Optimistic update
    const newItems = cart.items.map(item =>
      item.id === itemId ? { ...item, quantity: safeQuantity } : item
    );

    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    const newCart: Cart = {
      ...cart,
      items: newItems,
      total: Math.round(total * 100) / 100,
      itemCount,
      updatedAt: new Date().toISOString()
    };

    setCart(newCart);
    saveCartToLocalStorage(newCart);

    // Sync with server
    try {
      const identifier = session?.user?.id 
        ? { userId: session.user.id }
        : { sessionId };

      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update', 
          itemId,
          quantity: safeQuantity,
          ...identifier 
        })
      });
    } catch (error) {
      console.error('❌ Update sync error:', error);
    }
  };

  // Enhanced clear cart
  const clearCart = async () => {
    console.log('🗑️ Clearing cart');

    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0,
      updatedAt: new Date().toISOString()
    };

    setCart(emptyCart);
    saveCartToLocalStorage(emptyCart);

    // Sync with server
    try {
      const identifier = session?.user?.id 
        ? { userId: session.user.id }
        : { sessionId };

      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'clear',
          ...identifier 
        })
      });
    } catch (error) {
      console.error('❌ Clear sync error:', error);
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  // Session effects
  useEffect(() => {
    console.log('👤 Session changed:', { status, userId: session?.user?.id });
    if (status !== 'loading') {
      fetchCart();
    }
  }, [session, status]);

  // Mount effect
  useEffect(() => {
    console.log('🚀 Cart provider mounted');
    const localCart = loadCartFromLocalStorage();
    if (localCart) {
      const validatedCart = validateCartData(localCart);
      setCart(validatedCart);
    }
  }, []);

  // Debug cart changes
  useEffect(() => {
    console.log('🔍 CART STATE CHANGED:', {
      itemCount: cart.itemCount,
      total: cart.total,
      itemsLength: cart.items.length,
      items: cart.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        priceType: typeof item.price,
        quantityType: typeof item.quantity
      }))
    });
  }, [cart]);

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}