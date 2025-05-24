// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductService, ValidationService } from '@/lib/database/services';
import { ProductFormValues, ApiResponse } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/products/[id] - Get single product
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
        error: 'Product ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const product = await ProductService.getProductById(id);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`GET /api/products/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve product',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/products/[id] - Update product
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const data: ProductFormValues = await request.json();

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Product ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate product data
    const validationErrors = ValidationService.validateProduct(data);
    if (!ValidationService.isValid(validationErrors)) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        errors: validationErrors
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update product
    const product = await ProductService.updateProduct(id, data);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`PUT /api/products/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update product',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id] - Delete product
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
        error: 'Product ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const success = await ProductService.deleteProduct(id);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found or could not be deleted'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete product',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}