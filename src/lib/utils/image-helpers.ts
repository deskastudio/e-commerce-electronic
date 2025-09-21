// src/lib/utils/image-helpers.ts
/**
 * Get the first valid image from an array of image URLs
 */
export function getFirstValidImage(images: string[]): string {
  if (!images || images.length === 0) {
    return '/placeholder.svg';
  }
  
  // Find first non-empty image URL
  const validImage = images.find(img => img && img.trim() !== '' && img !== '/placeholder.svg');
  return validImage || '/placeholder.svg';
}

/**
 * Validate if an image URL is potentially valid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowercaseUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowercaseUrl.includes(ext)) || url.includes('placeholder');
  } catch {
    return false;
  }
}

/**
 * Generate placeholder image URL with text
 */
export function generatePlaceholderImage(
  width: number = 300, 
  height: number = 300, 
  text: string = 'No Image'
): string {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
}

/**
 * Filter valid images from an array
 */
export function filterValidImages(images: string[]): string[] {
  if (!images || images.length === 0) {
    return ['/placeholder.svg'];
  }
  
  const validImages = images.filter(img => img && img.trim() !== '');
  return validImages.length > 0 ? validImages : ['/placeholder.svg'];
}

/**
 * Get image alt text from product name
 */
export function getImageAltText(productName: string, index?: number): string {
  const baseName = productName || 'Product';
  return index !== undefined ? `${baseName} - Image ${index + 1}` : baseName;
}