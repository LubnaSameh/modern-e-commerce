"use client";

import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartDropdown() {
    // Access the cart state
    const { items, totalItems, subtotal } = useCartStore();
    // Use removeItem from state directly to avoid stale closures
    const removeItem = useCartStore.getState().removeItem;

    // Ensure we never display negative numbers
    const displayTotalItems = Math.max(totalItems || 0, 0);

    // Ensure we have valid values for subtotal
    const safeSubtotal = Math.max(subtotal || 0, 0);

    return (
        <div
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    Shopping Cart ({displayTotalItems} {displayTotalItems === 1 ? 'item' : 'items'})
                </h3>
            </div>

            <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="p-3 sm:p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Your cart is empty
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3 group">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 relative rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate line-clamp-1">{item.name}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        {Math.max(item.quantity || 0, 0)} × ${(item.price || 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mr-2">
                                        ${(Math.max(item.price || 0, 0) * Math.max(item.quantity || 0, 0)).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove item"
                                    >
                                        <X size={14} className="sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {items.length > 3 && (
                            <div className="p-2 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                                +{items.length - 3} more items
                            </div>
                        )}
                    </div>
                )}
            </div>

            {items.length > 0 && (
                <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">${safeSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/cart"
                            className="block w-full py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
                        >
                            View Cart
                        </Link>
                        <Link
                            href="/checkout"
                            className="block w-full py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white text-center rounded-md transition-colors"
                            aria-label="Proceed to checkout as a guest or logged-in user"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
} 