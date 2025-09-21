// app/api/upload/route.ts - CONSISTENT UPLOAD API
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Upload API - Starting...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products'; // Default products
    const type = formData.get('type') as string || 'product';

    console.log('📥 Upload request:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      folder, 
      type 
    });

    if (!file) {
      const response: ApiResponse = {
        success: false,
        error: 'File tidak ditemukan'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file size
    const maxSize = folder === 'categories' ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB/5MB
    if (file.size > maxSize) {
      const response: ApiResponse = {
        success: false,
        error: `File terlalu besar. Maksimal ${Math.round(maxSize / 1024 / 1024)}MB`
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const response: ApiResponse = {
        success: false,
        error: 'Tipe file tidak didukung. Hanya boleh JPG, PNG, GIF, atau WebP'
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.log('✅ File validation passed');

    // Generate filename - KONSISTEN dengan naming convention
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const sanitizedName = originalName
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 20);

    // Naming convention: type-sanitizedName-timestamp-random.ext
    const filename = `${folder.slice(0, -1)}-${sanitizedName}-${timestamp}-${randomString}.${extension}`;
    
    console.log('📝 Generated filename:', filename);

    // Create upload directory - PHYSICAL PATH
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
      console.log('📁 Created directory:', uploadDir);
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    console.log('💾 File saved to:', filePath);

    // IMPORTANT: Generate correct URL for Next.js static serving
    // File location: public/uploads/products/filename.png
    // Next.js URL: /uploads/products/filename.png
    const publicUrl = `/uploads/${folder}/${filename}`;

    console.log('🔗 Public URL:', publicUrl);

    // Test file accessibility immediately
    const testPath = join(process.cwd(), 'public', publicUrl.substring(1)); // Remove leading /
    const fileExists = existsSync(testPath);
    console.log('🧪 File accessibility test:', fileExists ? 'PASS' : 'FAIL');

    const response: ApiResponse = {
      success: true,
      data: {
        url: publicUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        folder: folder,
        fullPath: filePath,
        accessible: fileExists
      },
      message: 'File berhasil diunggah'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Gagal mengunggah file',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE method for file deletion
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔄 Delete API - Starting...');
    
    const { url } = await request.json();

    if (!url) {
      const response: ApiResponse = {
        success: false,
        error: 'URL file tidak ditemukan'
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.log('🗑️ Delete request for:', url);

    // Convert URL to file path
    // URL: /uploads/products/filename.png
    // Path: public/uploads/products/filename.png
    const relativePath = url.startsWith('/') ? url.substring(1) : url;
    const filePath = join(process.cwd(), 'public', relativePath);

    console.log('📁 Deleting file:', filePath);

    // Check if file exists
    if (!existsSync(filePath)) {
      console.log('⚠️ File not found for deletion');
      const response: ApiResponse = {
        success: false,
        error: 'File tidak ditemukan'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete file
    const fs = require('fs').promises;
    await fs.unlink(filePath);

    console.log('✅ File deleted successfully');

    const response: ApiResponse = {
      success: true,
      message: 'File berhasil dihapus'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Delete error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Gagal menghapus file',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}