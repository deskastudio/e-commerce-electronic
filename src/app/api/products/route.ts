// app/api/products/route.ts - Fixed Products API
import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/database/services/product-service';
import { ProductFormValues } from '@/types/product';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  errors?: any;
}

/**
 * GET /api/products - Get products with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/products - Starting...');
    
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const brand = searchParams.get('brand') || '';
    const condition = searchParams.get('condition') || '';

    console.log('📥 Query params:', { page, limit, query, category, status, brand, condition });

    const result = await ProductService.getProductsPaginated(page, limit, {
      query,
      category,
      status,
      brand,
      condition
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: `Products retrieved successfully (${result.products.length} of ${result.total})`
    };

    console.log('✅ GET /api/products - Success, returning', result.products.length, 'products');
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ GET /api/products error:', error);
    
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
    console.log('🔄 POST /api/products - Starting...');
    
    let data: ProductFormValues;
    try {
      const rawBody = await request.text();
      console.log('📥 Raw request body:', rawBody);
      
      data = JSON.parse(rawBody);
      console.log('📥 Parsed request data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      const response: ApiResponse = {
        success: false,
        error: 'Invalid JSON in request body',
        message: `JSON Parse Error: ${(parseError as Error).message}`
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Basic validation
    const requiredFields = ['name', 'description', 'brand', 'model', 'sku', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: `Required fields missing: ${missingFields.join(', ')}`,
        errors: missingFields.reduce((acc, field) => ({
          ...acc,
          [field]: `${field} is required`
        }), {})
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Type validation
    if (typeof data.price !== 'number' || data.price <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid price',
        message: 'Price must be a positive number'
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (typeof data.stock !== 'number' || data.stock < 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid stock',
        message: 'Stock must be a non-negative number'
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.log('✅ Validation passed, creating product...');

    // Create product
    const product = await ProductService.createProduct(data);

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product created successfully'
    };

    console.log('✅ POST /api/products - Success, product created:', product.id);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/products error:', error);
    
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    // Determine appropriate status code
    if (errorMessage.includes('tidak lengkap') || 
        errorMessage.includes('tidak valid') ||
        errorMessage.includes('sudah digunakan') ||
        errorMessage.includes('validation failed')) {
      statusCode = 400;
    }
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create product',
      message: errorMessage
    };

    return NextResponse.json(response, { status: statusCode });
  }
}