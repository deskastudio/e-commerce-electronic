// lib/database/services/integration-service.ts - Integration Helper
import { ProductService } from './product-service';
import { CategoryService } from './category-service';

/**
 * Service untuk integrasi antara Categories dan Products
 */
export class IntegrationService {
  /**
   * Update product count untuk semua kategori
   * Dipanggil setelah ada perubahan pada products
   */
  static async updateAllCategoryProductCounts(): Promise<void> {
    try {
      console.log('🔄 IntegrationService.updateAllCategoryProductCounts() - Starting...');
      
      // Get all categories
      const categories = await CategoryService.getCategoriesForSelect();
      
      // Update count for each category
      const updatePromises = categories.map(async (category) => {
        const count = await ProductService.getProductCountByCategory(category.slug);
        console.log(`📊 Category "${category.name}" has ${count} products`);
        return { category: category.name, count };
      });
      
      await Promise.all(updatePromises);
      console.log('✅ All category product counts updated');
    } catch (error) {
      console.error('❌ IntegrationService.updateAllCategoryProductCounts() error:', error);
      throw error;
    }
  }

  /**
   * Update product count untuk kategori tertentu
   */
  static async updateCategoryProductCount(categorySlug: string): Promise<number> {
    try {
      console.log(`🔄 IntegrationService.updateCategoryProductCount(${categorySlug}) - Starting...`);
      
      const count = await ProductService.getProductCountByCategory(categorySlug);
      console.log(`📊 Category "${categorySlug}" has ${count} products`);
      
      return count;
    } catch (error) {
      console.error(`❌ IntegrationService.updateCategoryProductCount(${categorySlug}) error:`, error);
      return 0;
    }
  }

  /**
   * Validasi apakah kategori masih bisa dihapus (tidak ada produk)
   */
  static async canDeleteCategory(categorySlug: string): Promise<{ canDelete: boolean; productCount: number }> {
    try {
      console.log(`🔄 IntegrationService.canDeleteCategory(${categorySlug}) - Starting...`);
      
      const productCount = await ProductService.getProductCountByCategory(categorySlug);
      const canDelete = productCount === 0;
      
      console.log(`📊 Category "${categorySlug}": ${productCount} products, can delete: ${canDelete}`);
      
      return { canDelete, productCount };
    } catch (error) {
      console.error(`❌ IntegrationService.canDeleteCategory(${categorySlug}) error:`, error);
      return { canDelete: false, productCount: 0 };
    }
  }

  /**
   * Get kategori dengan product count terbanyak
   */
  static async getTopCategoriesByProductCount(limit: number = 5): Promise<Array<{ category: string; count: number }>> {
    try {
      console.log(`🔄 IntegrationService.getTopCategoriesByProductCount(${limit}) - Starting...`);
      
      const categories = await CategoryService.getCategoriesForSelect();
      
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const count = await ProductService.getProductCountByCategory(category.slug);
          return { category: category.name, count };
        })
      );
      
      // Sort by count descending and take top N
      const topCategories = categoriesWithCount
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      console.log('📊 Top categories by product count:', topCategories);
      return topCategories;
    } catch (error) {
      console.error('❌ IntegrationService.getTopCategoriesByProductCount() error:', error);
      return [];
    }
  }

  /**
   * Pindah semua produk dari satu kategori ke kategori lain
   */
  static async moveProductsToCategory(fromCategorySlug: string, toCategorySlug: string): Promise<{ success: boolean; movedCount: number }> {
    try {
      console.log(`🔄 IntegrationService.moveProductsToCategory(${fromCategorySlug} -> ${toCategorySlug}) - Starting...`);
      
      // Get all products in the source category
      const products = await ProductService.getProductsByCategory(fromCategorySlug);
      
      if (products.length === 0) {
        console.log('📭 No products to move');
        return { success: true, movedCount: 0 };
      }
      
      // Update each product to the new category
      let movedCount = 0;
      for (const product of products) {
        try {
          const updatedProduct = await ProductService.updateProduct(product.id, {
            ...product,
            category: toCategorySlug
          });
          
          if (updatedProduct) {
            movedCount++;
            console.log(`✅ Moved product "${product.name}" to category "${toCategorySlug}"`);
          }
        } catch (error) {
          console.error(`❌ Failed to move product "${product.name}":`, error);
        }
      }
      
      console.log(`✅ Successfully moved ${movedCount} out of ${products.length} products`);
      return { success: true, movedCount };
    } catch (error) {
      console.error(`❌ IntegrationService.moveProductsToCategory() error:`, error);
      return { success: false, movedCount: 0 };
    }
  }

  /**
   * Get statistik umum untuk dashboard
   */
  static async getDashboardStats(): Promise<{
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
    lowStockProducts: number;
    topCategory: string | null;
  }> {
    try {
      console.log('🔄 IntegrationService.getDashboardStats() - Starting...');
      
      const [
        allProducts,
        categories,
        topCategories
      ] = await Promise.all([
        ProductService.getAllProducts(),
        CategoryService.getCategoriesForSelect(),
        IntegrationService.getTopCategoriesByProductCount(1)
      ]);
      
      const activeProducts = allProducts.filter(p => p.status === 'active').length;
      const lowStockProducts = allProducts.filter(p => p.stock <= 5).length;
      const topCategory = topCategories.length > 0 ? topCategories[0].category : null;
      
      const stats = {
        totalProducts: allProducts.length,
        totalCategories: categories.length,
        activeProducts,
        lowStockProducts,
        topCategory
      };
      
      console.log('📊 Dashboard stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ IntegrationService.getDashboardStats() error:', error);
      return {
        totalProducts: 0,
        totalCategories: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        topCategory: null
      };
    }
  }
}