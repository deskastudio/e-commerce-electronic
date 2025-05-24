// lib/database/services/validation-service.ts
import { ProductFormValues, CategoryFormValues, ValidationError } from '@/types';

export class ValidationService {
  /**
   * Validate product data with detailed error reporting
   */
  static validateProduct(data: ProductFormValues): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Nama produk harus diisi'
      });
    } else if (data.name.length > 200) {
      errors.push({
        field: 'name',
        message: 'Nama produk maksimal 200 karakter'
      });
    }

    // Description validation
    if (!data.description || data.description.trim() === '') {
      errors.push({
        field: 'description',
        message: 'Deskripsi produk harus diisi'
      });
    } else if (data.description.length > 2000) {
      errors.push({
        field: 'description',
        message: 'Deskripsi maksimal 2000 karakter'
      });
    }

    // Price validation
    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push({
        field: 'price',
        message: 'Harga produk harus berupa angka positif'
      });
    } else if (data.price > 1000000000) { // 1 billion max
      errors.push({
        field: 'price',
        message: 'Harga produk terlalu besar'
      });
    }

    // Discount price validation
    if (data.discountPrice !== undefined) {
      if (typeof data.discountPrice !== 'number' || data.discountPrice < 0) {
        errors.push({
          field: 'discountPrice',
          message: 'Harga diskon harus berupa angka non-negatif'
        });
      } else if (data.discountPrice >= data.price) {
        errors.push({
          field: 'discountPrice',
          message: 'Harga diskon harus lebih kecil dari harga normal'
        });
      }
    }

    // Stock validation
    if (typeof data.stock !== 'number' || data.stock < 0) {
      errors.push({
        field: 'stock',
        message: 'Stok harus berupa angka non-negatif'
      });
    } else if (data.stock > 1000000) { // 1 million max
      errors.push({
        field: 'stock',
        message: 'Stok terlalu besar'
      });
    }

    // Category validation
    if (!data.category || data.category.trim() === '') {
      errors.push({
        field: 'category',
        message: 'Kategori harus dipilih'
      });
    }

    // Status validation
    const validStatuses = ['active', 'draft', 'archived'];
    if (!validStatuses.includes(data.status)) {
      errors.push({
        field: 'status',
        message: `Status harus salah satu dari: ${validStatuses.join(', ')}`
      });
    }

    // Images validation
    if (!data.images || data.images.length === 0) {
      errors.push({
        field: 'images',
        message: 'Minimal satu gambar produk harus diunggah'
      });
    } else if (data.images.length > 5) {
      errors.push({
        field: 'images',
        message: 'Maksimal 5 gambar yang dapat diunggah'
      });
    }

    // SKU validation (if provided)
    if (data.sku && data.sku.trim() !== '') {
      if (data.sku.length > 50) {
        errors.push({
          field: 'sku',
          message: 'SKU maksimal 50 karakter'
        });
      }
      if (!/^[A-Z0-9-_]+$/i.test(data.sku)) {
        errors.push({
          field: 'sku',
          message: 'SKU hanya boleh menggunakan huruf, angka, tanda hubung, dan underscore'
        });
      }
    }

    // Barcode validation (if provided)
    if (data.barcode && data.barcode.trim() !== '') {
      if (data.barcode.length > 50) {
        errors.push({
          field: 'barcode',
          message: 'Barcode maksimal 50 karakter'
        });
      }
    }

    // Tags validation
    if (data.tags && data.tags.length > 0) {
      if (data.tags.length > 10) {
        errors.push({
          field: 'tags',
          message: 'Maksimal 10 tags per produk'
        });
      }
      
      // Validate individual tags
      data.tags.forEach((tag, index) => {
        if (tag.length > 30) {
          errors.push({
            field: 'tags',
            message: `Tag "${tag}" terlalu panjang (maksimal 30 karakter)`
          });
        }
      });
    }

    // Cost validation (if provided)
    if (data.cost !== undefined) {
      if (typeof data.cost !== 'number' || data.cost < 0) {
        errors.push({
          field: 'cost',
          message: 'Biaya per item harus berupa angka non-negatif'
        });
      }
    }

    return errors;
  }

  /**
   * Validate category data
   */
  static validateCategory(data: CategoryFormValues): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Nama kategori harus diisi'
      });
    } else if (data.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Nama kategori maksimal 100 karakter'
      });
    }

    // Slug validation
    if (data.slug) {
      if (data.slug.length > 100) {
        errors.push({
          field: 'slug',
          message: 'Slug kategori maksimal 100 karakter'
        });
      }
      if (!/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push({
          field: 'slug',
          message: 'Slug hanya boleh menggunakan huruf kecil, angka, dan tanda hubung'
        });
      }
    }

    // Description validation
    if (data.description && data.description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Deskripsi kategori maksimal 500 karakter'
      });
    }

    // Image URL validation
    if (data.imageUrl && data.imageUrl.trim() !== '') {
      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i;
      if (!urlRegex.test(data.imageUrl)) {
        errors.push({
          field: 'imageUrl',
          message: 'URL gambar tidak valid atau format tidak didukung'
        });
      }
    }

    return errors;
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(
    file: File,
    config: {
      maxSize?: number;
      allowedTypes?: string[];
      maxFilename?: number;
    } = {}
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFilename = 255
    } = config;

    // File size validation
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      errors.push({
        field: 'file',
        message: `Ukuran file melebihi batas maksimal ${maxSizeMB}MB`
      });
    }

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes
        .map(type => type.split('/')[1])
        .join(', ');
      errors.push({
        field: 'file',
        message: `Tipe file tidak didukung. Tipe yang diizinkan: ${allowedExtensions}`
      });
    }

    // Filename length validation
    if (file.name.length > maxFilename) {
      errors.push({
        field: 'file',
        message: `Nama file terlalu panjang (maksimal ${maxFilename} karakter)`
      });
    }

    // Check for potentially dangerous filenames
    if (/[<>:"/\\|?*]/.test(file.name)) {
      errors.push({
        field: 'file',
        message: 'Nama file mengandung karakter yang tidak diizinkan'
      });
    }

    return errors;
  }

  /**
   * Validate multiple file uploads
   */
  static validateMultipleFileUpload(
    files: File[],
    config: {
      maxFiles?: number;
      maxTotalSize?: number;
      maxSize?: number;
      allowedTypes?: string[];
      maxFilename?: number;
    } = {}
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const {
      maxFiles = 5,
      maxTotalSize = 25 * 1024 * 1024, // 25MB total default
      ...fileConfig
    } = config;

    // Check number of files
    if (files.length === 0) {
      errors.push({
        field: 'files',
        message: 'Minimal satu file harus diunggah'
      });
      return errors;
    }

    if (files.length > maxFiles) {
      errors.push({
        field: 'files',
        message: `Maksimal ${maxFiles} file yang dapat diunggah sekaligus`
      });
    }

    // Check total file size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      const maxTotalSizeMB = (maxTotalSize / (1024 * 1024)).toFixed(1);
      errors.push({
        field: 'files',
        message: `Total ukuran file melebihi batas maksimal ${maxTotalSizeMB}MB`
      });
    }

    // Validate each file
    files.forEach((file, index) => {
      const fileErrors = this.validateFileUpload(file, fileConfig);
      fileErrors.forEach(error => {
        errors.push({
          field: `files[${index}]`,
          message: `File "${file.name}": ${error.message}`
        });
      });
    });

    // Check for duplicate filenames
    const filenames = files.map(file => file.name);
    const duplicates = filenames.filter((name, index) => filenames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push({
        field: 'files',
        message: `Nama file duplikat ditemukan: ${[...new Set(duplicates)].join(', ')}`
      });
    }

    return errors;
  }

  /**
   * Check if validation passed
   */
  static isValid(errors: ValidationError[]): boolean {
    return errors.length === 0;
  }

  /**
   * Format validation errors for display
   */
  static formatErrors(errors: ValidationError[]): string {
    return errors.map(error => error.message).join('; ');
  }

  /**
   * Group errors by field
   */
  static groupErrorsByField(errors: ValidationError[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    
    errors.forEach(error => {
      if (!grouped[error.field]) {
        grouped[error.field] = [];
      }
      grouped[error.field].push(error.message);
    });

    return grouped;
  }
}