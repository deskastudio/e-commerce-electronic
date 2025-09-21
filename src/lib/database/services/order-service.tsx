// lib/database/services/order-service.ts - Server-side Order Service
import connectDB from '@/lib/database/connection';
import mongoose from 'mongoose';

// Import Order model safely
function getOrderModel() {
  try {
    return mongoose.models.Order || require('@/lib/database/models/Order').default;
  } catch (error) {
    console.error('Error loading Order model:', error);
    throw new Error('Order model not found');
  }
}

export interface OrderSearchParams {
  page?: string;
  query?: string;
  status?: string;
  paymentStatus?: string;
  limit?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items: any[];
  shippingAddress: any;
  paymentProof?: any;
  trackingNumber?: string;
  notes?: string;
}

export class OrderService {
  
  private static async connect() {
    await connectDB();
  }

  /**
   * Get orders with pagination and filters (SERVER-SIDE)
   */
  static async getOrdersPaginated(
    page: number = 1,
    limit: number = 10,
    searchParams: OrderSearchParams = {}
  ) {
    try {
      console.log('🔄 OrderService.getOrdersPaginated() - Starting...');
      console.log('📥 Params:', { page, limit, searchParams });
      
      await this.connect();
      const OrderModel = getOrderModel();

      const { query, status, paymentStatus } = searchParams;
      
      // Build filters
      const filters: Record<string, any> = {};
      
      if (status && status !== 'all') {
        filters.status = status;
        console.log('📋 Adding status filter:', status);
      }
      
      if (paymentStatus && paymentStatus !== 'all') {
        filters.paymentStatus = paymentStatus;
        console.log('📋 Adding payment status filter:', paymentStatus);
      }

      // Build search query
      if (query && query.trim()) {
        filters.$or = [
          { orderNumber: { $regex: query.trim(), $options: 'i' } },
          { customerName: { $regex: query.trim(), $options: 'i' } },
          { customerEmail: { $regex: query.trim(), $options: 'i' } }
        ];
        console.log('📋 Adding search query:', query.trim());
      }

      const skip = (page - 1) * limit;
      console.log('📋 Pagination:', { skip, limit });

      // Execute queries
      const [orders, total] = await Promise.all([
        OrderModel
          .find(filters)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments(filters)
      ]);

      const totalPages = Math.ceil(total / limit);

      console.log('✅ Orders fetched:', orders.length, 'of', total);
      
      // Debug: Log first order to see structure
      if (orders.length > 0) {
        console.log('🔍 First order structure:', JSON.stringify(orders[0], null, 2));
      }

      return {
        orders: orders.map(this.formatOrder),
        total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('❌ OrderService.getOrdersPaginated() error:', error);
      throw new Error(`Gagal mengambil data order: ${(error as Error).message}`);
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id: string): Promise<AdminOrder | null> {
    try {
      console.log('🔄 OrderService.getOrderById() - Starting...');
      console.log('📥 Order ID:', id);
      
      await this.connect();
      const OrderModel = getOrderModel();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('❌ Invalid ObjectId format');
        return null;
      }

      const order = await OrderModel.findById(id).lean();
      
      if (!order) {
        console.log('📭 Order not found');
        return null;
      }

      console.log('✅ Raw order from DB:', JSON.stringify(order, null, 2));
      const formattedOrder = this.formatOrder(order);
      console.log('✅ Formatted order:', JSON.stringify(formattedOrder, null, 2));
      
      return formattedOrder;
    } catch (error) {
      console.error('❌ OrderService.getOrderById() error:', error);
      return null;
    }
  }

  /**
   * Update order status
   */
  static async updateOrder(id: string, updateData: {
    status?: string;
    paymentStatus?: string;
    trackingNumber?: string;
    notes?: string;
  }): Promise<AdminOrder | null> {
    try {
      console.log('🔄 OrderService.updateOrder() - Starting...');
      console.log('📥 Order ID:', id);
      console.log('📤 Update data:', JSON.stringify(updateData, null, 2));
      
      await this.connect();
      const OrderModel = getOrderModel();

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID order tidak valid');
      }

      // Check if order exists
      const existingOrder = await OrderModel.findById(id);
      if (!existingOrder) {
        console.log('📭 Order not found');
        return null;
      }

      // Prepare update data with timestamps
      const finalUpdateData: any = { ...updateData };

      if (updateData.status) {
        if (updateData.status === 'shipped' && !existingOrder.shippedAt) {
          finalUpdateData.shippedAt = new Date();
        }
        if (updateData.status === 'delivered' && !existingOrder.deliveredAt) {
          finalUpdateData.deliveredAt = new Date();
        }
        if (updateData.status === 'cancelled' && !existingOrder.cancelledAt) {
          finalUpdateData.cancelledAt = new Date();
          if (updateData.notes) finalUpdateData.cancelReason = updateData.notes;
        }
      }

      if (updateData.paymentStatus === 'paid' && existingOrder.paymentProof) {
        finalUpdateData['paymentProof.status'] = 'approved';
        finalUpdateData['paymentProof.verifiedAt'] = new Date();
        finalUpdateData['paymentProof.verifiedBy'] = 'admin';
      }

      console.log('📝 Final update data:', JSON.stringify(finalUpdateData, null, 2));

      const updatedOrder = await OrderModel
        .findByIdAndUpdate(id, finalUpdateData, { new: true, runValidators: true })
        .lean();

      if (!updatedOrder) {
        console.log('❌ Failed to update order');
        return null;
      }

      console.log('✅ Order updated successfully:', updatedOrder._id, '- Order Number:', updatedOrder.orderNumber);
      return this.formatOrder(updatedOrder);
    } catch (error) {
      console.error('❌ OrderService.updateOrder() error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Gagal mengupdate order');
    }
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    pendingPayments: number;
  }> {
    try {
      console.log('📊 OrderService.getOrderStats() - Starting...');
      
      await this.connect();
      const OrderModel = getOrderModel();
      
      const [
        totalOrders,
        pendingOrders,
        completedOrders,
        pendingPayments,
        revenueResult
      ] = await Promise.all([
        OrderModel.countDocuments(),
        OrderModel.countDocuments({ status: 'pending' }),
        OrderModel.countDocuments({ status: 'delivered' }),
        OrderModel.countDocuments({ paymentStatus: 'pending' }),
        OrderModel.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ])
      ]);

      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      const stats = {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        pendingPayments
      };

