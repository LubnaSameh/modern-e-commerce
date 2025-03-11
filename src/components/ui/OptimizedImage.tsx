'use client';

import { useState, useEffect, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  lowQualitySrc?: string;
  loadingClassName?: string;
}

function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  lowQualitySrc,
  className,
  loadingClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(lowQualitySrc || src);
  const [isError, setIsError] = useState(false);

  // When src changes, reset loading state and use the new src
  useEffect(() => {
    setIsLoading(true);
    setImgSrc(lowQualitySrc || src);
    setIsError(false);
  }, [src, lowQualitySrc]);

  // Handle successful image load
  const handleLoad = () => {
    setIsLoading(false);
    // If we were using a low quality placeholder, switch to the high quality image
    if (lowQualitySrc && imgSrc === lowQualitySrc) {
      setImgSrc(src);
    }
  };

  // Handle image load error
  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
    setImgSrc(fallbackSrc);
  };

  return (
    <Image
      {...props}
      src={isError ? fallbackSrc : imgSrc}
      alt={alt}
      className={cn(
        className,
        isLoading && loadingClassName,
        isLoading && 'animate-pulse bg-gray-200 dark:bg-gray-800'
      )}
      onLoadingComplete={handleLoad}
      onError={handleError}
      loading="lazy"
      quality={props.quality || 75}
    />
  );
}

export default memo(OptimizedImage); 