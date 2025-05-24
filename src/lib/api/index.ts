// lib/api/index.ts (SIMPLIFIED VERSION)

// Export utilities
export {
    createSuccessResponse,
    createErrorResponse,
    createValidationErrorResponse,
    createNotFoundResponse,
    createUnauthorizedResponse,
    createForbiddenResponse,
    createBadRequestResponse,
    parseQueryParams,
    validateRequiredParams,
    sanitizeString,
    parseJsonBody,
    extractFilesFromFormData,
    createPaginatedResponse,
    handleDatabaseOperation,
    CacheHeaders
  } from './utils';
  
  // Export middleware
  export {
    withCors,
    withRateLimit,
    withErrorHandling,
    withLogging,
    composeMiddleware,
    withStandardMiddleware,
    withProtectedMiddleware
  } from './middleware';
  
  // Export types for API development
  export type { ApiResponse, ValidationError } from '@/types';
  
  /**
   * Common API response templates (simplified)
   */
  export const ApiResponses = {
    success: <T = any>(data?: T, message?: string) => 
      createSuccessResponse(data, message),
    
    created: <T = any>(data?: T, message?: string) => 
      createSuccessResponse(data, message, 201),
    
    badRequest: (message?: string) => 
      createBadRequestResponse(message),
    
    unauthorized: (message?: string) => 
      createUnauthorizedResponse(message),
    
    forbidden: (message?: string) => 
      createForbiddenResponse(message),
    
    notFound: (resource?: string) => 
      createNotFoundResponse(resource),
    
    validationError: (errors: ValidationError[], message?: string) => 
      createValidationErrorResponse(errors, message),
    
    serverError: (message?: string) => 
      createErrorResponse('Internal server error', message)
  };
  
  /**
   * API error codes for consistent error handling
   */
  export const ApiErrorCodes = {
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMITED: 'RATE_LIMITED',
    DATABASE_ERROR: 'DATABASE_ERROR',
    UPLOAD_ERROR: 'UPLOAD_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    SERVER_ERROR: 'SERVER_ERROR'
  } as const;
  
  /**
   * Helper functions for common API patterns
   */
  export const ApiHelpers = {
    /**
     * Standard success response
     */
    success: <T = any>(data?: T, message?: string) => 
      createSuccessResponse(data, message),
  
    /**
     * Standard error response
     */
    error: (error: string, message?: string, status: number = 500) => 
      createErrorResponse(error, message, status),
  
    /**
     * Paginated response helper
     */
    paginated: <T = any>(data: T[], total: number, page: number, limit: number, message?: string) =>
      createPaginatedResponse(data, total, page, limit, message)
  };