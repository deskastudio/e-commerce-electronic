// types/cart.ts
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  addedAt: string;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: string;
}

export interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}