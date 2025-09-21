// src/app/api/admin/orders/[id]/route.ts - API untuk update status order
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/database/services/order-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 [UPDATE ORDER API] Starting...');
    console.log('📥 Order ID:', params.id);
    
    const body = await request.json();
    console.log('📥 Update data:', body);
    
    const { status, paymentStatus, trackingNumber, notes, adminNotes } = body;

    if (!params.id) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Validate at least one field to update
    if (!status && !paymentStatus && !trackingNumber && !notes && !adminNotes) {
      return NextResponse.json({
        success: false,
        error: 'At least one field must be provided for update'
      }, { status: 400 });
    }

    // Update order using service
    const updatedOrder = await OrderService.updateOrder(params.id, {
      status,
      paymentStatus,
      trackingNumber,
      notes: notes || adminNotes
    });

    if (!updatedOrder) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    console.log('✅ Order updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    }, { status: 200 });

  } catch (error) {
    console.error('❌ [UPDATE ORDER API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update order',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📦 [GET ORDER API] Getting order details for:', params.id);

    if (!params.id) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    const order = await OrderService.getOrderById(params.id);

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    console.log('✅ Order details retrieved successfully');

    return NextResponse.json({
      success: true,
      data: order
    }, { status: 200 });

  } catch (error) {
    console.error('❌ [GET ORDER API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order details',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}