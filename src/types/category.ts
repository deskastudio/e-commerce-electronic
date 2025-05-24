// src/types/category.ts
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
    productCount?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CategoryFormValues {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }
  
  export interface CategorySelectOption {
    id: string;
    name: string;
    slug: string;
  }