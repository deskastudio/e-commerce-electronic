import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags?: string[];
  stock: number;
  rating?: number;
  numReviews?: number;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  discountPrice: { 
    type: Number, 
    min: 0 
  },
  images: [{ 
    type: String
  }],
  category: { 
    type: String, 
    required: true 
  },
  subcategory: { 
    type: String 
  },
  tags: [{ 
    type: String 
  }],
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  rating: { 
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: { 
    type: Number,
    default: 0
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Generate slug from name if not provided
ProductSchema.pre<IProduct>('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);