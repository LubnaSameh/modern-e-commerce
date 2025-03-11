'use client';

import { useEffect } from 'react';

/**
 * CriticalCSSInjector component
 * 
 * This component injects critical CSS into the page to improve performance
 * by preventing layout shifts during page load.
 */
export function CriticalCSSInjector() {
  useEffect(() => {
    // Remove any server-rendered "critical" CSS after the page has fully loaded
    // This prevents any potential flash of unstyled content
    const style = document.getElementById('critical-css');
    if (style) {
      // Give the browser a moment to apply styles before removing the critical CSS
      // to avoid any potential FOUC (Flash of Unstyled Content)
      setTimeout(() => {
        style.parentNode?.removeChild(style);
      }, 100);
    }

    // Mark that client-side hydration is complete
    document.documentElement.dataset.hydrated = 'true';
  }, []);

  return null; // This component doesn't render anything
} 