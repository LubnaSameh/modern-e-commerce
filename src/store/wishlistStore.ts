import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  totalItems: number;
  
  // Actions
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
}

// Helper function to safely use localStorage (only in browser)
const getStorage = () => {
  let storage;
  
  // Only use localStorage in the browser
  if (typeof window !== 'undefined') {
    storage = createJSONStorage(() => localStorage);
  } else {
    // Provide mock storage for SSR
    storage = {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }
  
  return storage;
};

// Create the store with persist middleware
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      
      addToWishlist: (item: WishlistItem) => {
        try {
          // Ensure we have a valid item with required fields
          if (!item || !item.id) {
            console.error('Invalid item data:', item);
            return;
          }
          
          const currentItems = get().items || [];
          const existingItem = currentItems.find(i => i && i.id === item.id);
          
          if (!existingItem) {
            // Create a new array to ensure state update is detected
            const newItems = [...currentItems, item];
            set({
              items: newItems,
              totalItems: newItems.length
            });
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error);
        }
      },
      
      removeFromWishlist: (itemId: string) => {
        try {
          if (!itemId) {
            console.error('Invalid item ID for removal');
            return;
          }
          
          const items = get().items || [];
          const updatedItems = items.filter(item => item && item.id !== itemId);
          
          set({
            items: updatedItems,
            totalItems: updatedItems.length
          });
        } catch (error) {
          console.error('Error removing from wishlist:', error);
        }
      },
      
      isInWishlist: (itemId: string) => {
        try {
          if (!itemId) return false;
          
          const items = get().items || [];
          return items.some(item => item && item.id === itemId);
        } catch (error) {
          console.error('Error checking wishlist:', error);
          return false;
        }
      },
      
      clearWishlist: () => {
        try {
          set({
            items: [],
            totalItems: 0
          });
        } catch (error) {
          console.error('Error clearing wishlist:', error);
        }
      }
    }),
    {
      name: 'wishlist-storage',
      storage: getStorage(),
      
      // Set skipHydration to false to allow automatic hydration
      skipHydration: false,
      
      // Only store the data we need
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems
      }),
      
      version: 1,
      
      // Add onRehydrateStorage to handle rehydration events
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Wishlist store rehydrated successfully');
        } else {
          console.error('Failed to rehydrate wishlist store');
        }
      }
    }
  )
);

// Initialize once on the client side
if (typeof window !== 'undefined') {
  // Ensure this only happens once on initial load
  const initStore = () => {
    try {
      // Force rehydration to ensure data is loaded from localStorage
      useWishlistStore.persist.rehydrate();
    } catch (error) {
      console.error('Error initializing wishlist store:', error);
    }
  };
  
  // Call once after the page has loaded
  if (document.readyState === 'complete') {
    initStore();
  } else {
    window.addEventListener('load', initStore);
    // Also add DOMContentLoaded for earlier initialization
    document.addEventListener('DOMContentLoaded', initStore);
  }
} 