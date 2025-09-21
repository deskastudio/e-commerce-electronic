// lib/database/services/category-service.ts - Updated with Product integration
import connectDB from '@/lib/database/connection';
import CategoryModel from '@/lib/database/models/Category';
import { CategorySelectOption } from '@/types/product';

interface CategoryFormData {
  name: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryWithProductCount extends Category {
  productCount: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class CategoryService {
  private static baseUrl = '/api/categories';

  /**
   * Connect to database
   */
  private static async connect() {
    await connectDB();
  }

  /**
   * Get all categories with product count
   */
  static async getCategories(): Promise<CategoryWithProductCount[]> {
    try {
      console.log('🔄 CategoryService.getCategories() - Starting...');
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', response.status, response.statusText);
        console.error('❌ Error body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<CategoryWithProductCount[]> = await response.json();
      console.log('📥 API Response:', result);

      if (!result.success) {
        console.error('❌ API returned error:', result.error);
        throw new Error(result.error || result.message || 'Failed to fetch categories');
      }

      console.log('✅ Categories fetched successfully:', result.data?.length || 0, 'items');
      return result.data || [];
    } catch (error) {
      console.error('❌ CategoryService.getCategories() error:', error);
      throw error;
    }
  }

  /**
   * Get categories for select dropdown (server-side)
   */
  static async getCategoriesForSelect(): Promise<CategorySelectOption[]> {
    try {
      console.log('🔄 CategoryService.getCategoriesForSelect() - Starting...');
      
      await this.connect();
      
      const categories = await CategoryModel
        .find()
        .select('_id name slug')
        .sort({ name: 1 })
        .lean();

      const selectOptions: CategorySelectOption[] = categories.map(category => ({
        id: category._id.toString(),
        name: category.name,
        slug: category.slug
      }));

      console.log('✅ Categories for select fetched:', selectOptions.length, 'items');
      return selectOptions;
    } catch (error) {
      console.error('❌ CategoryService.getCategoriesForSelect() error:', error);
      return [];
    }
  }

  /**
   * Get categories for select dropdown (client-side via API)
   */
  static async getCategoriesForSelectAPI(): Promise<CategorySelectOption[]> {
    try {
      console.log('🔄 CategoryService.getCategoriesForSelectAPI() - Starting...');
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<CategoryWithProductCount[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories');
      }

      const selectOptions: CategorySelectOption[] = (result.data || []).map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug
      }));

      console.log('✅ Categories for select API fetched:', selectOptions.length, 'items');
      return selectOptions;
    } catch (error) {
      console.error('❌ CategoryService.getCategoriesForSelectAPI() error:', error);
      return [];
    }
  }

