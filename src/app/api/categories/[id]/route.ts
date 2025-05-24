// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CategoryService, ValidationService } from '@/lib/database/services';
import { CategoryFormValues, ApiResponse } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/categories/[id] - Get single category
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Category ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      const response: ApiResponse = {
        success: false,
        error: 'Category not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: category,
      message: 'Category retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`GET /api/categories/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve category',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/categories/[id] - Update category
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const data: CategoryFormValues = await request.json();

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Category ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

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

    // Update category
    const category = await CategoryService.updateCategory(id, data);

    if (!category) {
      const response: ApiResponse = {
        success: false,
        error: 'Category not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: category,
      message: 'Category updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`PUT /api/categories/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update category',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/categories/[id] - Delete category
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Category ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const success = await CategoryService.deleteCategory(id);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: 'Category not found or could not be deleted'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Category deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`DELETE /api/categories/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete category',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}