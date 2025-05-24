// lib/database/services/category-service.ts
import { Category, CategoryFormValues, CategorySelectOption } from '@/types';
import { CategoryModel, ProductModel } from '@/lib/database/models';
import connectDB from '@/lib/database/connection';
import { 
  handleDatabaseError, 
  isValidObjectId,
  documentToObject 
} from '@/lib/database/utils';

export class CategoryService {
  /**
   * Ensure database connection
   */
  private static async connect() {
    await connectDB();
  }

  /**
   * Get all categories
   */
  static async getAllCategories(): Promise<Category[]> {
    try {
      await this.connect();
      
      const categories = await CategoryModel
        .find()
        .sort({ name: 1 })
        .lean();

      return categories.map(doc => documentToObject(doc));
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  }

  /**
   * Get active categories only
   */
  static async getActiveCategories(): Promise<Category[]> {
    try {
      await this.connect();
      
      const categories = await CategoryModel
        .find({ isActive: true })
        .sort({ name: 1 })
        .lean();

      return categories.map(doc => documentToObject(doc));
    } catch (error) {
      console.error("Error getting active categories:", error);
      return [];
    }
  }

  /**
   * Get categories for select options (simplified)
   */
  static async getCategoriesForSelect(): Promise<CategorySelectOption[]> {
    try {
      await this.connect();
      
      const categories = await CategoryModel
        .find({ isActive: true })
        .select('name slug')
        .sort({ name: 1 })
        .lean();

      return categories.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug
      }));
    } catch (error) {
      console.error("Error getting categories for select:", error);
      return this.getDefaultCategories();
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        return null;
      }

      const category = await CategoryModel.findById(id).lean();
      
      if (!category) {
        return null;
      }

      return documentToObject(category);
    } catch (error) {
      console.error(`Error getting category with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      await this.connect();

      const category = await CategoryModel
        .findOne({ slug, isActive: true })
        .lean();
      
      if (!category) {
        return null;
      }

      return documentToObject(category);
    } catch (error) {
      console.error(`Error getting category with slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Create new category
   */
  static async createCategory(data: CategoryFormValues): Promise<Category> {
    try {
      await this.connect();

      // Validate required fields
      this.validateCategoryData(data);

      // Auto-generate slug if not provided
      if (!data.slug) {
        data.slug = this.generateSlug(data.name);
      }

      const newCategory = await CategoryModel.create(data);
      return documentToObject(newCategory);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Update category
   */
  static async updateCategory(id: string, data: CategoryFormValues): Promise<Category | null> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        throw new Error('ID kategori tidak valid');
      }

      // Validate required fields
      this.validateCategoryData(data);

      const updatedCategory = await CategoryModel
        .findByIdAndUpdate(id, data, { 
          new: true, 
          runValidators: true 
        })
        .lean();

      if (!updatedCategory) {
        return null;
      }

      return documentToObject(updatedCategory);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        return false;
      }

      // Check if category has products
      const category = await CategoryModel.findById(id);
      if (!category) {
        return false;
      }

      const productCount = await ProductModel.countDocuments({ 
        category: category.slug 
      });

      if (productCount > 0) {
        throw new Error(`Tidak dapat menghapus kategori yang masih memiliki ${productCount} produk`);
      }

      const result = await CategoryModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error(`Error deleting category with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Get categories with product count
   */
  static async getCategoriesWithProductCount(): Promise<(Category & { productCount: number })[]> {
    try {
      await this.connect();

      const categories = await CategoryModel
        .find()
        .sort({ name: 1 })
        .lean();

      // Get product count for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const productCount = await ProductModel.countDocuments({ 
            category: category.slug,
            status: 'active'
          });

          return {
            ...documentToObject(category),
            productCount
          };
        })
      );

      return categoriesWithCount;
    } catch (error) {
      console.error("Error getting categories with product count:", error);
      return [];
    }
  }

  /**
   * Initialize default categories if none exist
   */
  static async initializeDefaultCategories(): Promise<void> {
    try {
      await this.connect();

      const count = await CategoryModel.countDocuments();
      
      if (count === 0) {
        const defaultCategories = [
          { 
            name: "Gaming", 
            slug: "gaming", 
            description: "Produk untuk gaming dan hiburan",
            isActive: true
          },
          { 
            name: "Accessories", 
            slug: "accessories", 
            description: "Aksesori elektronik dan komputer",
            isActive: true
          },
          { 
            name: "Monitors", 
            slug: "monitors", 
            description: "Monitor dan display berkualitas",
            isActive: true
          },
          { 
            name: "Components", 
            slug: "components", 
            description: "Komponen dan spare part komputer",
            isActive: true
          },
          { 
            name: "Laptops", 
            slug: "laptops", 
            description: "Laptop dan notebook terbaru",
            isActive: true
          },
          { 
            name: "Peripherals", 
            slug: "peripherals", 
            description: "Periferal komputer dan gaming",
            isActive: true
          }
        ];

        await CategoryModel.insertMany(defaultCategories);
        console.log('✅ Default categories initialized');
      }
    } catch (error) {
      console.error("Error initializing default categories:", error);
    }
  }

  /**
   * Get default categories (fallback)
   */
  private static getDefaultCategories(): CategorySelectOption[] {
    return [
      { id: "gaming", name: "Gaming", slug: "gaming" },
      { id: "accessories", name: "Accessories", slug: "accessories" },
      { id: "monitors", name: "Monitors", slug: "monitors" },
      { id: "components", name: "Components", slug: "components" },
      { id: "laptops", name: "Laptops", slug: "laptops" },
      { id: "peripherals", name: "Peripherals", slug: "peripherals" }
    ];
  }

  /**
   * Generate slug from name
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  /**
   * Validate category data
   */
  private static validateCategoryData(data: CategoryFormValues): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Nama kategori harus diisi');
    }

    if (data.name.length > 100) {
      throw new Error('Nama kategori maksimal 100 karakter');
    }

    if (data.slug && data.slug.length > 100) {
      throw new Error('Slug kategori maksimal 100 karakter');
    }

    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      throw new Error('Slug hanya boleh menggunakan huruf kecil, angka, dan tanda hubung');
    }

    if (data.description && data.description.length > 500) {
      throw new Error('Deskripsi kategori maksimal 500 karakter');
    }
  }
}