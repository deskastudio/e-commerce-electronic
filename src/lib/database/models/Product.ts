// lib/database/models/Product.ts - Minimal Product Model
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Nama produk harus diisi'],
    trim: true,
    maxlength: [200, 'Nama produk maksimal 200 karakter']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi produk harus diisi'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand harus diisi'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model harus diisi'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU harus diisi'],
    trim: true,
    unique: true,
    uppercase: true
  },
  condition: {
    type: String,
    enum: {
      values: ['new', 'refurbished', 'used-like-new', 'used-good'],
      message: 'Kondisi harus salah satu dari: new, refurbished, used-like-new, used-good'
    },
    default: 'new'
  },
  warranty: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Harga produk harus diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stok tidak boleh negatif']
  },
  category: {
    type: String,
    required: [true, 'Kategori harus dipilih'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'draft', 'archived'],
      message: 'Status harus salah satu dari: active, draft, archived'
    },
    default: 'active'
  },
  images: [{
    type: String,
    required: true
  }]
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

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', model: 'text' });
productSchema.index({ brand: 1, model: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware
productSchema.pre('save', function(next) {
  console.log('🔄 Product pre-save middleware triggered');
  console.log('📝 Product:', this.name, '- Brand:', this.brand, '- Model:', this.model);

  // Ensure at least one image
  if (!this.images || this.images.length === 0) {
    console.log('🖼️ No images provided, setting placeholder');
    this.images = ["/placeholder.svg"];
  }

  // Convert SKU to uppercase
  if (this.sku) {
    this.sku = this.sku.toUpperCase();
  }

  console.log('✅ Product pre-save validation passed');
  next();
});

// Post-save middleware for logging
productSchema.post('save', function(doc) {
  console.log('✅ Product saved successfully:', doc.name, '(SKU:', doc.sku, ')');
});

// Instance methods
productSchema.methods.getFormattedPrice = function() {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(this.price);
};

productSchema.methods.isLowStock = function(threshold = 10) {
  return this.stock <= threshold;
};

productSchema.methods.isOutOfStock = function() {
  return this.stock === 0;
};

productSchema.methods.getFullName = function() {
  return `${this.brand} ${this.model} - ${this.name}`;
};

productSchema.methods.getConditionText = function() {
  const conditionMap = {
    'new': 'Baru',
    'refurbished': 'Refurbished',
    'used-like-new': 'Bekas Seperti Baru',
    'used-good': 'Bekas Kondisi Baik'
  };
  return conditionMap[this.condition] || this.condition;
};

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: { $ne: 'archived' } });
};

productSchema.statics.findByBrand = function(brand) {
  return this.find({ 
    brand: new RegExp(brand, 'i'), 
    status: { $ne: 'archived' } 
  });
};

productSchema.statics.findBySKU = function(sku) {
  return this.findOne({ sku: sku.toUpperCase() });
};

// Prevent duplicate model registration in Next.js
let Product;

try {
  Product = mongoose.model('Product');
  console.log('✅ Using existing Product model');
} catch (error) {
  Product = mongoose.model('Product', productSchema);
  console.log('✅ Created new Product model');
}

export default Product;