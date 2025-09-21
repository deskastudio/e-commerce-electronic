// lib/database/models/Cart.ts - FIXED CART MODEL
import mongoose, { Schema, Document } from 'mongoose';
import { Cart, CartItem } from '@/types/cart';

// Mongoose Document Interface
export interface ICartItem {
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
  addedAt: Date;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addItem(item: Omit<CartItem, 'id' | 'addedAt'>): void;
  removeItem(itemId: string): void;
  updateItemQuantity(itemId: string, quantity: number): void;
  clearItems(): void;
  calculateTotals(): void;
}

// Cart Item Schema
const CartItemSchema = new Schema<ICartItem>({
  productId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    // FIXED: Ensure price is always a number
    set: function(value: any) {
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof value === 'number' ? value : 0;
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    // FIXED: Ensure quantity is always a positive integer
    set: function(value: any) {
      if (typeof value === 'string') {
        const parsed = parseInt(value);
        return isNaN(parsed) || parsed < 1 ? 1 : parsed;
      }
      return typeof value === 'number' && value >= 1 ? Math.floor(value) : 1;
    }
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  variant: {
    type: Schema.Types.Mixed,
    default: {}
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Main Cart Schema
const CartSchema = new Schema<ICart>({
  userId: {
    type: String,
    sparse: true,
    index: true
  },
  sessionId: {
    type: String,
    sparse: true,
    index: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: 0,
    // FIXED: Ensure total is always a number
    set: function(value: any) {
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof value === 'number' ? value : 0;
    }
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0,
    // FIXED: Ensure itemCount is always a number
    set: function(value: any) {
      if (typeof value === 'string') {
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof value === 'number' ? Math.floor(value) : 0;
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // FIXED: Ensure proper data types in JSON output
      ret.id = ret._id.toString();
      ret.total = Number(ret.total) || 0;
      ret.itemCount = Number(ret.itemCount) || 0;
      ret.items = ret.items.map((item: any) => ({
        ...item,
        id: item._id.toString(),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        addedAt: item.addedAt.toISOString()
      }));
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });
CartSchema.index({ updatedAt: -1 });

// Ensure either userId or sessionId is present
CartSchema.pre('validate', function(next) {
  if (!this.userId && !this.sessionId) {
    this.invalidate('userId', 'Either userId or sessionId must be provided');
  }
  next();
});

// Calculate totals before saving
CartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

// Instance Methods
CartSchema.methods.addItem = function(item: Omit<CartItem, 'id' | 'addedAt'>) {
  console.log('📦 Adding item to cart:', item);
  
  // FIXED: Ensure price and quantity are numbers
  const safePrice = typeof item.price === 'number' ? item.price : parseFloat(item.price as string) || 0;
  const safeQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity as string) || 1;
  
  // Find existing item with same productId and variant
  const existingItemIndex = this.items.findIndex((cartItem: ICartItem) => {
    return cartItem.productId === item.productId &&
           JSON.stringify(cartItem.variant || {}) === JSON.stringify(item.variant || {});
  });

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += safeQuantity;
    console.log('✅ Updated existing item quantity');
  } else {
    // Add new item
    const newItem = {
      productId: item.productId,
      name: item.name,
      price: safePrice,
      quantity: safeQuantity,
      image: item.image || '',
      variant: item.variant || {},
      addedAt: new Date()
    };
    
    this.items.push(newItem);
    console.log('✅ Added new item to cart');
  }

  this.calculateTotals();
};

CartSchema.methods.removeItem = function(itemId: string) {
  console.log('🗑️ Removing item from cart:', itemId);
  
  this.items = this.items.filter((item: any) => 
    item._id.toString() !== itemId && item.id !== itemId
  );
  
  this.calculateTotals();
  console.log('✅ Item removed from cart');
};

CartSchema.methods.updateItemQuantity = function(itemId: string, quantity: number) {
  console.log('🔄 Updating item quantity:', itemId, quantity);
  
  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  
  const item = this.items.find((item: any) => 
    item._id.toString() === itemId || item.id === itemId
  );

  if (item) {
    item.quantity = safeQuantity;
    this.calculateTotals();
    console.log('✅ Item quantity updated');
  } else {
    console.warn('⚠️ Item not found for quantity update');
  }
};

CartSchema.methods.clearItems = function() {
  console.log('🗑️ Clearing all cart items');
  this.items = [];
  this.calculateTotals();
  console.log('✅ Cart cleared');
};

CartSchema.methods.calculateTotals = function() {
  let total = 0;
  let itemCount = 0;

  for (const item of this.items) {
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 1;
    
    total += itemPrice * itemQuantity;
    itemCount += itemQuantity;
  }

  this.total = Math.round(total * 100) / 100; // Round to 2 decimal places
  this.itemCount = itemCount;

  console.log('🧮 Cart totals calculated:', {
    total: this.total,
    itemCount: this.itemCount,
    itemsLength: this.items.length
  });
};

// Helper function to convert mongoose document to Cart type
export function convertDocumentToCart(doc: ICart): Cart {
  const cartObject = doc.toJSON();
  
  return {
    id: cartObject.id,
    userId: cartObject.userId,
    sessionId: cartObject.sessionId,
    items: cartObject.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || '',
      variant: item.variant || {},
      addedAt: item.addedAt
    })),
    total: Number(cartObject.total) || 0,
    itemCount: Number(cartObject.itemCount) || 0,
    updatedAt: cartObject.updatedAt
  };
}

// Prevent duplicate model registration
const CartModel = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default CartModel;