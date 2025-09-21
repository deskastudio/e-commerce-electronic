// lib/database/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  variant?: {
    color?: string;
    size?: string;
    [key: string]: any;
  };
}

export interface IPaymentProof {
  fileName: string;
  fileUrl: string;
  bankAccount: string;
  transferAmount: number;
  transferDate: Date;
  senderName: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId?: string;
  sessionId?: string;
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'bank_transfer';
  shippingAddress: IShippingAddress;
  notes?: string;
  trackingNumber?: string;
  paymentProof?: IPaymentProof;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingAddressSchema = new Schema<IShippingAddress>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Indonesia' },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productSlug: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
  image: { type: String },
  variant: { type: Schema.Types.Mixed }
});

const PaymentProofSchema = new Schema<IPaymentProof>({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  bankAccount: { type: String, required: true },
  transferAmount: { type: Number, required: true },
  transferDate: { type: Date, required: true },
  senderName: { type: String, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true,
    default: function() {
      return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  customerId: { type: String },
  sessionId: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['bank_transfer'], 
    default: 'bank_transfer' 
  },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  notes: { type: String },
  trackingNumber: { type: String },
  paymentProof: { type: PaymentProofSchema },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String }
}, {
  timestamps: true
});

// Index for better query performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ sessionId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
OrderSchema.pre('save', function(next) {
  if (this.paymentProof) {
    this.paymentProof.updatedAt = new Date();
  }
  next();
});

// Virtual for formatted order number
OrderSchema.virtual('formattedOrderNumber').get(function() {
  return this.orderNumber;
});

// Method to check if order can be cancelled
OrderSchema.methods.canBeCancelled = function() {
  return !['delivered', 'cancelled'].includes(this.status);
};

// Method to check if payment proof can be uploaded
OrderSchema.methods.canUploadPaymentProof = function() {
  return this.paymentMethod === 'bank_transfer' && 
         this.paymentStatus === 'pending' && 
         !['cancelled'].includes(this.status);
};

const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;