// src/app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/database/services/cart-service';
import { getToken } from 'next-auth/jwt';

/**
 * DELETE /api/cart/remove - Remove specific item from cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    const sessionId = request.cookies.get('cart-session')?.value;

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cart = await CartService.removeFromCart(
      productId,
      token?.sub, // user ID dari token
      sessionId
    );

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error: any) {
    console.error('DELETE /api/cart/remove error:', error);

    if (error.message === 'Cart not found') {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to remove item from cart' 
      },
      { status: 500 }
    );
  }
}