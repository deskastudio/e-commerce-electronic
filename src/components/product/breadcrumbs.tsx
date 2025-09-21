// src/components/product/breadcrumb.tsx - Breadcrumb Navigation
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Product } from '@/types/product';

interface BreadcrumbProps {
  product: Product;
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  // Format category name
  const formatCategoryName = (category: string): string => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = formatCategoryName(product.category);

  return (
    <nav className="bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center space-x-2 text-sm">
          
          {/* Home */}
          <Link 
            href="/" 
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {/* Shop */}
          <Link 
            href="/shop" 
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            Shop
          </Link>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {/* Category */}
          <Link 
            href={`/category/${product.category}`} 
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            {categoryName}
          </Link>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {/* Current Product */}
          <span className="text-gray-900 font-medium truncate max-w-md">
            {product.name}
          </span>
          
        </div>
      </div>
    </nav>
  );
}