"use client";

import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartDropdown() {
    // Access removeItem directly from store to avoid closure issues
    const { items, totalItems, subtotal } = useCartStore();
    const removeItem = useCartStore.getState().removeItem;
    
    return (
        <div 
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white">Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h3>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        Your cart is empty
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-3 group">
                                <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.quantity} × ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove item"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {items.length > 3 && (
                            <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                                +{items.length - 3} more items
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {items.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <Link 
                        href="/cart"
                        className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors mb-2"
                    >
                        View Cart
                    </Link>
                    <Link 
                        href="/checkout"
                        className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-center rounded-md transition-colors"
                        aria-label="Proceed to checkout as a guest or logged-in user"
                    >
                        Checkout
                    </Link>
                </div>
            )}
        </div>
    );
} 