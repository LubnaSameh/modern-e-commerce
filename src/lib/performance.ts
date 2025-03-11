import { useEffect, useState } from 'react';
import { throttle, debounce } from './utils';

/**
 * Hook to detect if the user is on a slow connection
 */
export function useSlowConnection() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check if the browser supports the Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      // Check if the connection is slow (2G or slower)
      const checkConnection = () => {
        const isEffectiveSlow = connection.effectiveType === '2g' || 
                               connection.effectiveType === 'slow-2g';
        const isSaveData = connection.saveData === true;
        
        setIsSlowConnection(isEffectiveSlow || isSaveData);
      };
      
      // Check connection initially
      checkConnection();
      
      // Listen for changes in connection
      connection.addEventListener('change', checkConnection);
      
      // Clean up
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, []);
  
  return isSlowConnection;
}

/**
 * Hook to detect if the page is visible
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return isVisible;
}

/**
 * Hook to detect if the user is idle
 */
export function useIdleDetection(idleTime = 60000) {
  const [isIdle, setIsIdle] = useState(false);
  
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      setIsIdle(false);
      idleTimer = setTimeout(() => setIsIdle(true), idleTime);
    };
    
    // Throttle the event handlers to prevent excessive function calls
    const throttledResetTimer = throttle(resetIdleTimer, 500);
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', throttledResetTimer);
    window.addEventListener('keypress', throttledResetTimer);
    window.addEventListener('touchstart', throttledResetTimer);
    window.addEventListener('scroll', throttledResetTimer);
    
    // Initialize the timer
    resetIdleTimer();
    
    // Clean up
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', throttledResetTimer);
      window.removeEventListener('keypress', throttledResetTimer);
      window.removeEventListener('touchstart', throttledResetTimer);
      window.removeEventListener('scroll', throttledResetTimer);
    };
  }, [idleTime]);
  
  return isIdle;
}

/**
 * Prefetch resources when the user is idle
 */
export function prefetchResourcesWhenIdle(resources: string[]) {
  if (typeof window === 'undefined' || !('requestIdleCallback' in window)) {
    return;
  }
  
  (window as any).requestIdleCallback(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  });
}

/**
 * Lazy load images that are not in the viewport
 */
export function useLazyLoadImages() {
  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      return;
    }
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
    
    return () => {
      lazyImages.forEach(img => {
        imageObserver.unobserve(img);
      });
    };
  }, []);
}

/**
 * Measure component render time
 */
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
} 