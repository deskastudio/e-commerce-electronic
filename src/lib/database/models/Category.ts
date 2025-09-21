// lib/models/Category.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Function to generate slug from name
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

const categorySchema = new Schema<ICategoryDocument>({
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
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Deskripsi maksimal 500 karakter'],
    default: ''
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
  console.log('🔄 Pre-save middleware triggered');
  console.log('📝 Document name:', this.name);
  console.log('📝 Current slug:', this.slug);
  console.log('📝 isModified name:', this.isModified('name'));
  console.log('📝 isNew:', this.isNew);
  
  if (this.isModified('name') || this.isNew || !this.slug) {
    const generatedSlug = generateSlug(this.name);
    console.log('🔧 Generated slug:', generatedSlug);
    this.slug = generatedSlug;
  }
  
  console.log('✅ Final slug:', this.slug);
  next();
});

// Create indexes for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

// Prevent duplicate model compilation
let CategoryModel: mongoose.Model<ICategoryDocument>;

try {
  CategoryModel = mongoose.model<ICategoryDocument>('Category');
  console.log('✅ Using existing Category model');
} catch (error) {
  CategoryModel = mongoose.model<ICategoryDocument>('Category', categorySchema);
  console.log('✅ Created new Category model');
}

export default CategoryModel;