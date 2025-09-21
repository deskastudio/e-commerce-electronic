// components/admin/products/product-image.tsx - IMPROVED VERSION
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
}

export default function ProductImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  fallbackText,
  priority = false
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fileExists, setFileExists] = useState(false);

  // Enhanced fallback component
  const FallbackImage = ({ reason }: { reason?: string }) => {
    const letter = (fallbackText || alt.charAt(0) || 'P').toUpperCase();
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold border rounded ${className}`}
        style={{ width, height }}
      >
        <div style={{ fontSize: Math.min(width, height) * 0.3 }}>
          {letter}
        </div>
        {width > 60 && (
          <div className="text-xs text-gray-500 mt-1 text-center px-1">
            <div>No Image</div>
            {process.env.NODE_ENV === 'development' && reason && (
              <div className="text-red-500 text-[10px]">{reason}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Process and validate image URL
  const processImageUrl = (url: string | null | undefined): string | null => {
    console.log('🔍 ProductImage processing URL:', url);
    
    if (!url || 
        url.trim() === '' || 
        url === '/placeholder.svg' ||
        url === 'null' ||
        url === 'undefined') {
      console.log('❌ Invalid URL provided');
      return null;
    }

    const cleanUrl = url.trim();
    
    // External URL - use as is
    if (cleanUrl.startsWith('http')) {
      console.log('🌐 External URL:', cleanUrl);
      return cleanUrl;
    }
    
    // Static file URL - ensure correct format
    if (cleanUrl.startsWith('/uploads/')) {
      console.log('📁 Static file URL:', cleanUrl);
      return cleanUrl;
    }
    
    // Handle legacy paths
    if (cleanUrl.startsWith('/products/')) {
      const correctedPath = `/uploads${cleanUrl}`;
      console.log('🔧 Corrected path:', correctedPath);
      return correctedPath;
    }
    
    // Just filename - construct full path
    if (!cleanUrl.startsWith('/')) {
      const fullPath = `/uploads/products/${cleanUrl}`;
      console.log('🔗 Constructed path:', fullPath);
      return fullPath;
    }
    
    console.log('🤔 Using URL as-is:', cleanUrl);
    return cleanUrl;
  };

  // Check if file exists (client-side)
  const checkFileExists = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.log('🔍 File check failed for:', url, error);
      return false;
    }
  };

  useEffect(() => {
    const processedSrc = processImageUrl(src);
    
    if (!processedSrc) {
      setImageError(true);
      setIsLoading(false);
      setImageSrc('');
      return;
    }

    setImageSrc(processedSrc);
    setImageError(false);
    setIsLoading(true);

    // Check if file exists
    checkFileExists(processedSrc).then(exists => {
      setFileExists(exists);
      if (!exists) {
        console.log('❌ File does not exist:', processedSrc);
      }
    });

    console.log('🖼️ ProductImage setup:', {
      original: src,
      processed: processedSrc
    });
  }, [src]);

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imageSrc);
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('❌ Image failed to load:', imageSrc);
    setIsLoading(false);
    setImageError(true);
  };

  // Show fallback if no valid image or error
  if (!imageSrc || imageError) {
    return <FallbackImage reason={
      !imageSrc ? 'No URL' : 
      !fileExists ? 'File not found' : 
      'Load error'
    } />;
  }

  return (
    <div className={`relative overflow-hidden bg-gray-50 rounded ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={priority}
        unoptimized={true}
      />
      
      {/* Debug info - development only */}
      {process.env.NODE_ENV === 'development' && width > 100 && (
        <div className="absolute -bottom-12 left-0 right-0 bg-black bg-opacity-75 text-white text-[10px] p-1 truncate z-20">
          <div>Src: {src}</div>
          <div>Final: {imageSrc}</div>
          <div>Exists: {fileExists ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}