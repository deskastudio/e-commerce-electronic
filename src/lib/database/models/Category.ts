// lib/database/models/Category.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '@/types';

// Interface untuk document MongoDB
export interface CategoryDocument extends Omit<Category, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

// Schema definition
const categorySchema = new Schema<CategoryDocument>({
  name: { 
    type: String, 
    required: [true, 'Nama kategori harus diisi'],
    trim: true,
    maxlength: [100, 'Nama kategori maksimal 100 karakter'],
    unique: true
  },
  slug: { 
    type: String, 
    required: [true, 'Slug kategori harus diisi'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[a-z0-9-]+$/, 'Slug hanya boleh menggunakan huruf kecil, angka, dan tanda hubung']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Deskripsi maksimal 500 karakter']
  },
  imageUrl: { 
    type: String,
    trim: true,
    validate: {
      validator: function(url: string) {
        if (!url) return true; // Optional field
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
      },
      message: 'URL gambar tidak valid'
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true,
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

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

// Virtual untuk menghitung jumlah produk dalam kategori
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: 'slug',
  foreignField: 'category',
  count: true
});

// Pre-save middleware untuk auto-generate slug
categorySchema.pre('save', function(this: CategoryDocument, next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
  next();
});

// Static methods
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

categorySchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug, isActive: true });
};

// Instance methods
categorySchema.methods.getProductCount = async function() {
  const ProductModel = mongoose.model('Product');
  return await ProductModel.countDocuments({ category: this.slug, status: 'active' });
};

// Prevent recompilation in development
const CategoryModel = mongoose.models.Category as mongoose.Model<CategoryDocument> || 
                     mongoose.model<CategoryDocument>('Category', categorySchema);

export default CategoryModel;