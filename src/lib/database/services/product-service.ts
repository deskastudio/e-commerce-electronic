// lib/database/services/product-service.ts - Restored Original with Minimal Category Integration
import { Product, ProductFormValues, ProductSearchParams } from '@/types/product';
import connectDB from '@/lib/database/connection';
import mongoose from 'mongoose';

// Import Product model safely
function getProductModel() {
  try {
    return mongoose.models.Product || require('@/lib/database/models/Product').default;
  } catch (error) {
    console.error('Error loading Product model:', error);
    throw new Error('Product model not found');
  }
}

export class ProductService {
  
  private static async connect() {
    await connectDB();
  }

  /**
   * Get products with pagination and filters
   */
  static async getProductsPaginated(
    page: number = 1,
    limit: number = 10,
    searchParams: ProductSearchParams = {}
  ) {
    try {
      console.log('🔄 ProductService.getProductsPaginated() - Starting...');
      console.log('📥 Params:', { page, limit, searchParams });
      
      await this.connect();
      const ProductModel = getProductModel();

      const { query, category, status, brand, condition } = searchParams;
      
      // Build filters
      const filters: Record<string, any> = {};
      
      if (category && category !== 'all') {
        filters.category = category;
        console.log('📋 Adding category filter:', category);
      }
      
      if (status && status !== 'all') {
        filters.status = status;
        console.log('📋 Adding status filter:', status);
      }

      if (brand && brand !== 'all') {
        filters.brand = new RegExp(brand, 'i');
        console.log('📋 Adding brand filter:', brand);
      }

      if (condition && condition !== 'all') {
        filters.condition = condition;
        console.log('📋 Adding condition filter:', condition);
      }

      // Build search query
      if (query && query.trim()) {
        filters.$or = [
          { name: { $regex: query.trim(), $options: 'i' } },
          { description: { $regex: query.trim(), $options: 'i' } },
          { brand: { $regex: query.trim(), $options: 'i' } },
          { model: { $regex: query.trim(), $options: 'i' } },
          { sku: { $regex: query.trim(), $options: 'i' } }
        ];
        console.log('📋 Adding search query:', query.trim());
      }

      const skip = (page - 1) * limit;
      console.log('📋 Pagination:', { skip, limit });

      // Execute queries
      const [products, total] = await Promise.all([
        ProductModel
          .find(filters)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ProductModel.countDocuments(filters)
      ]);

      const totalPages = Math.ceil(total / limit);

      console.log('✅ Products fetched:', products.length, 'of', total);
      
      // Debug: Log first product to see structure
      if (products.length > 0) {
        console.log('🔍 First product structure:', JSON.stringify(products[0], null, 2));
      }

      return {
        products: products.map(this.formatProduct),
        total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('❌ ProductService.getProductsPaginated() error:', error);
      throw new Error(`Gagal mengambil data produk: ${(error as Error).message}`);
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      console.log('🔄 ProductService.getProductById() - Starting...');
      console.log('📥 Product ID:', id);
      
      await this.connect();
      const ProductModel = getProductModel();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('❌ Invalid ObjectId format');
        return null;
      }

      const product = await ProductModel.findById(id).lean();
      
      if (!product) {
        console.log('📭 Product not found');
        return null;
      }

      console.log('✅ Raw product from DB:', JSON.stringify(product, null, 2));
      const formattedProduct = this.formatProduct(product);
      console.log('✅ Formatted product:', JSON.stringify(formattedProduct, null, 2));
      
      return formattedProduct;
    } catch (error) {
      console.error('❌ ProductService.getProductById() error:', error);
      return null;
    }
  }

