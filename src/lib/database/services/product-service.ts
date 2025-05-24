// lib/database/services/product-service.ts
import { 
  Product, 
  ProductFormValues, 
  ProductSearchParams,
  ProductsPaginatedResponse,
  ProductStatus 
} from '@/types';
import { ProductModel } from '@/lib/database/models';
import connectDB from '@/lib/database/connection';
import { 
  executePaginatedQuery, 
  handleDatabaseError, 
  isValidObjectId,
  buildSearchQuery,
  buildFilterQuery,
  documentToObject
} from '@/lib/database/utils';

export class ProductService {
  /**
   * Ensure database connection
   */
  private static async connect() {
    await connectDB();
  }

  /**
   * Get all products with pagination and filters
   */
  static async getProductsPaginated(
    page: number = 1,
    limit: number = 10,
    searchParams: ProductSearchParams = {}
  ): Promise<ProductsPaginatedResponse> {
    try {
      await this.connect();

      const { query, category, status } = searchParams;
      
      // Build filter query
      const filters: Record<string, any> = {};
      
      if (category && category !== 'all') {
        filters.category = category;
      }
      
      if (status && status !== 'all') {
        filters.status = status;
      }

      // Build search query
      let searchQuery = {};
      if (query && query.trim()) {
        searchQuery = buildSearchQuery(query.trim(), ['name', 'description', 'sku']);
      }

      // Combine filters and search
      const finalQuery = { ...filters, ...searchQuery };

      // Execute paginated query
      const result = await executePaginatedQuery(
        ProductModel,
        finalQuery,
        {
          page,
          limit,
          sort: { createdAt: -1 }
        }
      );

      // Convert documents to plain objects
      const products = result.data.map(doc => documentToObject(doc));

      return {
        products,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get all products (without pagination)
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      await this.connect();
      
      const products = await ProductModel
        .find({ status: 'active' })
        .sort({ createdAt: -1 })
        .lean();

      return products.map(doc => documentToObject(doc));
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        return null;
      }

      const product = await ProductModel.findById(id).lean();
      
      if (!product) {
        return null;
      }

      return documentToObject(product);
    } catch (error) {
      console.error(`Error getting product with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Create new product
   */
  static async createProduct(data: ProductFormValues): Promise<Product> {
    try {
      await this.connect();

      // Validate required fields
      this.validateProductData(data);

      // Set default values
      const productData = {
        ...data,
        images: data.images.length > 0 ? data.images : ["/placeholder.svg"],
        tags: data.tags || [],
        isPhysical: data.isPhysical ?? true,
        isTaxable: data.isTaxable ?? true,
        isShippingRequired: data.isShippingRequired ?? true
      };

      const newProduct = await ProductModel.create(productData);
      return documentToObject(newProduct);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, data: ProductFormValues): Promise<Product | null> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        throw new Error('ID produk tidak valid');
      }

      // Validate required fields
      this.validateProductData(data);

      const updateData = {
        ...data,
        images: data.images.length > 0 ? data.images : ["/placeholder.svg"],
        tags: data.tags || []
      };

      const updatedProduct = await ProductModel
        .findByIdAndUpdate(id, updateData, { 
          new: true, 
          runValidators: true 
        })
        .lean();

      if (!updatedProduct) {
        return null;
      }

      return documentToObject(updatedProduct);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        return false;
      }

      const result = await ProductModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Search products
   */
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      await this.connect();

      if (!query.trim()) {
        return [];
      }

      const searchQuery = buildSearchQuery(query.trim(), ['name', 'description', 'sku']);
      const products = await ProductModel
        .find({ ...searchQuery, status: 'active' })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      return products.map(doc => documentToObject(doc));
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      await this.connect();

      const products = await ProductModel
        .find({ category, status: 'active' })
        .sort({ createdAt: -1 })
        .lean();

      return products.map(doc => documentToObject(doc));
    } catch (error) {
      console.error(`Error getting products in category ${category}:`, error);
      return [];
    }
  }

  /**
   * Get products by status
   */
  static async getProductsByStatus(status: ProductStatus): Promise<Product[]> {
    try {
      await this.connect();

      const products = await ProductModel
        .find({ status })
        .sort({ createdAt: -1 })
        .lean();

      return products.map(doc => documentToObject(doc));
    } catch (error) {
      console.error(`Error getting products with status ${status}:`, error);
      return [];
    }
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(threshold: number = 5): Promise<Product[]> {
    try {
      await this.connect();

      const products = await ProductModel
        .find({ 
          stock: { $lte: threshold }, 
          status: 'active' 
        })
        .sort({ stock: 1 })
        .lean();

      return products.map(doc => documentToObject(doc));
    } catch (error) {
      console.error("Error getting low stock products:", error);
      return [];
    }
  }

  /**
   * Update product stock
   */
  static async updateProductStock(id: string, quantity: number): Promise<Product | null> {
    try {
      await this.connect();

      if (!isValidObjectId(id)) {
        throw new Error('ID produk tidak valid');
      }

      const updatedProduct = await ProductModel
        .findByIdAndUpdate(
          id, 
          { $inc: { stock: quantity } }, 
          { new: true, runValidators: true }
        )
        .lean();

      if (!updatedProduct) {
        return null;
      }

      return documentToObject(updatedProduct);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get product statistics
   */
  static async getProductStats(): Promise<{
    total: number;
    active: number;
    draft: number;
    archived: number;
    lowStock: number;
  }> {
    try {
      await this.connect();

      const [total, active, draft, archived, lowStock] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.countDocuments({ status: 'active' }),
        ProductModel.countDocuments({ status: 'draft' }),
        ProductModel.countDocuments({ status: 'archived' }),
        ProductModel.countDocuments({ stock: { $lte: 5 }, status: 'active' })
      ]);

      return {
        total,
        active,
        draft,
        archived,
        lowStock
      };
    } catch (error) {
      console.error("Error getting product stats:", error);
      return {
        total: 0,
        active: 0,
        draft: 0,
        archived: 0,
        lowStock: 0
      };
    }
  }

  /**
   * Validate product data
   */
  private static validateProductData(data: ProductFormValues): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Nama produk harus diisi');
    }

    if (!data.description || data.description.trim() === '') {
      throw new Error('Deskripsi produk harus diisi');
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new Error('Harga produk harus berupa angka positif');
    }

    if (data.discountPrice !== undefined) {
      if (typeof data.discountPrice !== 'number' || data.discountPrice < 0) {
        throw new Error('Harga diskon harus berupa angka non-negatif');
      }
      if (data.discountPrice >= data.price) {
        throw new Error('Harga diskon harus lebih kecil dari harga normal');
      }
    }

    if (typeof data.stock !== 'number' || data.stock < 0) {
      throw new Error('Stok harus berupa angka non-negatif');
    }

    if (!data.category || data.category.trim() === '') {
      throw new Error('Kategori harus dipilih');
    }

    const validStatuses: ProductStatus[] = ['active', 'draft', 'archived'];
    if (!validStatuses.includes(data.status)) {
      throw new Error(`Status harus salah satu dari: ${validStatuses.join(', ')}`);
    }

    if (!data.images || data.images.length === 0) {
      throw new Error('Minimal satu gambar produk harus diunggah');
    }

    if (data.images.length > 5) {
      throw new Error('Maksimal 5 gambar yang dapat diunggah');
    }
  }
}