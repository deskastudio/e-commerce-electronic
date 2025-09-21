// src/app/api/products/filters/route.ts - API untuk Dynamic Filters
import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/database/services/product-service';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * GET /api/products/filters - Get available filters from database
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/products/filters - Getting filter options...');
    
    const filters = await ProductService.getAvailableFilters();

    const response: ApiResponse = {
      success: true,
      data: filters,
      message: 'Filter options retrieved successfully'
    };

    console.log('✅ Filter options retrieved:', {
      categories: filters.categories.length,
      brands: filters.brands.length,
      conditions: filters.conditions.length
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ GET /api/products/filters error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve filter options',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// Update ProductService untuk menambahkan method getAvailableFilters
// Tambahkan ke src/lib/database/services/product-service.ts:

/*
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
              $concat: [
                { $toUpper: { $substr: ['$_id', 0, 1] } },
                { $substr: ['$_id', 1, -1] }
              ]
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

      console.log('✅ Available filters retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ ProductService.getAvailableFilters error:', error);
      throw error;
    }
  }
*/