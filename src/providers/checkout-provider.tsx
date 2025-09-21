// providers/checkout-provider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/providers/cart-provider';
import { 
  CheckoutContextType, 
  ShippingAddress, 
  CheckoutData, 
  Order 
} from '@/types/checkout';
import { checkoutService } from '@/lib/database/services/checkout-service';

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

interface CheckoutProviderProps {
  children: React.ReactNode;
}

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  const { data: session } = useSession();
  const { cart, clearCart } = useCart();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Session ID for guest users
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('guest-session-id') || '';
    }
    return '';
  });

  const processCheckout = async (data: CheckoutData): Promise<{ success: boolean; order?: Order; error?: string }> => {
    try {
      setIsLoading(true);
      setErrors({});

      console.log('🛒 Processing checkout with data:', data);

      // Validate cart has items
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Prepare checkout request
      const checkoutRequest = {
        customerId: session?.user?.id,
        sessionId: !session?.user?.id ? sessionId : undefined,
        customerName: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
        customerEmail: data.shippingAddress.email,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes
      };

      console.log('📤 Sending checkout request:', checkoutRequest);

      const response = await checkoutService.processCheckout(data);

      if (response.success && response.data) {
        console.log('✅ Checkout successful:', response.data);
        
        setOrder(response.data);
        setShippingAddress(data.shippingAddress);
        setCurrentStep(3); // Move to confirmation step
        
        // Clear cart after successful checkout
        await clearCart();
        
        return { 
          success: true, 
          order: response.data 
        };
      } else {
        throw new Error(response.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrors({ checkout: errorMessage });
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const submitPaymentProof = async (orderId: string, proofData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      setErrors({});

      console.log('📤 Submitting payment proof for order:', orderId);

      const response = await checkoutService.uploadPaymentProof(orderId, proofData);

      if (response.success) {
        console.log('✅ Payment proof uploaded successfully');
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to upload payment proof');
      }
    } catch (error) {
      console.error('❌ Payment proof upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrors({ paymentProof: errorMessage });
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const value: CheckoutContextType = {
    isLoading,
    currentStep,
    shippingAddress,
    paymentMethod,
    order,
    errors,
    setCurrentStep,
    setShippingAddress,
    setPaymentMethod,
    processCheckout,
    submitPaymentProof,
    clearErrors
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Hook for easier access to checkout utilities
export function useCheckoutUtils() {
  const { cart } = useCart();
  
  const calculateShipping = (address?: ShippingAddress) => {
    if (!cart.items.length) return 0;
    return checkoutService.calculateShippingCost(address || {}, cart.items);
  };

  const calculateTax = () => {
    return checkoutService.calculateTax(cart.total);
  };

  const calculateTotal = () => {
    const shipping = calculateShipping();
    const tax = calculateTax();
    return cart.total + shipping + tax;
  };

  const formatCurrency = (amount: number) => {
    return checkoutService.formatCurrency(amount);
  };

  const validateAddress = (address: any) => {
    return checkoutService.validateShippingAddress(address);
  };

  return {
    calculateShipping,
    calculateTax,
    calculateTotal,
    formatCurrency,
    validateAddress
  };
}