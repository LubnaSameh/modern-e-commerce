/**
 * Service Worker Registration Utility
 * 
 * This file handles the registration of the service worker for offline functionality
 * and PWA capabilities.
 */

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      const swUrl = '/service-worker.js';
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Check for updates periodically
          registration.update();
          
          // Set up periodic updates
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check for updates every hour
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('Service workers are not supported in this browser or environment.');
  }
} 