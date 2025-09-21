// app/api/checkout/route.ts - UPDATED WITH CONSISTENT PRICING
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/connection';
import OrderModel from '@/lib/database/models/Order';
import { ApiResponse } from '@/types/checkout';

// Consistent pricing functions (same as frontend)
function calculateShippingCost(address: any, items: any[]): number {
  const baseShipping = 15000; // Rp 15,000
  
  const totalWeight = items.reduce((total, item) => {
    return total + ((item.quantity || 1) * 0.5); // 0.5kg per item
  }, 0);
  const weightCost = totalWeight * 2000; // Rp 2,000 per 0.5kg
  
  let distanceCost = 0;
  const city = address?.city?.toLowerCase() || '';
  
  if (city.includes('jakarta')) {
    distanceCost = 0;
  } else if (
    city.includes('bandung') || 
    city.includes('bogor') || 
    city.includes('tangerang') || 
    city.includes('bekasi') ||
    city.includes('depok')
  ) {
    distanceCost = 5000;
  } else if (
    city.includes('surabaya') || 
    city.includes('medan') || 
    city.includes('semarang') ||
    city.includes('yogyakarta') ||
    city.includes('malang')
  ) {
    distanceCost = 15000;
  } else {
    distanceCost = 25000;
  }
  
  const totalShipping = baseShipping + weightCost + distanceCost;
  console.log('🚚 Backend shipping calculation:', {
    baseShipping,
    totalWeight,
    weightCost,
    city,
    distanceCost,
    totalShipping
  });
  
  return totalShipping;
}

function calculateTax(subtotal: number): number {
  const tax = Math.round(subtotal * 0.11); // 11% PPN, rounded
  console.log('💰 Backend tax calculation:', { subtotal, tax });
  return tax;
}

// Helper function to get cart items from cart API
async function getCartItems(sessionId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const cartResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'get',
        sessionId
      })
    });
    
    if (!cartResponse.ok) {
      console.error('❌ Cart API response not OK:', cartResponse.status);
      throw new Error('Failed to fetch cart items');
    }
    
    const cartData = await cartResponse.json();
    console.log('📦 Cart API response:', cartData);
    return cartData.cart?.items || [];
  } catch (error) {
    console.error('❌ Failed to fetch cart items:', error);
    return [];
  }
}

// Helper function to clear cart after successful checkout
async function clearCartAfterCheckout(sessionId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'clear',
        sessionId
      })
    });
    console.log('✅ Cart cleared after checkout');
  } catch (error) {
    console.error('❌ Failed to clear cart after checkout:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🛒 ===============================================');
    console.log('🛒 CHECKOUT API - Starting...');
    console.log('🛒 ===============================================');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('📥 Checkout request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    const { 
      shippingAddress, 
      paymentMethod, 
      notes, 
      sessionId, 
      customerName, 
      customerEmail,
      calculatedPricing 
    } = body;

    console.log('📋 Extracted data:', {
      hasShippingAddress: !!shippingAddress,
      paymentMethod,
      sessionId,
      customerName,
      customerEmail,
      hasCalculatedPricing: !!calculatedPricing
    });

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: shippingAddress, paymentMethod'
      }, { status: 400 });
    }

    let finalSessionId = sessionId || request.headers.get('x-session-id');
    
    if (!finalSessionId) {
      console.log('❌ No sessionId found in request');
      return NextResponse.json({
        success: false,
        error: 'Session ID is required for guest checkout'
      }, { status: 400 });
    }

    console.log('🔑 Using session ID:', finalSessionId);

    // Validate shipping address fields
    const requiredFields = ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'postalCode', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required shipping address field: ${field}`
        }, { status: 400 });
      }
    }

    const finalCustomerName = customerName || `${shippingAddress.firstName} ${shippingAddress.lastName}`;
    const finalCustomerEmail = customerEmail || shippingAddress.email;

    console.log('👤 Customer info:', { finalCustomerName, finalCustomerEmail });

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Get cart items from cart system
    console.log('🛒 Fetching cart items for session:', finalSessionId);
    let cartItems = await getCartItems(finalSessionId);
    
    // If no cart items found, create sample items for testing
    if (!cartItems || cartItems.length === 0) {
      console.log('⚠️ No cart items found, creating sample items for testing');
      cartItems = [
        {
          productId: 'sample-1',
          name: 'Sample Product 1',
          price: 100000,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ];
    }

    console.log('📦 Using cart items:', cartItems);

    // Convert cart items to order items format
    const orderItems = cartItems.map((item: any) => ({
      productId: item.productId || item.id || 'unknown',
      productName: item.name || 'Unknown Product',
      productSlug: (item.name || 'unknown-product').toLowerCase().replace(/\s+/g, '-'),
      price: item.price || 0,
      quantity: item.quantity || 1,
      subtotal: (item.price || 0) * (item.quantity || 1),
      image: item.image || '/placeholder.svg',
      variant: item.variant
    }));

    // Use frontend calculated pricing if available, otherwise calculate here
    let subtotal, shippingCost, tax, total;
    
    if (calculatedPricing) {
      console.log('💰 Using frontend calculated pricing:', calculatedPricing);
      subtotal = calculatedPricing.subtotal;
      shippingCost = calculatedPricing.shippingCost;
      tax = calculatedPricing.tax;
      total = calculatedPricing.total;
    } else {
      console.log('💰 Calculating pricing on backend');
      subtotal = orderItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);
      shippingCost = calculateShippingCost(shippingAddress, orderItems);
      tax = calculateTax(subtotal);
      total = subtotal + shippingCost + tax;
    }

    console.log('🧮 Final totals used:', { subtotal, shippingCost, tax, total });

    // Create order data
    const orderData = {
      sessionId: finalSessionId,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      paymentMethod,
      shippingAddress,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending'
    };

    console.log('📝 Creating order with data:', JSON.stringify(orderData, null, 2));

    // Create order in database
    const newOrder = await OrderModel.create(orderData);
    console.log('✅ Order created successfully:', newOrder._id, newOrder.orderNumber);

    // Clear cart after successful order creation (only if we got real cart items)
    if (cartItems.length > 0 && cartItems[0].productId !== 'sample-1') {
      console.log('🧹 Clearing cart after successful checkout...');
      await clearCartAfterCheckout(finalSessionId);
    }

    // Format response
    const orderResponse = {
      id: newOrder._id.toString(),
      orderNumber: newOrder.orderNumber,
      customerId: null,
      sessionId: newOrder.sessionId,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      shippingCost: newOrder.shippingCost,
      tax: newOrder.tax,
      total: newOrder.total,
      status: newOrder.status,
      paymentStatus: newOrder.paymentStatus,
      paymentMethod: newOrder.paymentMethod,
      shippingAddress: newOrder.shippingAddress,
      notes: newOrder.notes,
      createdAt: newOrder.createdAt.toISOString(),
      updatedAt: newOrder.updatedAt.toISOString()
    };

    const response: ApiResponse = {
      success: true,
      data: orderResponse,
      message: 'Order created successfully'
    };

    console.log('✅ CHECKOUT API - Success');
    console.log('🛒 ===============================================');
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    console.error('❌ CHECKOUT API error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Failed to process checkout',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}