// lib/database/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Product, ProductStatus } from '@/types';

// Interface untuk document MongoDB (extends Mongoose Document)
export interface ProductDocument extends Omit<Product, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

// Schema definition
const productSchema = new Schema<ProductDocument>({
  name: { 
    type: String, 
    required: [true, 'Nama produk harus diisi'],
    trim: true,
    maxlength: [200, 'Nama produk maksimal 200 karakter']
  },
  description: { 
    type: String, 
    required: [true, 'Deskripsi produk harus diisi'],
    trim: true,
    maxlength: [2000, 'Deskripsi maksimal 2000 karakter']
  },
  price: { 
    type: Number, 
    required: [true, 'Harga produk harus diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  discountPrice: { 
    type: Number,
    min: [0, 'Harga diskon tidak boleh negatif'],
    validate: {
      validator: function(this: ProductDocument, value: number) {
        return !value || value < this.price;
      },
      message: 'Harga diskon harus lebih kecil dari harga normal'
    }
  },
  cost: { 
    type: Number,
    min: [0, 'Biaya tidak boleh negatif']
  },
  sku: { 
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true,
    uppercase: true
  },
  barcode: { 
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  stock: { 
    type: Number, 
    required: [true, 'Stok produk harus diisi'], 
    min: [0, 'Stok tidak boleh negatif'],
    default: 0 
  },
  category: { 
    type: String, 
    required: [true, 'Kategori produk harus dipilih'],
    trim: true
  },
  status: { 
    type: String, 
    enum: {
      values: ['active', 'draft', 'archived'] as ProductStatus[],
      message: 'Status harus salah satu dari: active, draft, archived'
    },
    default: 'active'
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10;
      },
      message: 'Maksimal 10 tags per produk'
    }
  },
  images: { 
    type: [String], 
    required: [true, 'Minimal satu gambar produk harus diunggah'],
    validate: {
      validator: function(images: string[]) {
        return images.length > 0 && images.length <= 5;
      },
      message: 'Produk harus memiliki 1-5 gambar'
    }
  },
  
  // Additional product properties
  isPhysical: { 
    type: Boolean, 
    default: true 
  },
  isTaxable: { 
    type: Boolean, 
    default: true 
  },
  isShippingRequired: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1, status: 1 }); // Filter by category and status
productSchema.index({ status: 1, createdAt: -1 }); // Admin listing
productSchema.index({ price: 1 }); // Price range queries
productSchema.index({ stock: 1 }); // Stock queries

// Virtual for calculating effective price
productSchema.virtual('effectivePrice').get(function(this: ProductDocument) {
  return this.discountPrice || this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function(this: ProductDocument) {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware
productSchema.pre('save', function(this: ProductDocument, next) {
  // Auto-generate SKU if not provided
  if (!this.sku && this.isNew) {
    this.sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  // Ensure tags are unique and trimmed
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.map(tag => tag.trim()).filter(Boolean))];
  }
  
  next();
});

// Static methods
productSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, status: 'active' });
};

productSchema.statics.findLowStock = function(threshold: number = 5) {
  return this.find({ stock: { $lte: threshold }, status: 'active' });
};

productSchema.statics.searchProducts = function(query: string) {
  return this.find({
    $text: { $search: query },
    status: 'active'
  }).sort({ score: { $meta: 'textScore' } });
};

// Prevent recompilation in development
const ProductModel = mongoose.models.Product as mongoose.Model<ProductDocument> || 
                   mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;