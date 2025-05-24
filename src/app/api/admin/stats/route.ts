// app/api/admin/stats/route.ts - FIXED Admin Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { ProductService, CategoryService } from '@/lib/database/services';
import { ApiResponse } from '@/types';
import { getUploadStats } from '@/app/api/upload/route';

/**
 * GET /api/admin/stats - Get admin dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Get basic statistics
    const [productStats, categories] = await Promise.all([
      ProductService.getProductStats(),
      CategoryService.getCategoriesWithProductCount()
    ]);

    let responseData: any = {
      products: productStats,
      categories: {
        total: categories.length,
        active: categories.filter(cat => cat.isActive).length,
        withProducts: categories.filter(cat => cat.productCount > 0).length
      }
    };

    // Add specific data based on type parameter
    switch (type) {
      case 'products':
        const lowStockProducts = await ProductService.getLowStockProducts();
        responseData.products.lowStockItems = lowStockProducts;
        break;
        
      case 'categories':
        responseData.categories.list = categories;
        break;
        
      case 'uploads':
        try {
          const productUploadStats = await getUploadStats('products');
          const categoryUploadStats = await getUploadStats('categories');
          responseData.uploads = {
            products: productUploadStats,
            categories: categoryUploadStats
          };
        } catch (error) {
          console.error('Error getting upload stats:', error);
          responseData.uploads = {
            products: { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: 0 },
            categories: { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: 0 }
          };
        }
        break;

      default:
        // Add basic upload stats for dashboard
        try {
          const uploadStats = await getUploadStats('products');
          responseData.uploads = uploadStats;
        } catch (error) {
          console.error('Error getting upload stats:', error);
          responseData.uploads = { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: 0 };
        }
        break;
    }

    const response: ApiResponse = {
      success: true,
      data: responseData,
      message: 'Statistics retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve statistics',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}