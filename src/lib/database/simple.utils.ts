// src/lib/simple-utils.ts
// Simple utility functions that don't require external dependencies

/**
 * Simple class name combiner
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  /**
   * Format currency to Indonesian Rupiah
   */
  export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  /**
   * Format number with thousands separator
   */
  export function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
  }
  
  /**
   * Truncate text with ellipsis
   */
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Generate random string
   */
  export function generateRandomString(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Check if value is empty
   */
  export function isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }
  
  /**
   * Sleep/delay function
   */
  export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Simple error handler
   */
  export function handleError(error: any, context?: string): string {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    if (error.message) {
      return error.message;
    }
    
    return 'Terjadi kesalahan sistem';
  }