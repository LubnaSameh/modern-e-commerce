"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ArrowRight,
    ChevronRight
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

// Define interface for cart items
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
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
        setCartItems(cart.items);
        setTotalItems(cart.totalItems);
        setSubtotal(cart.subtotal);
        setMounted(true);
        setLoading(false);

        // Subscribe to store changes
        const unsubscribe = useCartStore.subscribe((state) => {
            setCartItems(state.items);
            setTotalItems(state.totalItems);
            setSubtotal(state.subtotal);
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

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
                <div className="container mx-auto px-4 text-center max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-10 w-10 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Looks like you haven&apos;t added any products to your cart yet.
                        </p>
                        <Link
                            href="/shop"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium inline-flex items-center hover:opacity-90 transition-opacity"
                        >
                            Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="flex mb-8 text-sm">
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

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Cart Items ({totalItems})
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* Cart Item List */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </h3>
                                                    {item.color && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Color: <span className="capitalize">{item.color}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-2 sm:mt-0 text-lg font-medium text-gray-900 dark:text-white">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-l-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value);
                                                            if (!isNaN(value)) {
                                                                updateQuantity(item.id, value);
                                                            }
                                                        }}
                                                        className="w-12 h-8 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center text-gray-900 dark:text-white"
                                                        min="1"
                                                        max={item.stock}
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-r-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    <span className="text-sm">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Order Summary</h2>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Coupon code"
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                        Coupon applied: 20% discount
                                    </p>
                                )}
                            </div>

                            {/* Summary Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
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
                                    <div className="flex justify-between font-medium text-lg">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        *Taxes calculated at checkout
                                    </p>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <div className="mt-6 space-y-4">
                                <Link
                                    href="/checkout"
                                    className="block w-full py-3 px-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href="/shop"
                                    className="block w-full py-3 px-4 text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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