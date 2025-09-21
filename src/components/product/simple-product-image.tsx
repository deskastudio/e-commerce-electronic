// src/components/common/simple-product-image.tsx - Fallback Product Image Component
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface SimpleProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
}

export default function SimpleProductImage({
  src,
  alt,
  width = 200,
  height = 200,
  className = "",
  fallbackText = "P",
  priority = false
}: SimpleProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if src is valid
  const isValidImage = src && src.trim() !== '' && src !== '/placeholder.svg' && !hasError;

  if (!isValidImage) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-600 ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="text-center">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <span className="text-2xl font-bold">{fallbackText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        priority={priority}
        unoptimized // For external images
      />
    </div>
  );
}