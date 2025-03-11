"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'react-toastify';
import Image from "next/image";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Properly memoize the selector to avoid recreating objects on each render
  const addToCart = useCartStore((state) => state.addItem);
  
  // Access wishlist store functions individually to avoid creating new objects each render
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  // Handle hydration - IMPORTANT: Must be done outside component render cycle
  useEffect(() => {
    // Initialize only once when component mounts
    if (typeof window !== 'undefined') {
      // This is safe to run on mount
      const hydrateStore = async () => {
        try {
          // Force rehydration to ensure data is loaded from localStorage
          useWishlistStore.persist.rehydrate();
          
          // Wait a short time to ensure hydration is complete
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (e) {
          console.error("Error during hydration:", e);
        } finally {
          setMounted(true);
          setIsLoading(false);
        }
      };

      hydrateStore();
    }
  }, []);

  const handleAddToCart = (product: any) => {
    try {
      if (!product || !product.id) {
        toast.error('Invalid product data');
        return;
      }
      
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    try {
      if (!id) {
        toast.error('Invalid product ID');
        return;
      }
      
      removeFromWishlist(id);
      toast.info(`${name} removed from wishlist`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  // Show loading state until client-side hydration is complete
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Your Wishlist</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Safely access wishlist items
  const items = wishlistItems || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Your Wishlist</h1>
      
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Your wishlist is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse our products and add some items to your wishlist.
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
              <button
                onClick={() => {
                  clearWishlist();
                  toast.info('Wishlist cleared');
                }}
                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Clear wishlist
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02]"
                >
                  <div className="relative pb-[56.25%] overflow-hidden">
                    {item.image ? (
                      <div className="relative w-full h-full absolute top-0 left-0">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover transition-transform hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Link href={`/shop/${item.id}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">{item.name}</h3>
                    </Link>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 mb-4">
                      ${item.price.toFixed(2)}
                    </p>
                    
                    <div className="flex mt-4 space-x-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                        type="button"
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                        className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Remove from wishlist"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 