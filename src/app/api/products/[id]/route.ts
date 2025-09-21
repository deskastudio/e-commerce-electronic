// app/api/products/[id]/route.ts - Fixed Single Product API
import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/database/services/product-service';
import { ProductFormValues } from '@/types/product';

interface RouteParams {
  params: {
    id: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  errors?: any;
}

/**
 * GET /api/products/[id] - Get single product
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('🔄 GET /api/products/[id] - Starting...');
    console.log('📥 Product ID:', params.id);
    
    const { id } = params;

    if (!id || id.trim() === '') {
      console.log('❌ Product ID is empty');
      const response: ApiResponse = {
        success: false,
        error: 'Product ID is required',
        message: 'Product ID parameter is missing or empty'
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.log('🔍 Fetching product with ID:', id);
    const product = await ProductService.getProductById(id);

    if (!product) {
      console.log('📭 Product not found for ID:', id);
      const response: ApiResponse = {
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
      message: `Product ${product.name} retrieved successfully`
    };

    console.log('✅ GET /api/products/[id] - Success:', product.name, 'SKU:', product.sku);
    return NextResponse.json(response);

  } catch (error) {
    console.error(`❌ GET /api/products/${params.id} error:`, error);
    
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
    console.log('🔄 PUT /api/products/[id] - Starting...');
    console.log('📥 Product ID:', params.id);
    
    const { id } = params;

    if (!id || id.trim() === '') {
      console.log('❌ Product ID is empty');
      const response: ApiResponse = {
        success: false,
        error: 'Product ID is required',
        message: 'Product ID parameter is missing or empty'
      };
      return NextResponse.json(response, { status: 400 });
    }

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

    console.log('✅ Validation passed, updating product...');

    // Update product
    const product = await ProductService.updateProduct(id, data);

    if (!product) {
      console.log('📭 Product not found for update, ID:', id);
      const response: ApiResponse = {
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
      message: `Product ${product.name} updated successfully`
    };

    console.log('✅ PUT /api/products/[id] - Success:', product.name, 'SKU:', product.sku);
    return NextResponse.json(response);
  } catch (error) {
    console.error(`❌ PUT /api/products/${params.id} error:`, error);
    
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    // Determine appropriate status code
    if (errorMessage.includes('tidak lengkap') || 
        errorMessage.includes('tidak valid') || 
        errorMessage.includes('tidak ditemukan') ||
        errorMessage.includes('sudah digunakan') ||
        errorMessage.includes('validation failed')) {
      statusCode = 400;
    }

    const response: ApiResponse = {
      success: false,
      error: 'Failed to update product',
      message: errorMessage
    };

    return NextResponse.json(response, { status: statusCode });
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
    console.log('🔄 DELETE /api/products/[id] - Starting...');
    console.log('📥 Product ID:', params.id);
    
    const { id } = params;

    if (!id || id.trim() === '') {
      console.log('❌ Product ID is empty');
      const response: ApiResponse = {
        success: false,
        error: 'Product ID is required',
        message: 'Product ID parameter is missing or empty'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // First check if product exists
    console.log('🔍 Checking if product exists...');
    const existingProduct = await ProductService.getProductById(id);
    
    if (!existingProduct) {
      console.log('📭 Product not found for deletion, ID:', id);
      const response: ApiResponse = {
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`
      };
      return NextResponse.json(response, { status: 404 });
    }

    console.log('🗑️ Deleting product:', existingProduct.name, 'SKU:', existingProduct.sku);
    const success = await ProductService.deleteProduct(id);

    if (!success) {
      console.log('❌ Failed to delete product');
      const response: ApiResponse = {
        success: false,
        error: 'Delete operation failed',
        message: 'Product could not be deleted due to an internal error'
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      message: `Product "${existingProduct.name}" (SKU: ${existingProduct.sku}) deleted successfully`
    };

    console.log('✅ DELETE /api/products/[id] - Success');
    return NextResponse.json(response);
  } catch (error) {
    console.error(`❌ DELETE /api/products/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete product',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}