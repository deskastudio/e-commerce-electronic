// lib/database/services/index.ts

// Export all services
export { ProductService } from './product-service';
export { CategoryService } from './category-service';
export { UploadService } from './upload-service';
export { ValidationService } from './validation-service';

// Export upload types
export type { UploadConfig, UploadResult } from './upload-service';

// Re-export common types for convenience
export type {
  Product,
  ProductFormValues,
  ProductSearchParams,
  ProductsPaginatedResponse,
  Category,
  CategoryFormValues,
  CategorySelectOption
} from '@/types';