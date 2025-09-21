// types/checkout.ts - ENHANCED WITH PROPER TYPES
export interface ShippingAddress {
    id?: string;
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
  
  export interface CheckoutData {
    shippingAddress: ShippingAddress;
    paymentMethod: 'bank_transfer';
    notes?: string;
    calculatedPricing?: {
      subtotal: number;
      shippingCost: number;
      tax: number;
      total: number;
    };
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    customerId?: string;
    sessionId?: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: 'bank_transfer';
    shippingAddress: ShippingAddress;
    notes?: string;
    trackingNumber?: string;
    paymentProof?: PaymentProof;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OrderItem {
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
  
  export interface PaymentProof {
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
  
  export interface CheckoutContextType {
    isLoading: boolean;
    currentStep: number;
    shippingAddress: ShippingAddress | null;
    paymentMethod: string;
    order: Order | null;
    errors: Record<string, string>;
    setCurrentStep: (step: number) => void;
    setShippingAddress: (address: ShippingAddress) => void;
    setPaymentMethod: (method: string) => void;
    processCheckout: (data: CheckoutData) => Promise<{ success: boolean; order?: Order; error?: string }>;
    submitPaymentProof: (orderId: string, proofData: FormData) => Promise<{ success: boolean; error?: string }>;
    clearErrors: () => void;
  }
  
  // FIXED: Add API response types
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  // FIXED: Enhanced checkout request type
  export interface CheckoutRequest {
    shippingAddress: ShippingAddress;
    paymentMethod: 'bank_transfer';
    notes?: string;
    sessionId?: string;
    customerName?: string;
    customerEmail?: string;
    calculatedPricing?: {
      subtotal: number;
      shippingCost: number;
      tax: number;
      total: number;
    };
  }