// lib/database/utils.ts
import { PaginationParams, PaginatedResponse } from '@/types';
import { Document, Model } from 'mongoose';

/**
 * Calculate pagination parameters
 */
export function calculatePagination(page: number = 1, limit: number = 10): PaginationParams {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
  
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

/**
 * Execute paginated query
 */
export async function executePaginatedQuery<T extends Document>(
  model: Model<T>,
  query: any = {},
  options: {
    page?: number;
    limit?: number;
    sort?: any;
    populate?: string | string[];
  } = {}
): Promise<PaginatedResponse<T>> {
  const { page = 1, limit = 10, sort = { createdAt: -1 }, populate } = options;
  
  const pagination = calculatePagination(page, limit);
  
  // Execute count and find queries in parallel
  const [total, data] = await Promise.all([
    model.countDocuments(query),
    model
      .find(query)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate(populate || '')
      .lean()
  ]);
  
  return createPaginatedResponse(data, total, pagination.page, pagination.limit);
}

/**
 * Convert document to plain object with id field
 */
export function documentToObject<T extends Document>(doc: T): any {
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

/**
 * Handle database errors
 */
export function handleDatabaseError(error: any): never {
  console.error('Database Error:', error);
  
  // Handle specific MongoDB errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    throw new Error(`${field} sudah digunakan`);
  }
  
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    throw new Error(messages.join(', '));
  }
  
  if (error.name === 'CastError') {
    throw new Error('ID tidak valid');
  }
  
  // Generic error
  throw new Error(error.message || 'Database operation failed');
}

/**
 * Validate ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Build search query for text search
 */
export function buildSearchQuery(query: string, fields: string[] = []) {
  if (!query.trim()) return {};
  
  const searchRegex = new RegExp(query.trim(), 'i');
  
  if (fields.length === 0) {
    return { $text: { $search: query.trim() } };
  }
  
  return {
    $or: fields.map(field => ({
      [field]: searchRegex
    }))
  };
}

/**
 * Build filter query from search params
 */
export function buildFilterQuery(filters: Record<string, any>): Record<string, any> {
  const query: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        query[key] = { $in: value };
      } else {
        query[key] = value;
      }
    }
  });
  
  return query;
}