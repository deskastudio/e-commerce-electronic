// lib/database/services/upload-service.ts
import { ValidationError } from '@/types';

export interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  folder?: string;
}

export class UploadService {
  private static readonly DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2MB
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  private static readonly UPLOAD_ENDPOINT = '/api/upload';

  /**
   * Upload category image
   */
  static async uploadCategoryImage(file: File): Promise<string> {
    try {
      // Validate file before upload
      const validationErrors = this.validateFile(file, {
        maxSize: this.DEFAULT_MAX_SIZE,
        allowedTypes: this.DEFAULT_ALLOWED_TYPES
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.map(err => err.message).join(', '));
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');
      formData.append('type', 'category');

      // Upload file
      const response = await fetch(this.UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      return result.data.url;
    } catch (error) {
      console.error('Error uploading category image:', error);
      throw error;
    }
  }

  /**
   * Upload product image
   */
  static async uploadProductImage(file: File): Promise<string> {
    try {
      // Validate file before upload
      const validationErrors = this.validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB for product images
        allowedTypes: this.DEFAULT_ALLOWED_TYPES
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.map(err => err.message).join(', '));
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      formData.append('type', 'product');

      // Upload file
      const response = await fetch(this.UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      return result.data.url;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  }

  /**
   * Delete uploaded file
   */
  static async deleteFile(url: string): Promise<boolean> {
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error deleting file:', errorData.message || response.statusText);
        return false;
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File, options: UploadOptions = {}): ValidationError[] {
    const errors: ValidationError[] = [];
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    // Check file size
    if (file.size > maxSize) {
      errors.push({
        field: 'file',
        message: `File terlalu besar. Maksimal ${this.formatFileSize(maxSize)}`
      });
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push({
        field: 'file',
        message: `Tipe file tidak didukung. Hanya boleh: ${this.formatAllowedTypes(allowedTypes)}`
      });
    }

    // Check file name
    if (!file.name || file.name.trim() === '') {
      errors.push({
        field: 'file',
        message: 'Nama file tidak valid'
      });
    }

    return errors;
  }

  /**
   * Generate unique filename
   */
  static generateUniqueFilename(originalName: string, folder: string = ''): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const baseName = originalName.split('.').slice(0, -1).join('.');
    const sanitizedBaseName = baseName
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 20);

    const filename = `${sanitizedBaseName}-${timestamp}-${randomString}.${extension}`;
    return folder ? `${folder}/${filename}` : filename;
  }

  /**
   * Format file size for display
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format allowed types for display
   */
  private static formatAllowedTypes(types: string[]): string {
    return types
      .map(type => type.split('/')[1].toUpperCase())
      .join(', ');
  }

  /**
   * Create image from URL (for validation)
   */
  static validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Get file info from URL
   */
  static getFileInfoFromUrl(url: string): {
    filename: string;
    extension: string;
    path: string;
  } | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split('/');
      const filename = segments[segments.length - 1];
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      const path = segments.slice(0, -1).join('/');

      return {
        filename,
        extension,
        path
      };
    } catch (error) {
      console.error('Error parsing file URL:', error);
      return null;
    }
  }
}