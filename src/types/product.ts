// src/types/product.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    cost?: number;
    sku?: string;
    barcode?: string;
    stock: number;
    category: string;
    status: ProductStatus;
    tags: string[];
    images: string[];
    
    // Additional product properties
    isPhysical?: boolean;
    isTaxable?: boolean;
    isShippingRequired?: boolean;
    
    // Metadata
    createdAt: string;
    updatedAt: string;
  }
  
  export type ProductStatus = 'active' | 'draft' | 'archived';
  
  export interface ProductFormValues {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    cost?: number;
    sku?: string;
    barcode?: string;
    stock: number;
    category: string;
    status: ProductStatus;
    tags?: string[];
    images: string[];
    isPhysical?: boolean;
    isTaxable?: boolean;
    isShippingRequired?: boolean;
  }
  
  export interface ProductSearchParams {
    page?: string;
    query?: string;
    category?: string;
    status?: string;
    limit?: string;
  }
  
  export interface ProductsPaginatedResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }