import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  totalItems: number;

  // Actions
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
  hydrateStore: () => void;
}

// التحقق من وجود window لتجنب مشاكل SSR
const isBrowser = typeof window !== 'undefined';

// دالة المساعدة للتأكد من صحة رابط الصورة
const ensureValidImageUrl = (url?: string): string => {
  // صورة افتراضية للاستخدام في حالة عدم وجود رابط صالح
  const defaultImage = '/images/placeholder.jpg';

  // التحقق من وجود رابط
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return defaultImage;
  }

  // إذا كان الرابط يبدأ بـ / فهو مسار محلي نسبي
  if (url.startsWith('/')) {
    return url;
  }

  // إذا كان الرابط يبدأ بـ http أو https فهو رابط مطلق
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // معالجة المسارات النسبية
  return `/${url}`;
};

// إنشاء متجر Zustand مع middleware للتخزين المستمر
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      // إضافة عنصر إلى المفضلة
      addToWishlist: (item: WishlistItem) => {
        try {
          if (!item || !item.id) {
            console.error('Invalid item data:', item);
            return;
          }

          // التأكد من صحة رابط الصورة
          const validatedItem = {
            ...item,
            image: ensureValidImageUrl(item.image)
          };

          // التحقق من عدم وجود العنصر مسبقاً
          const currentItems = get().items || [];
          const existingItem = currentItems.find(i => i && i.id === validatedItem.id);

          if (!existingItem) {
            // إنشاء مصفوفة جديدة لضمان تحديث الحالة
            const newItems = [...currentItems, validatedItem];

            // تحديث المتجر
            set({
              items: newItems,
              totalItems: newItems.length
            });

            // حفظ في localStorage يدوياً أيضاً للتأكيد
            if (isBrowser) {
              try {
                localStorage.setItem('wishlist-storage', JSON.stringify({
                  state: { items: newItems, totalItems: newItems.length },
                  version: 1
                }));
              } catch (e) {
                console.error('Manual localStorage save failed:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error);
        }
      },

      // إزالة عنصر من المفضلة
      removeFromWishlist: (itemId: string) => {
        try {
          if (!itemId) {
            console.error('Invalid item ID for removal');
            return;
          }

          const items = get().items || [];
          const updatedItems = items.filter(item => item && item.id !== itemId);

          // تحديث المتجر
          set({
            items: updatedItems,
            totalItems: updatedItems.length
          });

          // حفظ في localStorage يدوياً أيضاً للتأكيد
          if (isBrowser) {
            try {
              localStorage.setItem('wishlist-storage', JSON.stringify({
                state: { items: updatedItems, totalItems: updatedItems.length },
                version: 1
              }));
            } catch (e) {
              console.error('Manual localStorage save failed:', e);
            }
          }
        } catch (error) {
          console.error('Error removing from wishlist:', error);
        }
      },

      // التحقق مما إذا كان العنصر موجوداً في المفضلة
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

      // مسح المفضلة بالكامل
      clearWishlist: () => {
        try {
          // تحديث المتجر
          set({
            items: [],
            totalItems: 0
          });

          // مسح من localStorage يدوياً أيضاً للتأكيد
          if (isBrowser) {
            try {
              localStorage.setItem('wishlist-storage', JSON.stringify({
                state: { items: [], totalItems: 0 },
                version: 1
              }));
            } catch (e) {
              console.error('Manual localStorage clear failed:', e);
            }
          }
        } catch (error) {
          console.error('Error clearing wishlist:', error);
        }
      },

      // طريقة صريحة لتحميل البيانات من localStorage في أي وقت
      hydrateStore: () => {
        try {
          if (!isBrowser) return;

          // الحصول على البيانات من localStorage مباشرة
          const storageKey = 'wishlist-storage';
          const storedData = localStorage.getItem(storageKey);

          if (storedData) {
            try {
              const parsedData = JSON.parse(storedData);
              const state = parsedData.state;

              if (state && state.items) {
                // تصفية العناصر للتأكد من صحتها
                const validItems = state.items
                  .filter(item => item && item.id)
                  .map(item => ({
                    ...item,
                    // ضمان وجود مسار صحيح للصورة
                    image: item.image || '/images/placeholder.jpg'
                  }));

                // تحديث المتجر بالبيانات المستردة
                set({
                  items: validItems,
                  totalItems: validItems.length
                });

                // طباعة رسالة تأكيد
                console.log(`Wishlist loaded with ${validItems.length} items from localStorage`);
                return;
              }
            } catch (err) {
              console.error('Error parsing wishlist data:', err);
              // مسح البيانات التالفة
              localStorage.removeItem(storageKey);
            }
          }

          // إذا وصلنا إلى هنا، فإن البيانات إما غير موجودة أو تالفة
          console.log('No valid wishlist data found, initializing empty wishlist');
          set({ items: [], totalItems: 0 });
        } catch (error) {
          console.error('Error manually hydrating wishlist:', error);
          set({ items: [], totalItems: 0 });
        }
      }
    }),
    {
      name: 'wishlist-storage',
      storage: isBrowser ? createJSONStorage(() => localStorage) : undefined,
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems
      }),
      version: 1,
    }
  )
);

// استدعاء التحميل فقط في المتصفح
if (isBrowser) {
  // استخدام setTimeout لضمان تنفيذ الكود بعد تهيئة المتصفح
  setTimeout(() => {
    try {
      // تحميل البيانات مباشرة
      useWishlistStore.getState().hydrateStore();
    } catch (e) {
      console.error('Error during initial wishlist hydration:', e);
    }
  }, 300);
} 