// lib/database/services/cart-service.ts
'use server';

import connectDB from "@/lib/database/connection";
import CartModel, { convertDocumentToCart } from "@/lib/database/models/Cart";
import { Cart, CartItem } from "@/types/cart";

// Connect to database
async function dbConnect() {
  await connectDB();
}

// Get cart by user ID
export async function getCartByUserId(userId: string): Promise<Cart | null> {
  try {
    await dbConnect();
    const cart = await CartModel.findOne({ userId });
    
    if (!cart) {
      return null;
    }
    
    return convertDocumentToCart(cart);
  } catch (error) {
    console.error(`Error getting cart for user ${userId}:`, error);
    return null;
  }
}

// Get cart by session ID (for guest users)
export async function getCartBySessionId(sessionId: string): Promise<Cart | null> {
  try {
    await dbConnect();
    const cart = await CartModel.findOne({ sessionId });
    
    if (!cart) {
      return null;
    }
    
    return convertDocumentToCart(cart);
  } catch (error) {
    console.error(`Error getting cart for session ${sessionId}:`, error);
    return null;
  }
}

// Create new cart
export async function createCart(data: {
  userId?: string;
  sessionId?: string;
}): Promise<Cart> {
  try {
    await dbConnect();
    
    const cartData: any = {
      items: [],
      total: 0,
      itemCount: 0
    };
    
    if (data.userId) {
      cartData.userId = data.userId;
    } else if (data.sessionId) {
      cartData.sessionId = data.sessionId;
    }
    
    const newCart = await CartModel.create(cartData);
    return convertDocumentToCart(newCart);
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Gagal membuat keranjang: " + (error as Error).message);
  }
}

// Add item to cart
export async function addItemToCart(
  cartIdentifier: { userId?: string; sessionId?: string },
  item: Omit<CartItem, 'id' | 'addedAt'>
): Promise<Cart> {
  try {
    await dbConnect();
    
    console.log('Adding item to cart with identifier:', cartIdentifier);
    console.log('Item to add:', item);
    
    // Clean the item to ensure no unwanted fields
    const cleanItem = {
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '',
      variant: item.variant
    };
    
    console.log('Cleaned item:', cleanItem);
    
    // Find existing cart or create new one
    let cart;
    if (cartIdentifier.userId) {
      cart = await CartModel.findOne({ userId: cartIdentifier.userId });
    } else if (cartIdentifier.sessionId) {
      cart = await CartModel.findOne({ sessionId: cartIdentifier.sessionId });
    }
    
    if (!cart) {
      console.log('Creating new cart...');
      cart = await CartModel.create({
        ...(cartIdentifier.userId ? { userId: cartIdentifier.userId } : {}),
        ...(cartIdentifier.sessionId ? { sessionId: cartIdentifier.sessionId } : {}),
        items: [],
        total: 0,
        itemCount: 0
      });
      console.log('New cart created:', cart._id);
    } else {
      console.log('Found existing cart:', cart._id);
    }
    
    // Add item using model method
    console.log('Adding item to cart...');
    cart.addItem(cleanItem);
    
    console.log('Saving cart...');
    await cart.save();
    
    console.log('Cart saved successfully');
    return convertDocumentToCart(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    console.error("Error details:", {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    throw new Error("Gagal menambahkan item ke keranjang: " + (error as Error).message);
  }
}

// Remove item from cart
export async function removeItemFromCart(
  cartIdentifier: { userId?: string; sessionId?: string },
  itemId: string
): Promise<Cart | null> {
  try {
    await dbConnect();
    
    let cart;
    if (cartIdentifier.userId) {
      cart = await CartModel.findOne({ userId: cartIdentifier.userId });
    } else if (cartIdentifier.sessionId) {
      cart = await CartModel.findOne({ sessionId: cartIdentifier.sessionId });
    }
    
    if (!cart) {
      return null;
    }
    
    cart.removeItem(itemId);
    await cart.save();
    
    return convertDocumentToCart(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Gagal menghapus item dari keranjang: " + (error as Error).message);
  }
}

// Update item quantity
export async function updateCartItemQuantity(
  cartIdentifier: { userId?: string; sessionId?: string },
  itemId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    await dbConnect();
    
    let cart;
    if (cartIdentifier.userId) {
      cart = await CartModel.findOne({ userId: cartIdentifier.userId });
    } else if (cartIdentifier.sessionId) {
      cart = await CartModel.findOne({ sessionId: cartIdentifier.sessionId });
    }
    
    if (!cart) {
      return null;
    }
    
    cart.updateItemQuantity(itemId, quantity);
    await cart.save();
    
    return convertDocumentToCart(cart);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw new Error("Gagal mengupdate quantity: " + (error as Error).message);
  }
}

// Clear cart
export async function clearCart(
  cartIdentifier: { userId?: string; sessionId?: string }
): Promise<Cart | null> {
  try {
    await dbConnect();
    
    let cart;
    if (cartIdentifier.userId) {
      cart = await CartModel.findOne({ userId: cartIdentifier.userId });
    } else if (cartIdentifier.sessionId) {
      cart = await CartModel.findOne({ sessionId: cartIdentifier.sessionId });
    }
    
    if (!cart) {
      return null;
    }
    
    cart.clearItems();
    await cart.save();
    
    return convertDocumentToCart(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Gagal mengosongkan keranjang: " + (error as Error).message);
  }
}

// Merge guest cart to user cart (when user logs in)
export async function mergeGuestCartToUser(
  sessionId: string,
  userId: string
): Promise<Cart> {
  try {
    await dbConnect();
    
    // Get guest cart
    const guestCart = await CartModel.findOne({ sessionId });
    
    // Get or create user cart
    let userCart = await CartModel.findOne({ userId });
    
    if (!userCart) {
      userCart = await CartModel.create({
        userId,
        items: [],
        total: 0,
        itemCount: 0
      });
    }
    
    // Merge items from guest cart if exists
    if (guestCart && guestCart.items.length > 0) {
      for (const item of guestCart.items) {
        userCart.addItem({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variant: item.variant
        });
      }
      
      await userCart.save();
      
      // Delete guest cart
      await CartModel.findByIdAndDelete(guestCart._id);
    }
    
    return convertDocumentToCart(userCart);
  } catch (error) {
    console.error("Error merging guest cart to user:", error);
    throw new Error("Gagal menggabungkan keranjang: " + (error as Error).message);
  }
}