import mongoose, { Schema, Document } from 'mongoose';

interface OrderItem {
  product: Schema.Types.ObjectId;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderItems: [
    {
      product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  shippingPrice: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  taxPrice: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  totalPrice: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  isPaid: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  paidAt: { 
    type: Date 
  },
  isDelivered: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  deliveredAt: { 
    type: Date 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
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

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);