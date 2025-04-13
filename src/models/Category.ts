// models/Category.ts

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CategoryFormValues {
    name: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
  }
  
  // Fungsi untuk menghasilkan slug dari nama
  export function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }