// lib/database/services/product-service-main.ts
// This file replaces the old product-service.ts and provides backward compatibility
// while using the new organized service structure

import { ProductService, CategoryService, UploadService } from './index';
import { revalidatePath } from "next/cache";

// Re-export types for backward compatibility
export type {
  Product,
  ProductFormValues,
  Category,
  CategorySelectOption
} from '@/types';

/**
 * Get products with pagination (backward compatible)
 */
export async function getProductsPaginated(
  page: number = 1, 
  limit: number = 10
) {
  const result = await ProductService.getProductsPaginated(page, limit);
  
  // Revalidate cache
  revalidatePath('/admin/products');
  
  return result;
}

/**
 * Get all products (backward compatible)
 */
export async function getProducts() {
  return await ProductService.getAllProducts();
}

/**
 * Get product by ID (backward compatible)
 */
export async function getProductById(id: string) {
  return await ProductService.getProductById(id);
}

/**
 * Create product (backward compatible)
 */
export async function createProduct(data: any) {
  const result = await ProductService.createProduct(data);
  
  // Revalidate cache
  revalidatePath('/admin/products');
  
  return result;
}

/**
 * Update product (backward compatible)
 */
export async function updateProduct(id: string, data: any) {
  const result = await ProductService.updateProduct(id, data);
  
  // Revalidate cache
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  
  return result;
}

/**
 * Delete product (backward compatible)
 */
export async function deleteProduct(id: string) {
  const result = await ProductService.deleteProduct(id);
  
  // Revalidate cache
  revalidatePath('/admin/products');
  
  return result;
}

/**
 * Search products (backward compatible)
 */
export async function searchProducts(query: string) {
  return await ProductService.searchProducts(query);
}

/**
 * Get products by category (backward compatible)
 */
export async function getProductsByCategory(category: string) {
  return await ProductService.getProductsByCategory(category);
}

/**
 * Get products by status (backward compatible)
 */
export async function getProductsByStatus(status: string) {
  return await ProductService.getProductsByStatus(status as any);
}

/**
 * Upload product images (backward compatible)
 */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  return await UploadService.uploadProductImages(files);
}

/**
 * Get categories (backward compatible)
 */
export async function getCategories() {
  // Initialize default categories if none exist
  await CategoryService.initializeDefaultCategories();
  
  return await CategoryService.getCategoriesForSelect();
}

/**
 * Get low stock products
 */
export async function getLowStockProducts() {
  return await ProductService.getLowStockProducts();
}

/**
 * Update product stock
 */
export async function updateProductStock(id: string, quantity: number) {
  const result = await ProductService.updateProductStock(id, quantity);
  
  // Revalidate cache
  revalidatePath('/admin/products');
  
  return result;
}

/**
 * Get product statistics
 */
export async function getProductStats() {
  return await ProductService.getProductStats();
}

// Advanced functions using new services (not backward compatible, new features)

/**
 * Get products with advanced filtering and search
 */
export async function getProductsAdvanced(
  page: number = 1,
  limit: number = 10,
  searchParams: {
    query?: string;
    category?: string;
    status?: string;
  } = {}
) {
  return await ProductService.getProductsPaginated(page, limit, searchParams);
}

/**
 * Get categories with product count
 */
export async function getCategoriesWithCount() {
  return await CategoryService.getCategoriesWithProductCount();
}

/**
 * Manage category operations
 */
export const categoryOperations = {
  getAll: () => CategoryService.getAllCategories(),
  getActive: () => CategoryService.getActiveCategories(),
  getById: (id: string) => CategoryService.getCategoryById(id),
  getBySlug: (slug: string) => CategoryService.getCategoryBySlug(slug),
  create: (data: any) => CategoryService.createCategory(data),
  update: (id: string, data: any) => CategoryService.updateCategory(id, data),
  delete: (id: string) => CategoryService.deleteCategory(id),
};

/**
 * Manage upload operations
 */
export const uploadOperations = {
  uploadProductImages: (files: File[]) => UploadService.uploadProductImages(files),
  uploadCategoryImage: (file: File) => UploadService.uploadCategoryImage(file),
  deleteFile: (path: string) => UploadService.deleteFile(path),
  deleteFiles: (paths: string[]) => UploadService.deleteFiles(paths),
  getFileInfo: (path: string) => UploadService.getFileInfo(path),
  getUploadStats: (subDir?: string) => UploadService.getUploadStats(subDir),
  cleanupOrphaned: (referenced: string[], subDir?: string) => 
    UploadService.cleanupOrphanedFiles(referenced, subDir),
};

// Export services for direct access if needed
export { ProductService, CategoryService, UploadService };