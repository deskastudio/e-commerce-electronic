// lib/api/middleware.ts (FIXED VERSION)
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

/**
 * CORS middleware for API routes
 */
export function withCors(handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const response = await handler(request, ...args);
      
      // Add CORS headers to response
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    } catch (error) {
      console.error('CORS middleware error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error'
      }, { status: 500 });
    }
  };
}

/**
 * Rate limiting middleware (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: { 
    maxRequests?: number; 
    windowMs?: number; 
  } = {}
) {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000 } = options; // 100 requests per 15 minutes default

  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
    
    // Check current client's rate limit
    const clientData = rateLimitMap.get(clientIP);
    
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= maxRequests) {
          const response: ApiResponse = {
            success: false,
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again after ${Math.ceil((clientData.resetTime - now) / 1000)} seconds.`
          };
          
          return NextResponse.json(response, { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': Math.max(0, maxRequests - clientData.count).toString(),
              'X-RateLimit-Reset': clientData.resetTime.toString()
            }
          });
        }
        clientData.count++;
      } else {
        // Reset window
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
      }
    } else {
      // First request from this client
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    }
    
    try {
      const response = await handler(request, ...args);
      
      // Add rate limit headers
      const clientInfo = rateLimitMap.get(clientIP)!;
      response.headers.set('X-RateLimit-Limit', maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - clientInfo.count).toString());
      response.headers.set('X-RateLimit-Reset', clientInfo.resetTime.toString());
      
      return response;
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error'
      }, { status: 500 });
    }
  };
}

/**
 * Error handling middleware
 */
export function withErrorHandling(handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle specific error types
      if (error instanceof SyntaxError) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid JSON format',
          message: 'Request body contains invalid JSON'
        };
        return NextResponse.json(response, { status: 400 });
      }
      
      if ((error as any).code === 'ENOTFOUND') {
        const response: ApiResponse = {
          success: false,
          error: 'Database connection failed',
          message: 'Unable to connect to database'
        };
        return NextResponse.json(response, { status: 503 });
      }
      
      // Generic error response
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
      };
      
      return NextResponse.json(response, { status: 500 });
    }
  };
}

/**
 * Logging middleware
 */
export function withLogging(handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const start = Date.now();
    const method = request.method;
    const url = request.url;
    
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Started`);
    
    try {
      const response = await handler(request, ...args);
      const duration = Date.now() - start;
      
      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${response.status} (${duration}ms)`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`[${new Date().toISOString()}] ${method} ${url} - ERROR (${duration}ms):`, error);
      throw error;
    }
  };
}

/**
 * Compose multiple middlewares
 */
export function composeMiddleware(...middlewares: any[]) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

/**
 * Standard API middleware stack
 */
export const withStandardMiddleware = composeMiddleware(
  withErrorHandling,
  withLogging,
  withCors
);

/**
 * API middleware with rate limiting
 */
export const withProtectedMiddleware = composeMiddleware(
  withErrorHandling,
  withLogging,
  withRateLimit,
  withCors
);