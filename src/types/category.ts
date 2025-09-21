// types/category.ts
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CategoryWithProductCount extends Category {
    productCount: number;
  }
  
  export interface CategoryFormData {
    name: string;
    description?: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export interface CategoryStats {
    total: number;
    withProducts: number;
    totalProducts: number;
  }
  
  // For MongoDB document type
  export interface ICategoryDocument {
    _id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }