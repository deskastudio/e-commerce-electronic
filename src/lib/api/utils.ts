// lib/api/utils.ts (FIXED VERSION)
import { NextResponse } from 'next/server';
import { ApiResponse, ValidationError } from '@/types';

/**
 * Create success response
 */
export function createSuccessResponse<T = any>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string,
  message?: string,
  status: number = 500,
  errors?: ValidationError[]
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
    message,
    errors
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Create validation error response
 */
export function createValidationErrorResponse(
  errors: ValidationError[],
  message: string = 'Validation failed'
): NextResponse {
  return createErrorResponse('Validation failed', message, 400, errors);
}

/**
 * Create not found response
 */
export function createNotFoundResponse(
  resource: string = 'Resource'
): NextResponse {
  return createErrorResponse(
    'Not found',
    `${resource} not found`,
    404
  );
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(
  message: string = 'Unauthorized access'
): NextResponse {
  return createErrorResponse(
    'Unauthorized',
    message,
    401
  );
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(
  message: string = 'Access forbidden'
): NextResponse {
  return createErrorResponse(
    'Forbidden',
    message,
    403
  );
}

/**
 * Create bad request response
 */
export function createBadRequestResponse(
  message: string = 'Bad request'
): NextResponse {
  return createErrorResponse(
    'Bad request',
    message,
    400
  );
}

/**
 * Parse query parameters with validation
 */
export function parseQueryParams(url: string) {
  const { searchParams } = new URL(url);
  
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10'))),
    query: searchParams.get('query')?.trim() || '',
    category: searchParams.get('category')?.trim() || '',
    status: searchParams.get('status')?.trim() || '',
    sortBy: searchParams.get('sortBy')?.trim() || '',
    sortOrder: searchParams.get('sortOrder')?.trim() || 'desc',
    search: searchParams.get('search')?.trim() || '',
    active: searchParams.get('active') === 'true',
    withCount: searchParams.get('withCount') === 'true'
  };
}

/**
 * Validate required parameters
 */
export function validateRequiredParams(
  params: Record<string, any>,
  required: string[]
): string[] {
  const missing: string[] = [];
  
  for (const param of required) {
    if (!params[param] || (typeof params[param] === 'string' && !params[param].trim())) {
      missing.push(param);
    }
  }
  
  return missing;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  return input.toString().trim().replace(/[<>]/g, '');
}

/**
 * Validate and parse JSON body
 */
export async function parseJsonBody<T = any>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw new Error('Invalid JSON format in request body');
  }
}

/**
 * Extract file from FormData
 */
export function extractFilesFromFormData(formData: FormData): {
  files: File[];
  metadata: Record<string, string>;
} {
  const files: File[] = [];
  const metadata: Record<string, string> = {};
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files.push(value);
    } else {
      metadata[key] = value.toString();
    }
  }
  
  return { files, metadata };
}

/**
 * Create paginated response structure
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  
  const response: ApiResponse = {
    success: true,
    data: {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    },
    message
  };
  
  return NextResponse.json(response);
}

/**
 * Handle database operations with consistent error handling
 */
export async function handleDatabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Database operation failed'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    // Handle specific database errors
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyPattern || {})[0];
      throw new Error(`${field} sudah digunakan`);
    }
    
    if ((error as any).name === 'ValidationError') {
      const messages = Object.values((error as any).errors || {})
        .map((err: any) => err.message);
      throw new Error(messages.join(', '));
    }
    
    if ((error as any).name === 'CastError') {
      throw new Error('ID tidak valid');
    }
    
    throw error;
  }
}

/**
 * Cache control headers for API responses
 */
export const CacheHeaders = {
  noCache: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  shortCache: {
    'Cache-Control': 'public, max-age=300' // 5 minutes
  },
  longCache: {
    'Cache-Control': 'public, max-age=3600' // 1 hour
  },
  staticAssets: {
    'Cache-Control': 'public, max-age=31536000, immutable' // 1 year
  }
};