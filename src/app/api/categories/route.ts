// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CategoryService, ValidationService } from '@/lib/database/services';
import { CategoryFormValues, ApiResponse } from '@/types';

/**
 * GET /api/categories - Get all categories
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const withCount = searchParams.get('withCount') === 'true';

    let categories;
    
    if (withCount) {
      categories = await CategoryService.getCategoriesWithProductCount();
    } else if (activeOnly) {
      categories = await CategoryService.getActiveCategories();
    } else {
      categories = await CategoryService.getAllCategories();
    }

    const response: ApiResponse = {
      success: true,
      data: categories,
      message: 'Categories retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve categories',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/categories - Create new category
 */
export async function POST(request: NextRequest) {
  try {
    const data: CategoryFormValues = await request.json();

    // Validate category data
    const validationErrors = ValidationService.validateCategory(data);
    if (!ValidationService.isValid(validationErrors)) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        errors: validationErrors
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Create category
    const category = await CategoryService.createCategory(data);

    const response: ApiResponse = {
      success: true,
      data: category,
      message: 'Category created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create category',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}