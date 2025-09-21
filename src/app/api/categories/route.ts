// app/api/categories/route.ts - Fixed Categories API with Proper Product Count Integration
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import CategoryModel from '@/lib/database/models/Category';

interface CategoryFormData {
  name: string;
  description?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// GET - List all categories with product count
export async function GET() {
  try {
    console.log('🔄 GET /api/categories - Starting...');
    
    await connectDB();
    console.log('✅ Database connected');
    
    // Use the static method to get categories with product counts
    const categoriesWithCount = await CategoryModel.findWithProductCounts();
    
    console.log(`📊 Found ${categoriesWithCount.length} categories with product counts`);

    const response: ApiResponse = {
      success: true,
      data: categoriesWithCount,
      message: 'Categories retrieved successfully'
    };

    console.log('✅ GET /api/categories - Success');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ GET /api/categories error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/categories - Starting...');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('📥 Raw request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    const { name, description }: CategoryFormData = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.log('❌ Validation failed: Empty or invalid name');
      return NextResponse.json({
        success: false,
        error: 'Nama kategori harus diisi'
      }, { status: 400 });
    }

    if (name.trim().length > 100) {
      console.log('❌ Validation failed: Name too long');
      return NextResponse.json({
        success: false,
        error: 'Nama kategori maksimal 100 karakter'
      }, { status: 400 });
    }

    if (description && typeof description === 'string' && description.trim().length > 500) {
      console.log('❌ Validation failed: Description too long');
      return NextResponse.json({
        success: false,
        error: 'Deskripsi maksimal 500 karakter'
      }, { status: 400 });
    }

    console.log('✅ Basic validation passed');

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Generate slug
    const slug = generateSlug(name.trim());
    console.log('🔧 Generated slug:', slug);

    if (!slug) {
      console.error('❌ Failed to generate slug from name:', name);
      return NextResponse.json({
        success: false,
        error: 'Gagal membuat slug dari nama kategori'
      }, { status: 400 });
    }

    // Check if category name already exists
    const existingCategoryByName = await CategoryModel.findOne({
      name: { $regex: new RegExp(`^${name.trim()}`, 'i') }
    });
    
    if (existingCategoryByName) {
      console.log('❌ Category name already exists:', name);
      return NextResponse.json({
        success: false,
        error: 'Kategori dengan nama ini sudah ada'
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingCategoryBySlug = await CategoryModel.findOne({ slug });

    if (existingCategoryBySlug) {
      console.log('❌ Category slug already exists:', slug);
      return NextResponse.json({
        success: false,
        error: 'Kategori dengan nama serupa sudah ada'
      }, { status: 400 });
    }

    console.log('✅ Category name and slug are unique');

    // Prepare category data with pre-generated slug
    const categoryData = {
      name: name.trim(),
      slug: slug,
      description: description && typeof description === 'string' ? description.trim() : ''
    };

    console.log('📝 Creating category with data:', JSON.stringify(categoryData, null, 2));

    // Create new category
    const newCategory = await CategoryModel.create(categoryData);
    console.log('✅ Category created successfully:', newCategory._id);
    console.log('📋 Created category details:', {
      id: newCategory._id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description
    });

    const response: ApiResponse = {
      success: true,
      data: {
        id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        productCount: 0, // New category has no products
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt
      },
      message: 'Category created successfully'
    };

    console.log('✅ POST /api/categories - Success');
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    console.error('❌ POST /api/categories error details:', error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      
      if (error.message.includes('E11000') || error.message.includes('duplicate key')) {
        return NextResponse.json({
          success: false,
          error: 'Kategori dengan nama ini sudah ada'
        }, { status: 400 });
      }

      if (error.message.includes('validation failed')) {
        return NextResponse.json({
          success: false,
          error: 'Data kategori tidak valid: ' + error.message
        }, { status: 400 });
      }
    }

    const response: ApiResponse = {
      success: false,
      error: 'Failed to create category',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}