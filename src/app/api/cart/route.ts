// app/api/cart/route.ts - UNIFIED FINAL VERSION
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🛒 ===============================================');
  console.log('🛒 UNIFIED CART API STARTING');
  console.log('🛒 ===============================================');
  
  try {
    // Parse request body
    let data;
    try {
      const requestText = await request.text();
      console.log('📥 Raw request body:', requestText);
      data = JSON.parse(requestText);
      console.log('📥 Parsed request data:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { action, userId, sessionId } = data;
    console.log('🔍 Action:', action);
    console.log('🔍 User ID:', userId);
    console.log('🔍 Session ID:', sessionId);

    // Try database connection first
    let useDatabase = true;
    let cartServices;
    
    try {
      console.log('🔄 Testing database connection...');
      const connectDB = (await import('@/lib/database/connection')).default;
      await connectDB();
      console.log('✅ Database connected successfully');
      
      cartServices = await import('@/lib/database/services/cart-service');
      console.log('✅ Cart services imported successfully');
    } catch (dbError) {
      console.warn('⚠️ Database connection failed, using fallback mode:', dbError);
      useDatabase = false;
    }

    // Determine cart identifier
    const cartIdentifier = userId ? { userId } : { sessionId };
    console.log('🔑 Cart identifier:', cartIdentifier);

    switch (action) {
      case 'get': {
        console.log('📦 GET CART ACTION');
        
        if (useDatabase && cartServices) {
          try {
            let cart;
            if (userId) {
              console.log('🔍 Getting cart by user ID...');
              cart = await cartServices.getCartByUserId(userId);
            } else if (sessionId) {
              console.log('🔍 Getting cart by session ID...');
              cart = await cartServices.getCartBySessionId(sessionId);
            }

            if (!cart) {
              console.log('📦 No cart found, creating new one...');
              cart = await cartServices.createCart(cartIdentifier);
            }

            console.log('✅ Database cart retrieved:', cart);
            return NextResponse.json({ cart }, { status: 200 });
          } catch (dbError) {
            console.warn('⚠️ Database get failed, using mock:', dbError);
          }
        }
        
        // Fallback: Return empty cart
        const emptyCart = {
          id: 'mock-cart-id',
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date().toISOString()
        };
        
        console.log('📦 Returning empty cart (fallback)');
        return NextResponse.json({ cart: emptyCart }, { status: 200 });
      }

      case 'add': {
        console.log('➕ ADD TO CART ACTION');
        const { item } = data;
        
        console.log('📦 Item to add:', item);
        console.log('📦 Item type:', typeof item);
        console.log('📦 Item keys:', item ? Object.keys(item) : 'item is null');
        
        // Validation
        if (!item) {
          console.error('❌ Item is null or undefined');
          return NextResponse.json(
            { message: 'Item data tidak ditemukan' },
            { status: 400 }
          );
        }
        
        if (!item.productId) {
          console.error('❌ Missing productId');
          return NextResponse.json(
            { message: 'Product ID diperlukan' },
            { status: 400 }
          );
        }
        
        if (!item.name) {
          console.error('❌ Missing name');
          return NextResponse.json(
            { message: 'Nama produk diperlukan' },
            { status: 400 }
          );
        }
        
        if (typeof item.price !== 'number') {
          console.error('❌ Invalid price type:', typeof item.price, item.price);
          return NextResponse.json(
            { message: 'Harga produk harus berupa angka' },
            { status: 400 }
          );
        }
        
        if (typeof item.quantity !== 'number') {
          console.error('❌ Invalid quantity type:', typeof item.quantity, item.quantity);
          return NextResponse.json(
            { message: 'Quantity harus berupa angka' },
            { status: 400 }
          );
        }

        // Try database first
        if (useDatabase && cartServices) {
          try {
            console.log('✅ Validation passed, adding item to database...');
            const cart = await cartServices.addItemToCart(cartIdentifier, item);
            console.log('✅ Item added to database successfully:', cart);
            
            return NextResponse.json({ 
              cart, 
              message: 'Item berhasil ditambahkan ke keranjang' 
            }, { status: 200 });
          } catch (dbError) {
            console.warn('⚠️ Database add failed, using mock mode:', dbError);
          }
        }
        
        // Fallback: Mock response
        const mockCart = {
          id: 'mock-cart-id',
          items: [{
            id: `mock-item-${Date.now()}`,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            addedAt: new Date().toISOString()
          }],
          total: item.price * item.quantity,
          itemCount: item.quantity,
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Item added to mock cart:', mockCart);
        return NextResponse.json({ 
          cart: mockCart, 
          message: 'Item berhasil ditambahkan ke keranjang (mock mode)' 
        }, { status: 200 });
      }

      case 'remove': {
        console.log('➖ REMOVE FROM CART ACTION');
        const { itemId } = data;
        
        if (!itemId) {
          return NextResponse.json(
            { message: 'Item ID diperlukan' },
            { status: 400 }
          );
        }

        if (useDatabase && cartServices) {
          try {
            const cart = await cartServices.removeItemFromCart(cartIdentifier, itemId);
            if (!cart) {
              return NextResponse.json(
                { message: 'Keranjang tidak ditemukan' },
                { status: 404 }
              );
            }
            return NextResponse.json({ cart, message: 'Item berhasil dihapus dari keranjang' }, { status: 200 });
          } catch (dbError) {
            console.warn('⚠️ Database remove failed:', dbError);
          }
        }

        // Fallback: Return empty cart
        const emptyCart = {
          id: 'mock-cart-id',
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date().toISOString()
        };
        
        return NextResponse.json({ cart: emptyCart, message: 'Item berhasil dihapus (mock)' }, { status: 200 });
      }

      case 'update': {
        console.log('🔄 UPDATE CART ACTION');
        const { itemId, quantity } = data;
        
        if (!itemId || quantity === undefined) {
          return NextResponse.json(
            { message: 'Item ID dan quantity diperlukan' },
            { status: 400 }
          );
        }

        if (useDatabase && cartServices) {
          try {
            const cart = await cartServices.updateCartItemQuantity(cartIdentifier, itemId, quantity);
            if (!cart) {
              return NextResponse.json(
                { message: 'Keranjang tidak ditemukan' },
                { status: 404 }
              );
            }
            return NextResponse.json({ cart, message: 'Quantity berhasil diupdate' }, { status: 200 });
          } catch (dbError) {
            console.warn('⚠️ Database update failed:', dbError);
          }
        }

        // Fallback: Mock updated cart
        const mockCart = {
          id: 'mock-cart-id',
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date().toISOString()
        };
        
        return NextResponse.json({ cart: mockCart, message: 'Quantity berhasil diupdate (mock)' }, { status: 200 });
      }

      case 'clear': {
        console.log('🗑️ CLEAR CART ACTION');
        
        if (useDatabase && cartServices) {
          try {
            const cart = await cartServices.clearCart(cartIdentifier);
            if (cart) {
              return NextResponse.json({ cart, message: 'Keranjang berhasil dikosongkan' }, { status: 200 });
            }
          } catch (dbError) {
            console.warn('⚠️ Database clear failed:', dbError);
          }
        }

        // Fallback: Return empty cart
        const emptyCart = {
          id: 'mock-cart-id',
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date().toISOString()
        };
        
        return NextResponse.json({ cart: emptyCart, message: 'Keranjang berhasil dikosongkan (mock)' }, { status: 200 });
      }

      case 'merge': {
        console.log('🔀 MERGE CART ACTION');
        const { sessionId: guestSessionId, userId: targetUserId } = data;
        
        if (!guestSessionId || !targetUserId) {
          return NextResponse.json(
            { message: 'Session ID dan User ID diperlukan untuk merge' },
            { status: 400 }
          );
        }

        if (useDatabase && cartServices) {
          try {
            const cart = await cartServices.mergeGuestCartToUser(guestSessionId, targetUserId);
            return NextResponse.json({ cart, message: 'Keranjang berhasil digabungkan' }, { status: 200 });
          } catch (dbError) {
            console.warn('⚠️ Database merge failed:', dbError);
          }
        }

        // Fallback: Return empty cart
        const emptyCart = {
          id: 'mock-cart-id',
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date().toISOString()
        };
        
        return NextResponse.json({ cart: emptyCart, message: 'Keranjang berhasil digabungkan (mock)' }, { status: 200 });
      }

      default:
        console.error('❌ Invalid action:', action);
        return NextResponse.json(
          { message: 'Action tidak valid: ' + action },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ ===============================================');
    console.error('❌ CRITICAL ERROR IN UNIFIED CART API');
    console.error('❌ Error:', error);
    console.error('❌ Error message:', (error as Error).message);
    console.error('❌ Error stack:', (error as Error).stack);
    console.error('❌ ===============================================');
    
    return NextResponse.json(
      { 
        message: (error as Error).message || 'Terjadi kesalahan pada server',
        error: (error as Error).name,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    console.log('GET cart with userId:', userId, 'sessionId:', sessionId);

    // Try database first
    try {
      const cartServices = await import('@/lib/database/services/cart-service');

      let cart;
      if (userId) {
        cart = await cartServices.getCartByUserId(userId);
      } else if (sessionId) {
        cart = await cartServices.getCartBySessionId(sessionId);
      }

      if (!cart) {
        const cartIdentifier = userId ? { userId } : { sessionId };
        cart = await cartServices.createCart(cartIdentifier);
      }

      return NextResponse.json({ cart }, { status: 200 });
    } catch (dbError) {
      console.warn('Database GET failed, using fallback:', dbError);
      
      // Fallback: Return empty cart
      const emptyCart = {
        id: 'mock-cart-id',
        items: [],
        total: 0,
        itemCount: 0,
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({ cart: emptyCart }, { status: 200 });
    }
  } catch (error) {
    console.error('Cart GET API error:', error);
    
    return NextResponse.json(
      { message: (error as Error).message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}