// src/types/common.ts
export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    errors?: ValidationError[];
  }
  
  export interface UploadResponse {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    type: string;
    folder: string;
  }
  
  export interface FileValidationOptions {
    maxSize?: number;
    allowedTypes?: string[];
    required?: boolean;
  }
  
  export interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }
  
  export interface SearchOptions {
    query?: string;
    filters?: Record<string, any>;
  }
  
  export interface DatabaseError extends Error {
    code?: string;
    statusCode?: number;
  }
  
  // Updated Category types to fix the CategorySelectOption interface
  export interface CategorySelectOption {
    label: string;
    value: string;
  }
  
  // Product related types (for future use)
  export interface ProductSelectOption {
    label: string;
    value: string;
    category?: string;
  }
  
  // Generic select option
  export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
  }
  
  // Service response types
  export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: ValidationError[];
  }
  
  // Statistics types
  export interface CategoryStats {
    total: number;
    active: number;
    inactive: number;
  }
  
  export interface ProductStats {
    total: number;
    active: number;
    inactive: number;
    draft: number;
  }
  
  // Form validation state
  export interface FormValidationState {
    isValid: boolean;
    errors: Record<string, string[]>;
    touched: Record<string, boolean>;
  }
  
  // Utility types
  export type Status = 'active' | 'inactive' | 'draft';
  export type SortOrder = 'asc' | 'desc';
  
  // Export all types from category.ts as well
  export * from './category';