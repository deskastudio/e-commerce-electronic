// lib/database/services/pricing-service.ts
// Unified pricing calculation service for consistent frontend-backend pricing

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    variant?: {
      size?: string;
      color?: string;
      [key: string]: any;
    };
  }
  
  export interface ShippingAddress {
    firstName?: string;
    lastName?: string;
    company?: string;
    streetAddress?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
  }
  
  export interface PricingBreakdown {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    itemCount?: number;
  }
  
  export class PricingService {
    // Tax rate (11% PPN for Indonesia)
    private static readonly TAX_RATE = 0.11;
    
    // Shipping rates by province (in IDR)
    private static readonly SHIPPING_RATES: Record<string, number> = {
      // Free shipping areas (Jakarta and surrounding)
      'DKI Jakarta': 0,
      'Jawa Barat': 15000,
      'Banten': 20000,
      
      // Java Island
      'Jawa Tengah': 25000,
      'DI Yogyakarta': 25000,
      'Jawa Timur': 30000,
      
      // Sumatra
      'Sumatera Utara': 50000,
      'Sumatera Barat': 55000,
      'Sumatera Selatan': 50000,
      'Riau': 55000,
      'Kepulauan Riau': 60000,
      'Jambi': 50000,
      'Bengkulu': 55000,
      'Lampung': 45000,
      'Bangka Belitung': 60000,
      'Aceh': 65000,
      
      // Kalimantan
      'Kalimantan Barat': 60000,
      'Kalimantan Tengah': 65000,
      'Kalimantan Selatan': 60000,
      'Kalimantan Timur': 65000,
      'Kalimantan Utara': 70000,
      
      // Sulawesi
      'Sulawesi Utara': 65000,
      'Sulawesi Tengah': 70000,
      'Sulawesi Selatan': 60000,
      'Sulawesi Tenggara': 70000,
      'Gorontalo': 70000,
      'Sulawesi Barat': 70000,
      
      // Eastern Indonesia
      'Bali': 35000,
      'Nusa Tenggara Barat': 45000,
      'Nusa Tenggara Timur': 70000,
      'Maluku': 80000,
      'Maluku Utara': 85000,
      'Papua': 100000,
      'Papua Barat': 100000
    };
  
    // Free shipping threshold (in IDR)
    private static readonly FREE_SHIPPING_THRESHOLD = 500000; // 500k IDR
  
    /**
     * Calculate subtotal from cart items
     */
    static calculateSubtotal(items: CartItem[]): number {
      return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
  
    /**
     * Calculate item count from cart items
     */
    static calculateItemCount(items: CartItem[]): number {
      return items.reduce((count, item) => count + item.quantity, 0);
    }
  
    /**
     * Calculate shipping cost based on destination and order value
     */
    static calculateShippingCost(
      shippingAddress: ShippingAddress | {} = {}, 
      items: CartItem[] = []
    ): number {
      const subtotal = this.calculateSubtotal(items);
      
      // Free shipping if order value is above threshold
      if (subtotal >= this.FREE_SHIPPING_THRESHOLD) {
        return 0;
      }
  
      // Get shipping address state
      const state = (shippingAddress as ShippingAddress).state;
      
      // If no state specified, return default shipping cost
      if (!state) {
        return 25000; // Default shipping cost
      }
  
      // Return shipping cost for the state, or default if not found
      return this.SHIPPING_RATES[state] || 30000;
    }
  
    /**
     * Calculate tax (PPN 11% on subtotal only, not including shipping)
     */
    static calculateTax(subtotal: number): number {
      return Math.round(subtotal * this.TAX_RATE);
    }
  
    /**
     * Calculate complete order totals
     */
    static calculateOrderTotals(
      items: CartItem[], 
      shippingAddress: ShippingAddress | {} = {}
    ): PricingBreakdown {
      const subtotal = this.calculateSubtotal(items);
      const shippingCost = this.calculateShippingCost(shippingAddress, items);
      const tax = this.calculateTax(subtotal);
      const total = subtotal + shippingCost + tax;
      const itemCount = this.calculateItemCount(items);
  
      return {
        subtotal,
        shippingCost,
        tax,
        total,
        itemCount
      };
    }
  
    /**
     * Format currency in Indonesian Rupiah
     */
    static formatCurrency(amount: number): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
  
    /**
     * Parse currency string back to number (for form inputs)
     */
    static parseCurrency(currencyString: string): number {
      // Remove currency symbols and formatting, keep only numbers
      const cleanString = currencyString.replace(/[^\d]/g, '');
      return parseInt(cleanString) || 0;
    }
  
    /**
     * Get shipping info for a specific province
     */
    static getShippingInfo(state: string, subtotal: number = 0): {
      cost: number;
      isFree: boolean;
      freeShippingEligible: boolean;
      amountNeededForFreeShipping: number;
    } {
      const baseCost = this.SHIPPING_RATES[state] || 30000;
      const isFree = subtotal >= this.FREE_SHIPPING_THRESHOLD;
      const freeShippingEligible = subtotal < this.FREE_SHIPPING_THRESHOLD;
      const amountNeededForFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
  
      return {
        cost: isFree ? 0 : baseCost,
        isFree,
        freeShippingEligible,
        amountNeededForFreeShipping
      };
    }
  
    /**
     * Validate pricing calculations (for debugging)
     */
    static validatePricing(
      items: CartItem[], 
      shippingAddress: ShippingAddress | {} = {}
    ): {
      isValid: boolean;
      errors: string[];
      calculations: PricingBreakdown;
    } {
      const errors: string[] = [];
      
      // Validate items
      if (!Array.isArray(items)) {
        errors.push('Items must be an array');
      } else {
        items.forEach((item, index) => {
          if (typeof item.price !== 'number' || item.price < 0) {
            errors.push(`Item ${index + 1}: Invalid price`);
          }
          if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            errors.push(`Item ${index + 1}: Invalid quantity`);
          }
        });
      }
  
      // Calculate totals
      const calculations = this.calculateOrderTotals(items, shippingAddress);
  
      // Validate calculations
      if (calculations.subtotal < 0) {
        errors.push('Subtotal cannot be negative');
      }
      if (calculations.shippingCost < 0) {
        errors.push('Shipping cost cannot be negative');
      }
      if (calculations.tax < 0) {
        errors.push('Tax cannot be negative');
      }
      if (calculations.total !== calculations.subtotal + calculations.shippingCost + calculations.tax) {
        errors.push('Total calculation mismatch');
      }
  
      return {
        isValid: errors.length === 0,
        errors,
        calculations
      };
    }
  
    /**
     * Get all available shipping rates
     */
    static getAllShippingRates(): Record<string, number> {
      return { ...this.SHIPPING_RATES };
    }
  
    /**
     * Get free shipping threshold
     */
    static getFreeShippingThreshold(): number {
      return this.FREE_SHIPPING_THRESHOLD;
    }
  
    /**
     * Get tax rate
     */
    static getTaxRate(): number {
      return this.TAX_RATE;
    }
  
    /**
     * Create sample pricing data (for testing/demo purposes)
     */
    static createSamplePricing(): PricingBreakdown {
      const sampleItems: CartItem[] = [
        {
          productId: 'sample-1',
          name: 'Sample Laptop',
          price: 8500000,
          quantity: 1
        },
        {
          productId: 'sample-2',
          name: 'Sample Mouse',
          price: 250000,
          quantity: 2
        }
      ];
  
      const sampleAddress: ShippingAddress = {
        state: 'DKI Jakarta',
        city: 'Jakarta Pusat'
      };
  
      return this.calculateOrderTotals(sampleItems, sampleAddress);
    }
  
    /**
     * Debug pricing calculations (logs detailed breakdown)
     */
    static debugPricing(
      items: CartItem[], 
      shippingAddress: ShippingAddress | {} = {}
    ): void {
      console.log('🧮 PRICING DEBUG - Detailed Breakdown:');
      console.log('📦 Items:', items);
      console.log('📍 Shipping Address:', shippingAddress);
      
      const subtotal = this.calculateSubtotal(items);
      console.log('💰 Subtotal calculation:', subtotal);
      
      const shippingCost = this.calculateShippingCost(shippingAddress, items);
      console.log('🚚 Shipping calculation:', shippingCost);
      
      const tax = this.calculateTax(subtotal);
      console.log('🧾 Tax calculation:', tax);
      
      const total = subtotal + shippingCost + tax;
      console.log('💳 Total calculation:', total);
      
      const validation = this.validatePricing(items, shippingAddress);
      console.log('✅ Validation:', validation);
    }
  }