  /**
   * Create new product
   */
  static async createProduct(data: ProductFormValues): Promise<Product> {
    try {
      console.log('🔄 ProductService.createProduct() - Starting...');
      console.log('📤 Input data:', JSON.stringify(data, null, 2));
      
      await this.connect();
      const ProductModel = getProductModel();

      // Validation
      if (!data.name || !data.description || !data.price || !data.category || !data.sku || !data.brand || !data.model) {
        throw new Error('Data produk tidak lengkap (nama, deskripsi, harga, kategori, SKU, brand, model wajib diisi)');
      }

      if (data.price <= 0) {
        throw new Error('Harga harus lebih dari 0');
      }

      // Check SKU uniqueness
      const existingSKU = await ProductModel.findOne({ sku: data.sku.toUpperCase() });
      if (existingSKU) {
        throw new Error(`SKU "${data.sku}" sudah digunakan. Gunakan SKU yang berbeda.`);
      }

      console.log('✅ Validation passed');

      // Prepare product data
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        brand: data.brand.trim(),
        model: data.model.trim(),
        sku: data.sku.trim().toUpperCase(),
        condition: data.condition || 'new',
        warranty: data.warranty?.trim() || '',
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        category: data.category.trim(),
        status: data.status || 'active',
        images: Array.isArray(data.images) && data.images.length > 0 
          ? data.images.filter(img => img && img.trim()) 
          : ["/placeholder.svg"],
      };

      console.log('📝 Creating product with data:', JSON.stringify(productData, null, 2));

      const newProduct = await ProductModel.create(productData);
      console.log('✅ Product created successfully:', newProduct._id, '- SKU:', newProduct.sku);
      
      return this.formatProduct(newProduct);
    } catch (error) {
      console.error('❌ ProductService.createProduct() error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('E11000 duplicate key')) {
          if (error.message.includes('sku')) {
            throw new Error('SKU sudah digunakan. Gunakan SKU yang berbeda.');
          }
        }
        if (error.message.includes('validation failed')) {
          throw new Error(`Data produk tidak valid: ${error.message}`);
        }
        throw error;
      }
      
      throw new Error('Gagal membuat produk');
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, data: ProductFormValues): Promise<Product | null> {
    try {
      console.log('🔄 ProductService.updateProduct() - Starting...');
      console.log('📥 Product ID:', id);
      console.log('📤 Input data:', JSON.stringify(data, null, 2));
      
      await this.connect();
      const ProductModel = getProductModel();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID produk tidak valid');
      }

      // Validation
      if (!data.name || !data.description || !data.price || !data.category || !data.sku || !data.brand || !data.model) {
        throw new Error('Data produk tidak lengkap (nama, deskripsi, harga, kategori, SKU, brand, model wajib diisi)');
      }

      if (data.price <= 0) {
        throw new Error('Harga harus lebih dari 0');
      }

      // Check if product exists
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        console.log('📭 Product not found');
        return null;
      }

      // Check SKU uniqueness (exclude current product)
      const existingSKU = await ProductModel.findOne({ 
        sku: data.sku.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingSKU) {
        throw new Error(`SKU "${data.sku}" sudah digunakan. Gunakan SKU yang berbeda.`);
      }

      console.log('✅ Validation passed');

      // Prepare update data
      const updateData = {
        name: data.name.trim(),
        description: data.description.trim(),
        brand: data.brand.trim(),
        model: data.model.trim(),
        sku: data.sku.trim().toUpperCase(),
        condition: data.condition || 'new',
        warranty: data.warranty?.trim() || '',
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        category: data.category.trim(),
        status: data.status || 'active',
        images: Array.isArray(data.images) && data.images.length > 0 
          ? data.images.filter(img => img && img.trim()) 
          : ["/placeholder.svg"],
      };

      console.log('📝 Final update data:', JSON.stringify(updateData, null, 2));

      const updatedProduct = await ProductModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .lean();

      if (!updatedProduct) {
        console.log('❌ Failed to update product');
        return null;
      }

      console.log('✅ Product updated successfully:', updatedProduct._id, '- SKU:', updatedProduct.sku);
      return this.formatProduct(updatedProduct);
    } catch (error) {
      console.error('❌ ProductService.updateProduct() error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('E11000 duplicate key')) {
          if (error.message.includes('sku')) {
            throw new Error('SKU sudah digunakan. Gunakan SKU yang berbeda.');
          }
        }
        if (error.message.includes('validation failed')) {
          throw new Error(`Data produk tidak valid: ${error.message}`);
        }
        throw error;
      }
      
      throw new Error('Gagal mengupdate produk');
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log('🔄 ProductService.deleteProduct() - Starting...');
      console.log('📥 Product ID:', id);
      
      await this.connect();
      const ProductModel = getProductModel();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('❌ Invalid ObjectId format');
        return false;
      }

      const result = await ProductModel.findByIdAndDelete(id);
      
      if (!result) {
        console.log('📭 Product not found or already deleted');
        return false;
      }

      console.log('✅ Product deleted successfully:', result.name, '- SKU:', result.sku);
      return true;
    } catch (error) {
      console.error('❌ ProductService.deleteProduct() error:', error);
      return false;
    }
  }

  /**
   * Get product count by category (NEW - for category integration)
   */
  static async getProductCountByCategory(categorySlug: string): Promise<number> {
    try {
      console.log('🔄 ProductService.getProductCountByCategory() - Starting...');
      console.log('📥 Category slug:', categorySlug);
      
      await this.connect();
      const ProductModel = getProductModel();
      
      const count = await ProductModel.countDocuments({ 
        category: categorySlug,
        status: { $ne: 'archived' }
      });
      
      console.log('✅ Product count for category:', categorySlug, '=', count);
      return count;
    } catch (error) {
      console.error('❌ ProductService.getProductCountByCategory() error:', error);
      return 0;
    }
  }

  // Tambahkan method ini ke src/lib/database/services/product-service.ts

