// app/api/categories/[id]/route.ts - Single Category API with Product Count Integration
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import CategoryModel from '@/lib/database/models/Category';
import mongoose from 'mongoose';

interface CategoryFormData {
  name: string;
  description?: string;
}

interface RouteParams {
  params: {
    id: string;
  };
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

// GET - Get single category by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('🔄 GET /api/categories/[id] - Starting...');
    console.log('📥 Category ID:', params.id);
    
    const { id } = params;

    if (!id || id.trim() === '') {
      console.log('❌ Category ID is empty');
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format');
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID format'
      }, { status: 400 });
    }

    await connectDB();
    console.log('✅ Database connected');

    const category = await CategoryModel.findById(id).lean();

    if (!category) {
      console.log('📭 Category not found');
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Get product count for this category
    const { ProductService } = require('@/lib/database/services/product-service');
    const productCount = await ProductService.getProductCountByCategory(category.slug);

    const categoryWithCount = {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };

    const response: ApiResponse = {
      success: true,
      data: categoryWithCount,
      message: 'Category retrieved successfully'
    };

    console.log('✅ GET /api/categories/[id] - Success:', category.name);
    return NextResponse.json(response);

  } catch (error) {
    console.error(`❌ GET /api/categories/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve category',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update category by ID
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('🔄 PUT /api/categories/[id] - Starting...');
    console.log('📥 Category ID:', params.id);
    
    const { id } = params;

    if (!id || id.trim() === '') {
      console.log('❌ Category ID is empty');
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format');
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID format'
      }, { status: 400 });
    }

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

    await connectDB();
    console.log('✅ Database connected');

    // Check if category exists
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      console.log('📭 Category not found for update');
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Generate new slug if name changed
    let newSlug = existingCategory.slug;
    if (name.trim() !== existingCategory.name) {
      newSlug = generateSlug(name.trim());
      console.log('🔧 Generated new slug:', newSlug);

      if (!newSlug) {
        console.error('❌ Failed to generate slug from name:', name);
        return NextResponse.json({
          success: false,
          error: 'Gagal membuat slug dari nama kategori'
        }, { status: 400 });
      }

      // Check if new name already exists (excluding current category)
      const existingCategoryByName = await CategoryModel.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingCategoryByName) {
        console.log('❌ Category name already exists:', name);
        return NextResponse.json({
          success: false,
          error: 'Kategori dengan nama ini sudah ada'
        }, { status: 400 });
      }

      // Check if new slug already exists (excluding current category)
      const existingCategoryBySlug = await CategoryModel.findOne({ 
        slug: newSlug,
        _id: { $ne: id }
      });

      if (existingCategoryBySlug) {
        console.log('❌ Category slug already exists:', newSlug);
        return NextResponse.json({
          success: false,
          error: 'Kategori dengan nama serupa sudah ada'
        }, { status: 400 });
      }
    }

    console.log('✅ Category name and slug are unique');

    // Prepare update data
    const updateData = {
      name: name.trim(),
      slug: newSlug,
      description: description && typeof description === 'string' ? description.trim() : ''
    };

    console.log('📝 Updating category with data:', JSON.stringify(updateData, null, 2));

    // Update category
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      console.log('❌ Failed to update category');
      return NextResponse.json({
        success: false,
        error: 'Failed to update category'
      }, { status: 500 });
    }

    console.log('✅ Category updated successfully:', updatedCategory._id);

    // Get product count for updated category
    const { ProductService } = require('@/lib/database/services/product-service');
    const productCount = await ProductService.getProductCountByCategory(updatedCategory.slug);

    const response: ApiResponse = {
      success: true,
      data: {
        id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        productCount,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt
      },
      message: 'Category updated successfully'
    };

    console.log('✅ PUT /api/categories/[id] - Success');
    return NextResponse.json(response);
  } catch (error) {
    console.error(`❌ PUT /api/categories/${params.id} error:`, error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
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
      error: 'Failed to update category',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete category by ID
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('🔄 DELETE /api/categories/[id] - Starting...');
    console.log('📥 Category ID:', params.id);
    
    const { id } = params;

    if (!id || id.trim() === '') {
      console.log('❌ Category ID is empty');
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format');
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID format'
      }, { status: 400 });
    }

    await connectDB();
    console.log('✅ Database connected');

    // First check if category exists
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      console.log('📭 Category not found for deletion');
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Check if category has products
    const { ProductService } = require('@/lib/database/services/product-service');
    const productCount = await ProductService.getProductCountByCategory(existingCategory.slug);

    if (productCount > 0) {
      console.log(`❌ Cannot delete category with ${productCount} products`);
      return NextResponse.json({
        success: false,
        error: `Tidak dapat menghapus kategori yang memiliki ${productCount} produk. Pindahkan produk terlebih dahulu.`
      }, { status: 400 });
    }

    console.log('🗑️ Deleting category:', existingCategory.name);
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      console.log('❌ Failed to delete category');
      return NextResponse.json({
        success: false,
        error: 'Failed to delete category'
      }, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      message: `Category "${deletedCategory.name}" deleted successfully`
    };

    console.log('✅ DELETE /api/categories/[id] - Success');
    return NextResponse.json(response);
  } catch (error) {
    console.error(`❌ DELETE /api/categories/${params.id} error:`, error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete category',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}