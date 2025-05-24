// src/types/common.ts
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }
  
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface SearchParams {
    query?: string;
    page?: number;
    limit?: number;
  }