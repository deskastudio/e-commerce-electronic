// app/api/upload/route.ts - FIXED Upload API Route
import { NextRequest, NextResponse } from 'next/server';
import { ValidationService } from '@/lib/database/services';
import { ApiResponse } from '@/types';
import { writeFile, mkdir, unlink, access, stat, readdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/upload - Upload files (Server-side only)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const uploadType = formData.get('type') as string || 'general';

    if (!files.length) {
      const response: ApiResponse = {
        success: false,
        error: 'No files provided'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate files based on upload type
    let validationConfig = {};
    if (uploadType === 'products') {
      validationConfig = {
        maxFiles: 5,
        maxSize: 5 * 1024 * 1024, // 5MB
        maxTotalSize: 25 * 1024 * 1024 // 25MB total
      };
    } else if (uploadType === 'categories') {
      validationConfig = {
        maxFiles: 1,
        maxSize: 2 * 1024 * 1024 // 2MB
      };
    }

    const validationErrors = ValidationService.validateMultipleFileUpload(files, validationConfig);
    if (!ValidationService.isValid(validationErrors)) {
      const response: ApiResponse = {
        success: false,
        error: 'File validation failed',
        errors: validationErrors
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Upload files
    const uploadResults = await uploadFiles(files, uploadType);

    const response: ApiResponse = {
      success: true,
      data: uploadResults,
      message: `Successfully uploaded ${files.length} file(s)`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('POST /api/upload error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to upload files',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/upload - Delete files
 */
export async function DELETE(request: NextRequest) {
  try {
    const { filePaths } = await request.json();

    if (!filePaths || !Array.isArray(filePaths)) {
      const response: ApiResponse = {
        success: false,
        error: 'File paths array is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await deleteFiles(filePaths);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: `Deleted ${result.deleted.length} file(s), failed to delete ${result.failed.length} file(s)`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('DELETE /api/upload error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete files',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * GET /api/upload/info - Get file info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      const response: ApiResponse = {
        success: false,
        error: 'File path is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const fileInfo = await getFileInfo(filePath);

    const response: ApiResponse = {
      success: true,
      data: fileInfo
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/upload/info error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get file info',
      message: (error as Error).message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// Server-side file operations (Node.js only)

/**
 * Upload multiple files to server
 */
async function uploadFiles(files: File[], subDir: string = 'general'): Promise<string[]> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
  await ensureDirectoryExists(uploadDir);

  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = getFileExtension(file.name);
    const filename = `${subDir}-${uuidv4()}${ext}`;
    const fullPath = path.join(uploadDir, filename);

    await writeFile(fullPath, buffer);

    return `/uploads/${subDir}/${filename}`;
  });

  return await Promise.all(uploadPromises);
}

/**
 * Delete multiple files from server
 */
async function deleteFiles(filePaths: string[]): Promise<{ deleted: string[]; failed: string[] }> {
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const filePath of filePaths) {
    try {
      // Ensure the file is within our upload directory
      const fullPath = path.join(process.cwd(), 'public', filePath);
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      if (!fullPath.startsWith(uploadDir)) {
        failed.push(filePath);
        continue;
      }

      // Check if file exists
      await access(fullPath);
      
      // Delete file
      await unlink(fullPath);
      deleted.push(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      failed.push(filePath);
    }
  }

  return { deleted, failed };
}

/**
 * Get file information
 */
async function getFileInfo(filePath: string): Promise<{
  exists: boolean;
  size?: number;
  mimetype?: string;
}> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    const stats = await stat(fullPath);
    const ext = getFileExtension(filePath);
    const mimetype = getMimetypeFromExtension(ext);

    return {
      exists: true,
      size: stats.size,
      mimetype
    };
  } catch (error) {
    return { exists: false };
  }
}

/**
 * Get upload statistics
 */
export async function getUploadStats(subDir: string = 'products'): Promise<{
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeMB: number;
}> {
  try {
    const uploadPath = path.join(process.cwd(), 'public/uploads', subDir);
    
    const files = await readdir(uploadPath);
    let totalSizeBytes = 0;

    for (const file of files) {
      const filePath = path.join(uploadPath, file);
      const stats = await stat(filePath);
      totalSizeBytes += stats.size;
    }

    return {
      totalFiles: files.length,
      totalSizeBytes,
      totalSizeMB: Math.round((totalSizeBytes / (1024 * 1024)) * 100) / 100
    };
  } catch (error) {
    console.error("Error getting upload stats:", error);
    return {
      totalFiles: 0,
      totalSizeBytes: 0,
      totalSizeMB: 0
    };
  }
}

// Utility functions

/**
 * Ensure directory exists
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create upload directory: ${(error as Error).message}`);
  }
}

/**
 * Get file extension
 */
function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

/**
 * Get mimetype from extension
 */
function getMimetypeFromExtension(ext: string): string {
  const mimetypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };

  return mimetypes[ext] || 'application/octet-stream';
}