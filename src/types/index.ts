// src/types/index.ts

// Product Types
export type {
    Product,
    ProductStatus,
    ProductFormValues,
    ProductSearchParams,
    ProductsPaginatedResponse,
  } from './product'
  
  // Category Types  
  export type {
    Category,
    CategoryFormValues,
    CategorySelectOption,
  } from './category'
  
  // Common Types
  export type {
    PaginationParams,
    PaginatedResponse,
    ApiResponse,
    ValidationError,
    SearchParams,
  } from './common'