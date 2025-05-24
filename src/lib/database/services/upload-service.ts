// lib/database/services/upload-service.ts - FIXED for Next.js
export interface UploadConfig {
    maxFileSize: number; // in bytes
    allowedTypes: string[];
    maxFilesPerUpload: number;
  }
  
  export interface UploadResult {
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimetype: string;
  }
  
  export class UploadService {
    private static readonly defaultConfig: UploadConfig = {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png', 
        'image/gif', 
        'image/webp',
        'image/svg+xml'
      ],
      maxFilesPerUpload: 5
    };
  
    /**
     * Upload product images via API
     */
    static async uploadProductImages(files: File[]): Promise<string[]> {
      try {
        if (!files.length) {
          throw new Error("Minimal satu file harus diunggah");
        }
  
        if (files.length > this.defaultConfig.maxFilesPerUpload) {
          throw new Error(`Maksimal ${this.defaultConfig.maxFilesPerUpload} file yang dapat diunggah sekaligus`);
        }
  
        // Validate files first
        files.forEach(file => this.validateFile(file, this.defaultConfig));
  
        // Create FormData for upload
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        formData.append('type', 'products');
  
        // Upload via API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
        }
  
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }
  
        return result.data;
      } catch (error) {
        console.error("Error uploading product images:", error);
        throw new Error("Gagal mengunggah gambar produk: " + (error as Error).message);
      }
    }
  
    /**
     * Upload category image via API
     */
    static async uploadCategoryImage(file: File): Promise<string> {
      try {
        // Validate file
        const config = {
          ...this.defaultConfig,
          maxFileSize: 2 * 1024 * 1024, // 2MB for category images
          maxFilesPerUpload: 1
        };
        
        this.validateFile(file, config);
  
        // Create FormData for upload
        const formData = new FormData();
        formData.append('files', file);
        formData.append('type', 'categories');
  
        // Upload via API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
        }
  
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }
  
        return result.data;
      } catch (error) {
        console.error("Error uploading category image:", error);
        throw new Error("Gagal mengunggah gambar kategori: " + (error as Error).message);
      }
    }
  
    /**
     * Delete file via API
     */
    static async deleteFile(filePath: string): Promise<boolean> {
      try {
        const response = await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePaths: [filePath] }),
        });
  
        if (!response.ok) {
          return false;
        }
  
        const result = await response.json();
        return result.success && result.data.deleted.includes(filePath);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        return false;
      }
    }
  
    /**
     * Delete multiple files via API
     */
    static async deleteFiles(filePaths: string[]): Promise<{ deleted: string[]; failed: string[] }> {
      try {
        const response = await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePaths }),
        });
  
        if (!response.ok) {
          return { deleted: [], failed: filePaths };
        }
  
        const result = await response.json();
        return result.success ? result.data : { deleted: [], failed: filePaths };
      } catch (error) {
        console.error('Error deleting files:', error);
        return { deleted: [], failed: filePaths };
      }
    }
  
    /**
     * Get upload statistics via API
     */
    static async getUploadStats(subDir: string = 'products'): Promise<{
      totalFiles: number;
      totalSizeBytes: number;
      totalSizeMB: number;
    }> {
      try {
        const response = await fetch(`/api/admin/stats?type=uploads&subDir=${subDir}`);
        
        if (!response.ok) {
          return { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: 0 };
        }
  
        const result = await response.json();
        return result.success ? result.data.uploads : { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: 0 };
      } catch (error) {
        console.error("Error getting upload stats:", error);
        return { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: 0 };
      }
    }
  
    /**
     * Clean up orphaned files via API
     */
    static async cleanupOrphanedFiles(
      referencedFiles: string[], 
      subDir: string = 'products'
    ): Promise<number> {
      try {
        const response = await fetch('/api/upload/cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referencedFiles, subDir }),
        });
  
        if (!response.ok) {
          return 0;
        }
  
        const result = await response.json();
        return result.success ? result.data.deletedCount : 0;
      } catch (error) {
        console.error("Error cleaning up orphaned files:", error);
        return 0;
      }
    }
  
    /**
     * Get file info via API
     */
    static async getFileInfo(filePath: string): Promise<{
      exists: boolean;
      size?: number;
      mimetype?: string;
    }> {
      try {
        const response = await fetch(`/api/upload/info?path=${encodeURIComponent(filePath)}`);
        
        if (!response.ok) {
          return { exists: false };
        }
  
        const result = await response.json();
        return result.success ? result.data : { exists: false };
      } catch (error) {
        return { exists: false };
      }
    }
  
    /**
     * Validate single file (client-side only)
     */
    private static validateFile(file: File, config: UploadConfig): void {
      // Check file size
      if (file.size > config.maxFileSize) {
        const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(1);
        throw new Error(`Ukuran file ${file.name} melebihi batas maksimal ${maxSizeMB}MB`);
      }
  
      // Check file type
      if (!config.allowedTypes.includes(file.type)) {
        const allowedExtensions = config.allowedTypes
          .map(type => type.split('/')[1])
          .join(', ');
        throw new Error(
          `Tipe file ${file.name} tidak didukung. Tipe yang diizinkan: ${allowedExtensions}`
        );
      }
  
      // Check filename length
      if (file.name.length > 255) {
        throw new Error(`Nama file ${file.name} terlalu panjang`);
      }
    }
  
    /**
     * Validate multiple files
     */
    static validateMultipleFiles(files: File[], config: Partial<UploadConfig> = {}): void {
      const finalConfig = { ...this.defaultConfig, ...config };
  
      if (files.length === 0) {
        throw new Error("Minimal satu file harus diunggah");
      }
  
      if (files.length > finalConfig.maxFilesPerUpload) {
        throw new Error(`Maksimal ${finalConfig.maxFilesPerUpload} file yang dapat diunggah sekaligus`);
      }
  
      // Check total file size
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = finalConfig.maxFileSize * files.length;
      
      if (totalSize > maxTotalSize) {
        const maxTotalSizeMB = (maxTotalSize / (1024 * 1024)).toFixed(1);
        throw new Error(`Total ukuran file melebihi batas maksimal ${maxTotalSizeMB}MB`);
      }
  
      // Validate each file
      files.forEach(file => this.validateFile(file, finalConfig));
  
      // Check for duplicate filenames
      const filenames = files.map(file => file.name);
      const duplicates = filenames.filter((name, index) => filenames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        throw new Error(`Nama file duplikat ditemukan: ${[...new Set(duplicates)].join(', ')}`);
      }
    }
  }