// lib/database/services/validation-service.ts - Minimal Validation Service
import { ProductFormValues, ProductValidationErrors } from '@/types/product';

export class ValidationService {
  /**
   * Sanitize product data by trimming strings and handling empty values
   */
  static sanitizeProductData(data: ProductFormValues): ProductFormValues {
    return {
      name: data.name?.trim() || "",
      description: data.description?.trim() || "",
      brand: data.brand?.trim() || "",
      model: data.model?.trim() || "",
      sku: data.sku?.trim().toUpperCase() || "",
      condition: data.condition || "new",
      warranty: data.warranty?.trim() || "",
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      category: data.category?.trim() || "",
      status: data.status || "active",
      images: Array.isArray(data.images) ? data.images.filter(img => img && img.trim()) : [],
    };
  }

  /**
   * Validate product data
   */
  static validateProduct(data: ProductFormValues): ProductValidationErrors {
    const errors: ProductValidationErrors = {};

    // Required field validations
    if (!data.name || !data.name.trim()) {
      errors.name = "Nama produk harus diisi";
    }

    if (!data.description || !data.description.trim()) {
      errors.description = "Deskripsi produk harus diisi";
    }

    if (!data.brand || !data.brand.trim()) {
      errors.brand = "Brand harus diisi";
    }

    if (!data.model || !data.model.trim()) {
      errors.model = "Model harus diisi";
    }

    if (!data.sku || !data.sku.trim()) {
      errors.sku = "SKU harus diisi";
    }

    if (!data.category || !data.category.trim()) {
      errors.category = "Kategori harus dipilih";
    }

    // Price validation
    const price = Number(data.price);
    if (!price || price <= 0) {
      errors.price = "Harga harus lebih dari 0";
    }

    // Stock validation
    const stock = Number(data.stock);
    if (stock < 0) {
      errors.stock = "Stok tidak boleh negatif";
    }

    // Condition validation
    const validConditions = ['new', 'refurbished', 'used-like-new', 'used-good'];
    if (!validConditions.includes(data.condition)) {
      errors.condition = "Kondisi produk tidak valid";
    }

    // Status validation  
    const validStatuses = ['active', 'draft', 'archived'];
    if (!validStatuses.includes(data.status)) {
      errors.status = "Status produk tidak valid";
    }

    // Images validation
    if (!data.images || data.images.length === 0) {
      errors.images = "Minimal satu gambar produk harus diunggah";
    }

    // SKU format validation (basic)
    if (data.sku && data.sku.trim()) {
      const sku = data.sku.trim().toUpperCase();
      if (sku.length < 3) {
        errors.sku = "SKU minimal 3 karakter";
      }
      if (!/^[A-Z0-9-]+$/.test(sku)) {
        errors.sku = "SKU hanya boleh mengandung huruf, angka, dan tanda minus";
      }
    }

    // Name length validation
    if (data.name && data.name.trim().length > 200) {
      errors.name = "Nama produk maksimal 200 karakter";
    }

    return errors;
  }

  /**
   * Check if validation errors exist
   */
  static isValid(errors: ProductValidationErrors): boolean {
    return Object.keys(errors).length === 0;
  }

  /**
   * Format validation errors into a readable string
   */
  static formatErrors(errors: ProductValidationErrors): string {
    const errorMessages = Object.values(errors).filter(Boolean);
    if (errorMessages.length === 0) return "";
    
    if (errorMessages.length === 1) {
      return errorMessages[0];
    }
    
    return `Terdapat ${errorMessages.length} kesalahan: ${errorMessages.join(', ')}`;
  }

  /**
   * Get the first error message
   */
  static getFirstError(errors: ProductValidationErrors): string | null {
    const errorMessages = Object.values(errors).filter(Boolean);
    return errorMessages.length > 0 ? errorMessages[0] : null;
  }

  /**
   * Validate single field
   */
  static validateField(fieldName: keyof ProductFormValues, value: any, data: ProductFormValues): string | null {
    const fullErrors = this.validateProduct({ ...data, [fieldName]: value });
    return fullErrors[fieldName] || null;
  }

  /**
   * Sanitize and validate product data in one step
   */
  static sanitizeAndValidate(data: ProductFormValues): {
    sanitizedData: ProductFormValues;
    errors: ProductValidationErrors;
    isValid: boolean;
  } {
    const sanitizedData = this.sanitizeProductData(data);
    const errors = this.validateProduct(sanitizedData);
    const isValid = this.isValid(errors);

    return {
      sanitizedData,
      errors,
      isValid
    };
  }
}