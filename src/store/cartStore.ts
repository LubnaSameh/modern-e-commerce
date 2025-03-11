import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    totalItems: number;
    subtotal: number;

    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

// Safe check for browser environment
const isBrowser = typeof window !== 'undefined';

// Create a cart store that only works on the client-side
export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            subtotal: 0,

            addItem: (product, quantity = 1) => {
                // Safety check for SSR
                if (!isBrowser) return;

                const { items } = get();
                const existingItem = items.find(item => item.id === product.id);

                if (existingItem) {
                    // If item exists, update quantity
                    return get().updateQuantity(product.id, existingItem.quantity + quantity);
                } else {
                    // Otherwise add new item
                    const newItem: CartItem = {
                        ...product,
                        quantity
                    };

                    set((state) => {
                        const updatedItems = [...state.items, newItem];
                        return {
                            items: updatedItems,
                            totalItems: state.totalItems + quantity,
                            subtotal: state.subtotal + (product.price * quantity)
                        };
                    });
                }
            },

            removeItem: (id) => {
                // Safety check for SSR
                if (!isBrowser) return;

                const { items } = get();
                const itemToRemove = items.find(item => item.id === id);

                if (itemToRemove) {
                    set((state) => ({
                        items: state.items.filter(item => item.id !== id),
                        totalItems: state.totalItems - itemToRemove.quantity,
                        subtotal: state.subtotal - (itemToRemove.price * itemToRemove.quantity)
                    }));
                }
            },

            updateQuantity: (id, quantity) => {
                // Safety check for SSR
                if (!isBrowser) return;

                const { items } = get();
                const itemToUpdate = items.find(item => item.id === id);

                if (itemToUpdate) {
                    // Ensure quantity is within valid range (1 to stock)
                    const validQuantity = Math.max(1, Math.min(quantity, itemToUpdate.stock));
                    const quantityDiff = validQuantity - itemToUpdate.quantity;

                    set((state) => ({
                        items: state.items.map(item =>
                            item.id === id
                                ? { ...item, quantity: validQuantity }
                                : item
                        ),
                        totalItems: state.totalItems + quantityDiff,
                        subtotal: state.subtotal + (itemToUpdate.price * quantityDiff)
                    }));
                }
            },

            clearCart: () => {
                // Safety check for SSR
                if (!isBrowser) return;

                set({ items: [], totalItems: 0, subtotal: 0 });
            }
        }),
        {
            name: 'cart-storage', // unique name for localStorage
            storage: createJSONStorage(() => {
                // Only use localStorage on the client
                return isBrowser ? localStorage : {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { }
                };
            }),
            skipHydration: true, // Critical: Skip automatic hydration
        }
    )
);

// Manual hydration in client-side only
if (isBrowser) {
    // Execute in the next tick after React hydration
    setTimeout(() => {
        try {
            const persistedState = localStorage.getItem('cart-storage');
            if (persistedState) {
                const parsed = JSON.parse(persistedState);
                if (parsed?.state) {
                    useCartStore.setState(parsed.state);
                }
            }
        } catch (err) {
            console.error('Failed to hydrate cart state:', err);
            // If there's an error, clear the corrupted state
            localStorage.removeItem('cart-storage');
        }
    }, 0);
} 