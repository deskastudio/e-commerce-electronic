// models/CategoryModel.ts atau .js
import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama kategori diperlukan'],
    trim: true,
    maxlength: [50, 'Nama tidak boleh lebih dari 50 karakter']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    maxlength: [500, 'Deskripsi tidak boleh lebih dari 500 karakter']
  },
  imageUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Mencegah error ketika model sudah dikompilasi
const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default CategoryModel;