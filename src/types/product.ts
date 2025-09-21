// types/product.ts - Product type definition dengan fallbacks
export interface Product {
  id?: string;
  _id?: string; // MongoDB ObjectId
  name?: string;
  description?: string;
  brand?: string;
  model?: string;
  sku?: string;
  price?: number;
  stock?: number;
  condition?: 'new' | 'refurbished' | 'used-like-new' | 'used-good';
  category?: string;
  subcategory?: string;
  images?: string[];
  warranty?: string;
  status?: 'active' | 'inactive' | 'draft';
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional properties
}

// Helper function to get product ID (handle both id and _id)
export function getProductId(product: Product): string {
  return product.id || product._id || '';
}

// Helper function to get product name with fallback
export function getProductName(product: Product): string {
  return product.name || 'Produk Tidak Dikenal';
}

// Helper function to get product price with fallback
export function getProductPrice(product: Product): number {
  return typeof product.price === 'number' ? product.price : 0;
}

// Helper function to get product stock with fallback
export function getProductStock(product: Product): number {
  return typeof product.stock === 'number' ? product.stock : 0;
}

// Helper function to validate product for cart
export function validateProductForCart(product: Product): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const id = getProductId(product);
  const name = getProductName(product);
  const price = getProductPrice(product);
  
  if (!id) {
    errors.push('Product ID tidak ditemukan');
  }
  
  if (!name || name === 'Produk Tidak Dikenal') {
    errors.push('Nama produk tidak valid');
  }
  
  if (price <= 0) {
    errors.push('Harga produk tidak valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}