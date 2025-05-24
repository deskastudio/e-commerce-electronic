// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductService, CategoryService } from '@/lib/database/services';
import { ApiResponse } from '@/types';

/**
 * GET /api/search - Global search functionality
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // 'products', 'categories', or 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      const response: ApiResponse = {
        success: false,
        error: 'Search query is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    let results: any = {};

    // Search products
    if (type === 'products' || type === 'all') {
      const products = await ProductService.searchProducts(query);
      results.products = products.slice(0, limit);
    }

    // Search categories
    if (type === 'categories' || type === 'all') {
      const allCategories = await CategoryService.getActiveCategories();
      const categories = allCategories.filter(category => 
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.description?.toLowerCase().includes(query.toLowerCase())
      );
      results.categories = categories.slice(0, Math.min(limit, 10));
    }

    // Calculate total results
    const totalResults = Object.values(results).reduce((total, items: any) => 
      total + (Array.isArray(items) ? items.length : 0), 0
    );

    const response: ApiResponse = {
      success: true,
      data: {
        query,
        totalResults,
        results
      },
      message: `Found ${totalResults} result(s) for "${query}"`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/search error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Search failed',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/search - Advanced search with filters
 */
export async function POST(request: NextRequest) {
  try {
    const {
      query = '',
      filters = {},
      pagination = { page: 1, limit: 20 }
    } = await request.json();

    const { page, limit } = pagination;

    // Perform advanced product search with filters
    const searchParams = {
      query,
      category: filters.category,
      status: filters.status || 'active'
    };

    const results = await ProductService.getProductsPaginated(
      page,
      limit,
      searchParams
    );

    // Apply additional filters if needed
    let filteredProducts = results.products;

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.discountPrice || product.price;
        const minOk = !filters.minPrice || price >= filters.minPrice;
        const maxOk = !filters.maxPrice || price <= filters.maxPrice;
        return minOk && maxOk;
      });
    }

    // Stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        filters.inStock ? product.stock > 0 : product.stock === 0
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.tags.some((tag: string) => 
          product.tags.some(productTag => 
            productTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    const response: ApiResponse = {
      success: true,
      data: {
        ...results,
        products: filteredProducts,
        appliedFilters: filters,
        searchQuery: query
      },
      message: `Advanced search completed with ${filteredProducts.length} result(s)`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('POST /api/search error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Advanced search failed',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}