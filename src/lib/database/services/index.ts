// lib/database/services/index.ts
export { CategoryService } from './category-service';
export { UploadService } from './upload-service';
export { ValidationService } from './validation-service';

// Product service placeholder for future use
export class ProductService {
  static async getProductStats() {
    // Placeholder implementation
    return {
      total: 0,
      active: 0,
      inactive: 0,
      draft: 0
    };
  }

  static async getProductsByCategory(categoryId: string) {
    // Placeholder implementation
    return [];
  }
}

// Re-export types
export type {
  ValidationError,
  ApiResponse,
  UploadResponse,
  FileValidationOptions,
  CategoryStats,
  ProductStats
} from '@/types';