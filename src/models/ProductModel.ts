import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  discountPrice: { 
    type: Number 
  },
  sku: { 
    type: String 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  images: { 
    type: [String], 
    default: [] 
  }
}, {
  timestamps: true // Ini akan otomatis membuat createdAt dan updatedAt
});

// Hindari error "Model already registered" saat hot-reloading di development
export default mongoose.models.Product || mongoose.model('Product', productSchema);