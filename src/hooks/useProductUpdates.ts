import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { apiCache } from '@/lib/api-cache';

/**
 * Custom hook for real-time product updates.
 * This hook manages checking for product updates and triggering refreshes.
 */
export function useProductUpdates() {
    const pathname = usePathname();
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [isProductUpdated, setIsProductUpdated] = useState(false);

    // Function to force a refresh from the server
    const refreshProducts = () => {
        // Clear all product-related cache
        apiCache.clear();

        // Update timestamp to trigger re-fetching
        setLastUpdate(Date.now());

        // Reset the update flag
        setIsProductUpdated(false);
    };

    // Periodically check for product updates when user is on relevant pages
    useEffect(() => {
        // Only set up polling if we're on a page that displays products
        const isRelevantPage = ['/', '/shop', '/categories'].some(path =>
            pathname === path || pathname?.startsWith(path + '/')
        );

        if (!isRelevantPage) return;

        const checkForNotifications = async () => {
            try {
                const response = await fetch('/api/notify');
                if (response.ok) {
                    const data = await response.json();

                    // If there's a product-update event more recent than our last update
                    if (data.event === 'product-update' && data.lastNotification > lastUpdate) {
                        console.log('Product update notification detected');
                        setIsProductUpdated(true);
                        setLastUpdate(data.lastNotification);
                    }
                }
            } catch (error) {
                console.error('Error checking for product updates:', error);
            }
        };

        // Initial check
        checkForNotifications();

        // Set up interval for checking
        const interval = setInterval(checkForNotifications, 5000);

        // Also check when tab becomes active
        const handleFocus = () => {
            checkForNotifications();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, [pathname, lastUpdate]);

    return {
        isProductUpdated,
        lastUpdate,
        refreshProducts
    };
} 