// lib/database/models/index.ts
import connectDB from '../connection';

// Ensure database connection before loading models
let modelsInitialized = false;

async function initializeModels() {
  if (modelsInitialized) return;
  
  try {
    await connectDB();
    modelsInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw error;
  }
}

// Lazy load models to avoid circular dependencies and ensure connection
function getProductModel() {
  try {
    return require('./Product').default;
  } catch (error) {
    console.error('Error loading Product model:', error);
    throw error;
  }
}

function getCategoryModel() {
  try {
    return require('./Category').default;
  } catch (error) {
    console.error('Error loading Category model:', error);
    throw error;
  }
}

// Export models with lazy loading
export const ProductModel = new Proxy({} as any, {
  get(target, prop) {
    const model = getProductModel();
    return model[prop];
  }
});

export const CategoryModel = new Proxy({} as any, {
  get(target, prop) {
    const model = getCategoryModel();
    return model[prop];
  }
});

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

// Initialize models function for manual initialization
export { initializeModels };

// Default export for backward compatibility
export default {
  ProductModel,
  CategoryModel,
  initializeModels
};