/**
 * Get available filter options from database
 */
static async getAvailableFilters(): Promise<{
  categories: { id: string; name: string; count: number }[];
  brands: { id: string; name: string; count: number }[];
  conditions: { id: string; name: string; count: number }[];
}> {
  try {
    console.log('🔍 ProductService.getAvailableFilters - Starting...');
    
    await this.connect();
    const ProductModel = getProductModel();

    // Get categories with counts
    const categoryAggregation = await ProductModel.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          id: '$_id',
          name: {
            $replaceAll: {
              input: {
                $concat: [
                  { $toUpper: { $substr: ['$_id', 0, 1] } },
                  { $substr: ['$_id', 1, -1] }
                ]
              },
              find: '-',
              replacement: ' '
            }
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { name: 1 } }
    ]);

    // Get brands with counts
    const brandAggregation = await ProductModel.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          id: { $toLower: '$_id' },
          name: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { name: 1 } }
    ]);

    // Get conditions with counts
    const conditionAggregation = await ProductModel.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          id: '$_id',
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'new'] }, then: 'Baru' },
                { case: { $eq: ['$_id', 'refurbished'] }, then: 'Refurbished' },
                { case: { $eq: ['$_id', 'used-like-new'] }, then: 'Bekas Seperti Baru' },
                { case: { $eq: ['$_id', 'used-good'] }, then: 'Bekas Kondisi Baik' }
              ],
              default: '$_id'
            }
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { id: 1 } }
    ]);

    const result = {
      categories: categoryAggregation,
      brands: brandAggregation,
      conditions: conditionAggregation
    };

    console.log('✅ Available filters retrieved:', {
      categories: result.categories.length,
      brands: result.brands.length,
      conditions: result.conditions.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ ProductService.getAvailableFilters error:', error);
    throw error;
  }
}

  /**
   * Update product counts for all categories (NEW - for category integration)
   */
  static async updateCategoryProductCounts(): Promise<Record<string, number>> {
    try {
      console.log('🔄 ProductService.updateCategoryProductCounts() - Starting...');
      
      await this.connect();
      const ProductModel = getProductModel();
      
      // Get product counts grouped by category
      const categoryProductCounts = await ProductModel.aggregate([
        {
          $match: { status: { $ne: 'archived' } }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);

      const countsMap: Record<string, number> = {};
      categoryProductCounts.forEach(item => {
        countsMap[item._id] = item.count;
      });

      console.log('✅ Category product counts updated:', countsMap);
      return countsMap;
    } catch (error) {
      console.error('❌ ProductService.updateCategoryProductCounts() error:', error);
      return {};
    }
  }

  /**
   * Format product document to Product type
   */
  private static formatProduct(doc: any): Product {
    console.log('📋 Formatting product - Raw doc keys:', Object.keys(doc));
    console.log('📋 Raw document data:', {
      _id: doc._id,
      name: doc.name,
      sku: doc.sku,
      brand: doc.brand,
      model: doc.model,
      images: doc.images
    });
    
    const formatted = {
      id: doc._id ? doc._id.toString() : '',
      name: doc.name || '',
      description: doc.description || '',
      brand: doc.brand || '',
      model: doc.model || '',
      sku: doc.sku || '',
      condition: doc.condition || 'new',
      warranty: doc.warranty || '',
      price: typeof doc.price === 'number' ? doc.price : 0,
      stock: typeof doc.stock === 'number' ? doc.stock : 0,
      category: doc.category || '',
      status: doc.status || 'active',
      images: Array.isArray(doc.images) && doc.images.length > 0 
        ? doc.images.filter((img: string) => img && img.trim() && img !== "/placeholder.svg")
        : ["/placeholder.svg"],
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      isFeatured: doc.isFeatured || false,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
    };
    
    console.log('📋 Formatted product result:', formatted);
    return formatted;
  }
}