  /**
   * Initialize default categories if none exist
   */
  static async initializeDefaultCategories(): Promise<void> {
    try {
      console.log('🔄 CategoryService.initializeDefaultCategories() - Starting...');
      
      await this.connect();
      
      const existingCount = await CategoryModel.countDocuments();
      
      if (existingCount > 0) {
        console.log('✅ Categories already exist, skipping initialization');
        return;
      }

      const defaultCategories = [
        {
          name: 'Gaming',
          description: 'Produk gaming dan aksesoris',
        },
        {
          name: 'Elektronik',
          description: 'Perangkat elektronik dan gadget',
        },
        {
          name: 'Komputer',
          description: 'Komputer dan aksesoris',
        },
        {
          name: 'Aksesoris',
          description: 'Aksesoris dan perlengkapan',
        }
      ];

      await CategoryModel.insertMany(defaultCategories);
      console.log('✅ Default categories initialized:', defaultCategories.length, 'categories');
    } catch (error) {
      console.error('❌ CategoryService.initializeDefaultCategories() error:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Get single category by ID
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      console.log('🔄 CategoryService.getCategoryById() - Starting...');
      console.log('📥 Category ID:', id);

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      console.log('📡 Response status:', response.status);

      if (response.status === 404) {
        console.log('📭 Category not found');
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', response.status, response.statusText);
        console.error('❌ Error body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<Category> = await response.json();
      console.log('📥 API Response:', result);

      if (!result.success) {
        console.error('❌ API returned error:', result.error);
        throw new Error(result.error || result.message || 'Failed to fetch category');
      }

      console.log('✅ Category fetched successfully:', result.data?.id);
      return result.data || null;
    } catch (error) {
      console.error('❌ CategoryService.getCategoryById() error:', error);
      throw error;
    }
  }

  /**
   * Create new category
   */
  static async createCategory(data: CategoryFormData): Promise<Category> {
    try {
      console.log('🔄 CategoryService.createCategory() - Starting...');
      console.log('📤 Input data:', JSON.stringify(data, null, 2));

      // Client-side validation
      if (!data.name || data.name.trim().length === 0) {
        const error = new Error('Nama kategori harus diisi');
        console.error('❌ Validation error:', error.message);
        throw error;
      }

      if (data.name.trim().length > 100) {
        const error = new Error('Nama kategori maksimal 100 karakter');
        console.error('❌ Validation error:', error.message);
        throw error;
      }

      if (data.description && data.description.trim().length > 500) {
        const error = new Error('Deskripsi maksimal 500 karakter');
        console.error('❌ Validation error:', error.message);
        throw error;
      }

      console.log('✅ Client-side validation passed');

      const requestBody = {
        name: data.name.trim(),
        description: data.description?.trim() || ''
      };

      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      console.log('📤 Sending request to:', this.baseUrl);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text();
      console.log('📥 Raw response body:', responseText);

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        console.error('❌ Response body:', responseText);
        
        // Try to parse as JSON for error details
        try {
          const errorData = JSON.parse(responseText);
          const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        } catch (parseError) {
          // If not JSON, use status text
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Parse successful response
      let result: ApiResponse<Category>;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed response:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!result.success) {
        console.error('❌ API returned error:', result.error);
        throw new Error(result.error || result.message || 'Failed to create category');
      }

      if (!result.data) {
        console.error('❌ API returned no data');
        throw new Error('No data returned from server');
      }

      console.log('✅ Category created successfully:', result.data.id);
      console.log('📋 Created category details:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ CategoryService.createCategory() error:', error);
      
      // Re-throw with more context if needed
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while creating category');
      }
    }
  }

  /**
   * Update category by ID
   */
  static async updateCategory(id: string, data: CategoryFormData): Promise<Category> {
    try {
      console.log('🔄 CategoryService.updateCategory() - Starting...');
      console.log('📥 Category ID:', id);
      console.log('📤 Input data:', JSON.stringify(data, null, 2));

      // Client-side validation
      if (!data.name || data.name.trim().length === 0) {
        const error = new Error('Nama kategori harus diisi');
        console.error('❌ Validation error:', error.message);
        throw error;
      }

      if (data.name.trim().length > 100) {
        const error = new Error('Nama kategori maksimal 100 karakter');
        console.error('❌ Validation error:', error.message);
        throw error;
      }

      if (data.description && data.description.trim().length > 500) {
        const error = new Error('Deskripsi maksimal 500 karakter');
        console.error('❌ Validation error:', error.message);
        throw error;
      }

      console.log('✅ Client-side validation passed');

      const requestBody = {
        name: data.name.trim(),
        description: data.description?.trim() || ''
      };

      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('📥 Raw response body:', responseText);

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        
        try {
          const errorData = JSON.parse(responseText);
          const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      let result: ApiResponse<Category>;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed response:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!result.success) {
        console.error('❌ API returned error:', result.error);
        throw new Error(result.error || result.message || 'Failed to update category');
      }

      if (!result.data) {
        console.error('❌ API returned no data');
        throw new Error('No data returned from server');
      }

      console.log('✅ Category updated successfully:', result.data.id);
      return result.data;
    } catch (error) {
      console.error('❌ CategoryService.updateCategory() error:', error);
      throw error;
    }
  }

  /**
   * Delete category by ID
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      console.log('🔄 CategoryService.deleteCategory() - Starting...');
      console.log('📥 Category ID:', id);

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('📥 Raw response body:', responseText);

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        
        try {
          const errorData = JSON.parse(responseText);
          const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      let result: ApiResponse;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed response:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!result.success) {
        console.error('❌ API returned error:', result.error);
        throw new Error(result.error || result.message || 'Failed to delete category');
      }

      console.log('✅ Category deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ CategoryService.deleteCategory() error:', error);
      throw error;
    }
  }

  /**
   * Get category statistics
   */
  static async getStats(): Promise<{ total: number; withProducts: number }> {
    try {
      console.log('🔄 CategoryService.getStats() - Starting...');
      const categories = await this.getCategories();
      
      const stats = {
        total: categories.length,
        withProducts: categories.filter(cat => cat.productCount > 0).length
      };

      console.log('✅ Stats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ CategoryService.getStats() error:', error);
      return { total: 0, withProducts: 0 };
    }
  }
}