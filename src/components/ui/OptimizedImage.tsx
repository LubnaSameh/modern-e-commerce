'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

// تعريف خصائص المكون
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  fallbackSrc?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * مكون محسن لعرض الصور مع معالجة الأخطاء وتحميل الصور البديلة
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  fallbackSrc = '/images/placeholder.jpg',
  objectFit = 'cover'
}: OptimizedImageProps) {
  // استخدام الصورة العادية بدلاً من next/image لتفادي مشاكل hydration
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

  // معالجة تغييرات مصدر الصورة
  useEffect(() => {
    setImageSrc(src || fallbackSrc);
    setIsError(false);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  const handleError = () => {
    console.log(`Image failed to load: ${imageSrc}`);
    setIsError(true);
    setIsLoading(false);

    // استخدام الصورة البديلة فقط إذا كانت مختلفة عن الصورة الأصلية
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // النمط العام للحاوية
  const containerStyle = {
    position: 'relative' as const,
    overflow: 'hidden',
    width: fill ? '100%' : width,
    height: fill ? '100%' : height,
  };

  // عرض أيقونة بديلة في حالة خطأ الصورة
  if (isError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}
        style={containerStyle}
      >
        <ImageIcon className="text-gray-400 h-1/4 w-1/4" />
      </div>
    );
  }

  // استخدام الصورة العادية
  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      <img
        src={imageSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectFit }}
      />
    </div>
  );
}