// lib/database/models/index.ts

// Export models
export { default as ProductModel } from './Product';
export { default as CategoryModel } from './Category';

// Export document interfaces
export type { ProductDocument } from './Product';
export type { CategoryDocument } from './Category';

// Re-export types from types folder
export type {
  Product,
  ProductStatus,
  ProductFormValues,
  Category,
  CategoryFormValues
} from '@/types';