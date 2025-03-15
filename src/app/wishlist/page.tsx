"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'react-toastify';

// Define a proper interface for product
interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function WishlistPage() {
  // استخدام متغير حالة بسيط للتحكم في عرض الصفحة
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Access cart and wishlist stores
  const addToCart = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const hydrateStore = useWishlistStore((state) => state.hydrateStore);

  // استدعاء التحميل مرة واحدة عند تركيب المكون
  useEffect(() => {
    // تأكد من أن الكود يعمل فقط في المتصفح
    if (typeof window !== 'undefined') {
      // محاولة تحميل البيانات من localStorage
      try {
        // تحميل البيانات بشكل صريح
        hydrateStore();

        // إعطاء وقت كافٍ للتحميل
        const timer = setTimeout(() => {
          setMounted(true);
          setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Failed to load wishlist data:", error);
        setMounted(true);
        setIsLoading(false);
      }
    }
  }, [hydrateStore]);

  // إضافة منتج إلى سلة التسوق
  const handleAddToCart = (product: WishlistProduct) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: 99,
        quantity: 1
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  // إزالة منتج من المفضلة
  const handleRemoveFromWishlist = (id: string, name: string) => {
    try {
      removeFromWishlist(id);
      toast.success(`${name} removed from wishlist!`);
    } catch (error) {
      toast.error('Failed to remove item from wishlist');
    }
  };

  // مسح كل المفضلة
  const handleClearWishlist = () => {
    try {
      clearWishlist();
      toast.success('Wishlist cleared!');
    } catch (error) {
      toast.error('Failed to clear wishlist');
    }
  };

  // عرض حالة التحميل
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل قائمة المفضلة...</p>
        </div>
      </div>
    );
  }

  // عرض حالة الفراغ
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your Wishlist</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Your wishlist is empty</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // عرض قائمة المفضلة
  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Your Wishlist</h1>
          <div className="flex items-center">
            <p className="mr-4 text-gray-600 dark:text-gray-400">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
            <button
              onClick={handleClearWishlist}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear wishlist
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row"
            >
              <div className="md:w-40 md:h-40 h-48 w-full relative mb-4 md:mb-0 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                {/* استخدام Image العادية بدون OptimizedImage */}
                <img
                  src={item.image || "/images/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    // إذا فشل تحميل الصورة، استخدم الصورة البديلة
                    e.currentTarget.src = "/images/placeholder.jpg";
                  }}
                />
              </div>

              <div className="md:ml-6 flex-grow">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                  ${item.price.toFixed(2)}
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 