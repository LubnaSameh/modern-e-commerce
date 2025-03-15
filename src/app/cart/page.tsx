"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import {
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    ChevronRight,
    ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import OptimizedImage from "@/components/ui/OptimizedImage";

// Define interface for cart items
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
    stock?: number;
    color?: string;
}

export default function CartPage() {
    // Client-side only state to avoid hydration issues
    const [mounted, setMounted] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);

    // Remove any rogue ModernShop elements
    useEffect(() => {
        // Clean up any potential UI issues
        const cleanup = () => {
            // Find any standalone elements that might be causing issues
            const rogueElements = document.querySelectorAll('body > div:not(.flex):not([id^="__"]):not([class*="toast"])');
            rogueElements.forEach(el => {
                // Check if it contains text that matches our logo
                if (el.textContent?.includes('ModernShop') && !el.classList.contains('container')) {
                    // Fix the TypeScript error by casting to HTMLElement
                    (el as HTMLElement).style.display = 'none';
                }
            });
        };

        // Run cleanup on mount and whenever the component updates
        cleanup();

        // Return cleanup function
        return () => {
            // Optional: any cleanup when component unmounts
        };
    }, [mounted]);

    // Initialize from cart store and set up subscription
    useEffect(() => {
        // Get the initial state
        const cart = useCartStore.getState();
        setCartItems(cart.items || []);
        setTotalItems(cart.totalItems || 0);
        setSubtotal(cart.subtotal || 0);
        setMounted(true);
        setLoading(false);

        // Subscribe to store changes
        const unsubscribe = useCartStore.subscribe((state) => {
            setCartItems(state.items || []);
            setTotalItems(state.totalItems || 0);
            setSubtotal(state.subtotal || 0);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Calculate cart totals
    const shipping = subtotal > 100 ? 0 : 10;
    const discount = couponApplied ? couponDiscount : 0;
    const total = subtotal + shipping - discount;

    // Update item quantity - uses the store action
    const updateQuantity = (id: string, newQuantity: number) => {
        if (!mounted) return;
        useCartStore.getState().updateQuantity(id, newQuantity);
    };

    // Remove item from cart - uses the store action
    const removeItem = (id: string) => {
        if (!mounted) return;
        useCartStore.getState().removeItem(id);
    };

    // Clear cart - uses the store action
    const clearCart = () => {
        if (!mounted) return;
        useCartStore.getState().clearCart();
    };

    // Apply coupon code
    const applyCoupon = () => {
        // In a real app, this would validate the coupon with an API call
        if (couponCode.toUpperCase() === "DISCOUNT20") {
            setCouponApplied(true);
            setCouponDiscount(subtotal * 0.2); // 20% discount
        } else {
            setCouponApplied(false);
            setCouponDiscount(0);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Loader
                    size="large"
                    variant="spinner"
                    text="جاري تحميل سلة التسوق..."
                    className="py-20"
                />
            </div>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 sm:py-16">
                <div className="container mx-auto px-4 text-center max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Your Cart is Empty</h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                            Looks like you haven&apos;t added any products to your cart yet.
                        </p>
                        <Link
                            href="/shop"
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium inline-flex items-center hover:opacity-90 transition-opacity text-sm sm:text-base"
                        >
                            Start Shopping <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-4 sm:py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs - Hidden on mobile */}
                <nav className="hidden sm:flex mb-6 sm:mb-8 text-sm">
                    <ol className="flex items-center space-x-1">
                        <li>
                            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <li className="text-gray-900 dark:text-white font-medium">
                            Shopping Cart
                        </li>
                    </ol>
                </nav>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                                        Cart Items ({totalItems || 0})
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-xs sm:text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center"
                                    >
                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* Cart Item List */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-4 sm:p-6 flex flex-row gap-3 sm:gap-4">
                                        {/* Product Image - Replace with OptimizedImage */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                                            <OptimizedImage
                                                src={item.image || '/placeholder.png'}
                                                alt={item.name}
                                                fill={true}
                                                className="object-cover"
                                                fallbackSrc="/images/placeholder.jpg"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:justify-between">
                                                <div>
                                                    <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    {item.color && (
                                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Color: <span className="capitalize">{item.color}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white">
                                                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                {/* Quantity Controls - Smaller on mobile */}
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-l-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600"
                                                        disabled={(item.quantity || 0) <= 1}
                                                    >
                                                        <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity || 1}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value);
                                                            if (!isNaN(value)) {
                                                                updateQuantity(item.id, value);
                                                            }
                                                        }}
                                                        className="w-8 sm:w-12 h-7 sm:h-8 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center text-gray-900 dark:text-white text-xs sm:text-sm"
                                                        min="1"
                                                        max={item.stock || 99}
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-r-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600"
                                                        disabled={(item.quantity || 0) >= (item.stock || 99)}
                                                    >
                                                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                    <span className="text-xs sm:text-sm">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 sticky top-20">
                            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">Order Summary</h2>

                            {/* Coupon Code - Improved mobile layout */}
                            <div className="mb-4 sm:mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Coupon code"
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium text-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2">
                                        Coupon applied: 20% discount
                                    </p>
                                )}
                            </div>

                            {/* Summary Details */}
                            <div className="space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white font-medium">${(subtotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {couponApplied && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                        <span className="text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                    <div className="flex justify-between font-medium text-base sm:text-lg">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-gray-900 dark:text-white">${(total || 0).toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        *Taxes calculated at checkout
                                    </p>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                                <Link
                                    href="/checkout"
                                    className="block w-full py-2 sm:py-3 px-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm sm:text-base"
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href="/shop"
                                    className="block w-full py-2 sm:py-3 px-4 text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 