// lib/database/services/checkout-service.ts - COMPLETE WITH getOrder METHOD
import { CheckoutData, ShippingAddress, Order } from '@/types/checkout';
import { PricingService } from './pricing-service';

export class CheckoutService {
  /**
   * Process checkout and create order
   */
  static async processCheckout(data: CheckoutData): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      console.log('🛒 CheckoutService: Processing checkout...', data);

      // Get session ID for guest users
      let sessionId: string | undefined;
      if (typeof window !== 'undefined') {
        sessionId = localStorage.getItem('guest-session-id') || undefined;
        console.log('🔑 Session ID from localStorage:', sessionId);
      }

      // Prepare complete request body with session ID
      const requestBody = {
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        sessionId: sessionId,
        customerName: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
        customerEmail: data.shippingAddress.email,
        calculatedPricing: data.calculatedPricing || undefined
      };

      console.log('📤 Complete request body:', requestBody);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId && { 'x-session-id': sessionId })
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status);

      const result = await response.json();
      console.log('📥 Response data:', result);

      if (response.ok) {
        console.log('✅ Checkout processed successfully:', result);
        return {
          success: true,
          data: result.data || result.order,
        };
      } else {
        console.error('❌ Checkout failed:', result);
        return {
          success: false,
          error: result.error || result.message || 'Checkout failed',
        };
      }
    } catch (error) {
      console.error('❌ Checkout service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * FIXED: Get order by ID - This was missing!
   */
  static async getOrder(orderId: string, sessionId?: string): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      console.log('📦 Fetching order:', orderId, sessionId ? `(sessionId: ${sessionId})` : '');

      const url = sessionId 
        ? `/api/orders/${orderId}?sessionId=${sessionId}`
        : `/api/orders/${orderId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Order fetch response status:', response.status);

      const result = await response.json();
      console.log('📥 Order fetch response data:', result);

      if (response.ok) {
        return {
          success: true,
          data: result.order || result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || result.message || 'Order not found',
        };
      }
    } catch (error) {
      console.error('❌ Get order error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Upload payment proof
   */
  static async uploadPaymentProof(orderId: string, proofData: FormData): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log('📤 Uploading payment proof for order:', orderId);

      const response = await fetch(`/api/orders/${orderId}/payment-proof`, {
        method: 'POST',
        body: proofData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Payment proof uploaded successfully');
        return { success: true };
      } else {
        console.error('❌ Payment proof upload failed:', result);
        return {
          success: false,
          error: result.message || 'Failed to upload payment proof',
        };
      }
    } catch (error) {
      console.error('❌ Payment proof upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Validate shipping address
   */
  static validateShippingAddress(address: Partial<ShippingAddress>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!address.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!address.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!address.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!address.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(address.phone)) {
      errors.push('Please enter a valid Indonesian phone number');
    }

    if (!address.streetAddress?.trim()) {
      errors.push('Street address is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State/Province is required');
    }

    if (!address.postalCode?.trim()) {
      errors.push('Postal code is required');
    } else if (!/^[0-9]{5}$/.test(address.postalCode)) {
      errors.push('Please enter a valid 5-digit postal code');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate shipping cost using pricing service
   */
  static calculateShippingCost(address: ShippingAddress | {}, items: any[] = []): number {
    return PricingService.calculateShippingCost(address, items);
  }

  /**
   * Calculate tax using pricing service
   */
  static calculateTax(subtotal: number): number {
    return PricingService.calculateTax(subtotal);
  }

  /**
   * Format currency using pricing service
   */
  static formatCurrency(amount: number): string {
    return PricingService.formatCurrency(amount);
  }

  /**
   * FIXED: Alias for getOrder to match the error in console
   */
  static async getOrderById(orderId: string, sessionId?: string): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    return this.getOrder(orderId, sessionId);
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId: string): Promise<{
    success: boolean;
    data?: Order[];
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`);
      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result.orders,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Failed to fetch orders',
        };
      }
    } catch (error) {
      console.error('❌ Get user orders error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Helper method to ensure session ID is available
   */
  static ensureSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('guest-session-id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('guest-session-id', sessionId);
        console.log('🆔 Created new session ID:', sessionId);
      }
      return sessionId;
    }
    return '';
  }

  /**
   * Debug method to check session state
   */
  static debugSessionState(): void {
    if (typeof window !== 'undefined') {
      const sessionId = localStorage.getItem('guest-session-id');
      console.log('🔍 Session State Debug:', {
        sessionId,
        hasSessionId: !!sessionId,
        localStorage: Object.keys(localStorage),
        userAgent: navigator.userAgent.slice(0, 50)
      });
    }
  }
}

// Export as default for easier importing
export const checkoutService = CheckoutService;