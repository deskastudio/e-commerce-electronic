// src/app/api/admin/orders/route.ts - SIMPLIFIED & FIXED
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import OrderModel from '@/lib/database/models/Order';

// GET - Get all orders for admin (SIMPLIFIED)
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [ADMIN API] GET /api/admin/orders - Starting...');
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    console.log('🔍 Query params:', { page, limit, status, paymentStatus, search });

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Build query filters
    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('🔍 MongoDB query:', JSON.stringify(query, null, 2));

    const skip = (page - 1) * limit;
    
    // Get orders and count - SIMPLIFIED ERROR HANDLING
    const [orders, totalCount] = await Promise.all([
      OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      OrderModel.countDocuments(query).exec()
    ]);

    console.log(`📊 Found ${orders.length} orders, ${totalCount} total`);

    // Format orders - SIMPLIFIED
    const formattedOrders = orders.map(order => ({
      id: order._id?.toString() || '',
      orderNumber: order.orderNumber || 'N/A',
      customerId: order.customerId || null,
      sessionId: order.sessionId || null,
      customerName: order.customerName || 'Unknown',
      customerEmail: order.customerEmail || 'unknown@email.com',
      items: order.items || [],
      itemCount: order.items ? order.items.length : 0,
      subtotal: Number(order.subtotal) || 0,
      shippingCost: Number(order.shippingCost) || 0,
      tax: Number(order.tax) || 0,
      total: Number(order.total) || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || 'bank_transfer',
      shippingAddress: order.shippingAddress || {},
      notes: order.notes || '',
      trackingNumber: order.trackingNumber || '',
      paymentProof: order.paymentProof || null,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString()
    }));

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      success: true,
      data: formattedOrders,
      pagination: {
        current: page,
        total: totalPages,
        limit,
        totalCount
      },
      message: `Found ${formattedOrders.length} orders`
    };

    console.log('✅ [ADMIN API] Success:', {
      ordersCount: formattedOrders.length,
      totalCount,
      page,
      totalPages
    });

    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ [ADMIN API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      pagination: { current: 1, total: 1, limit: 10, totalCount: 0 }
    }, { status: 500 });
  }
}

// PUT - Update order status (SIMPLIFIED)
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 [ADMIN API] PUT /api/admin/orders - Starting...');
    
    const body = await request.json();
    const { orderId, status, paymentStatus, trackingNumber, notes } = body;

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Find and update order
    const order = await OrderModel.findById(orderId);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    // Update fields
    if (status) {
      order.status = status;
      
      // Set timestamps based on status
      if (status === 'shipped' && !order.shippedAt) {
        order.shippedAt = new Date();
      }
      if (status === 'delivered' && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
      if (status === 'cancelled' && !order.cancelledAt) {
        order.cancelledAt = new Date();
        if (notes) order.cancelReason = notes;
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      
      // If approving payment proof
      if (paymentStatus === 'paid' && order.paymentProof) {
        order.paymentProof.status = 'approved';
        order.paymentProof.verifiedAt = new Date();
        order.paymentProof.verifiedBy = 'admin';
      }
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    console.log('✅ Order updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
        updatedAt: order.updatedAt.toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ [ADMIN API] PUT Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update order',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}