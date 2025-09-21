// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import mongoose from 'mongoose';

/**
 * Combine Tailwind classes with proper merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Convert MongoDB document to plain object
 */
export function documentToObject<T>(doc: any): T {
  if (!doc) return doc;
  
  if (doc.toObject && typeof doc.toObject === 'function') {
    const obj = doc.toObject();
    if (obj._id) {
      obj.id = obj._id.toString();
      delete obj._id;
    }
    if (obj.__v !== undefined) {
      delete obj.__v;
    }
    return obj;
  }
  
  // Handle plain objects from .lean() queries
  if (doc._id) {
    const obj = { ...doc };
    obj.id = obj._id.toString();
    delete obj._id;
    if (obj.__v !== undefined) {
      delete obj.__v;
    }
    return obj;
  }
  
  return doc;
}

/**
 * Handle database errors with proper error messages
 */
export function handleDatabaseError(error: any): never {
  console.error('Database error:', error);
  
  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    const value = Object.values(error.keyValue || {})[0] || 'value';
    throw new Error(`${field} "${value}" sudah digunakan`);
  }
  
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    throw new Error(messages[0] || 'Data tidak valid');
  }
  
  if (error.name === 'CastError') {
    throw new Error('ID tidak valid');
  }
  
  if (error.message) {
    throw new Error(error.message);
  }
  
  throw new Error('Terjadi kesalahan pada database');
}

/**
 * Sanitize string for URL slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
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
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Parse sort parameter for MongoDB queries
 */
export function parseSortParam(sort?: string): Record<string, 1 | -1> {
  if (!sort) return { createdAt: -1 };
  
  const sortObj: Record<string, 1 | -1> = {};
  const parts = sort.split(',');
  
  parts.forEach(part => {
    const trimmed = part.trim();
    if (trimmed.startsWith('-')) {
      sortObj[trimmed.substring(1)] = -1;
    } else {
      sortObj[trimmed] = 1;
    }
  });
  
  return sortObj;
}

/**
 * Create pagination object
 */
export function createPagination(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return { skip, limit };
}

/**
 * Calculate pagination info
 */
export function calculatePageInfo(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage
  };
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
 * Generate SKU
 */
export function generateSKU(prefix: string = 'PROD'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}