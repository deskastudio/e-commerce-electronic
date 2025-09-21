// app/api/categories/select/route.ts - Simple categories for select dropdown
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import CategoryModel from '@/lib/database/models/Category';
import { CategorySelectOption } from '@/types/product';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * GET /api/categories/select - Get categories for select dropdown
 */
export async function GET() {
  try {
    console.log('🔄 GET /api/categories/select - Starting...');
    
    await connectDB();
    console.log('✅ Database connected');
    
    const categories = await CategoryModel
      .find()
      .select('_id name slug')
      .sort({ name: 1 })
      .lean();

    const selectOptions: CategorySelectOption[] = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug
    }));

    console.log(`📊 Found ${selectOptions.length} categories for select`);

    const response: ApiResponse<CategorySelectOption[]> = {
      success: true,
      data: selectOptions,
      message: 'Categories for select retrieved successfully'
    };

    console.log('✅ GET /api/categories/select - Success');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ GET /api/categories/select error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve categories for select',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}