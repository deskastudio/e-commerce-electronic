// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductService, ValidationService } from '@/lib/database/services';
import { ProductFormValues, ApiResponse } from '@/types';

/**
 * GET /api/products - Get products with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const result = await ProductService.getProductsPaginated(page, limit, {
      query,
      category,
      status
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Products retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/products error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve products',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/products - Create new product
 */
export async function POST(request: NextRequest) {
  try {
    const data: ProductFormValues = await request.json();

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

    // Create product
    const product = await ProductService.createProduct(data);

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create product',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}