      console.log('✅ Order stats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ OrderService.getOrderStats() error:', error);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        pendingPayments: 0
      };
    }
  }

  /**
   * Format order document to AdminOrder type
   */
  private static formatOrder(doc: any): AdminOrder {
    console.log('📋 Formatting order - Raw doc keys:', Object.keys(doc));
    console.log('📋 Raw document data:', {
      _id: doc._id,
      orderNumber: doc.orderNumber,
      customerName: doc.customerName,
      customerEmail: doc.customerEmail,
      items: doc.items?.length || 0
    });
    
    const formatted: AdminOrder = {
      id: doc._id ? doc._id.toString() : '',
      orderNumber: doc.orderNumber || 'N/A',
      customerName: doc.customerName || 'Unknown',
      customerEmail: doc.customerEmail || 'unknown@email.com',
      items: doc.items || [],
      itemCount: doc.items ? doc.items.length : 0,
      total: typeof doc.total === 'number' ? doc.total : 0,
      status: doc.status || 'pending',
      paymentStatus: doc.paymentStatus || 'pending',
      shippingAddress: doc.shippingAddress || {},
      notes: doc.notes || '',
      trackingNumber: doc.trackingNumber || '',
      paymentProof: doc.paymentProof || null,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
    };
    
    console.log('📋 Formatted order result:', formatted);
    return formatted;
  }
}