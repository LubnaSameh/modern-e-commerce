"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft, CheckCircle, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

// Define interface for cart items
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
}

export default function CheckoutPage() {
    // Client-side only state to avoid hydration issues
    const [mounted, setMounted] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    // const [totalItems, setTotalItems] = useState(0); // Commented out as it's unused
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        saveInfo: false,
        createAccount: false,
        password: "",
        paymentMethod: "credit",
    });

    const [formStep, setFormStep] = useState(1);

    // Initialize from cart store and set up subscription
    useEffect(() => {
        // Get the initial state
        const cart = useCartStore.getState();
        setCartItems(cart.items);
        setSubtotal(cart.subtotal);
        setMounted(true);
        setLoading(false);

        // Subscribe to store changes
        const unsubscribe = useCartStore.subscribe((state) => {
            setCartItems(state.items);
            setSubtotal(state.subtotal);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Calculate cart totals
    const shipping = 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStep(formStep + 1);

        // In a real app, you would submit payment info to a payment processor
        if (formStep === 2) {
            // Simulate successful payment
            setTimeout(() => {
                // Clear the cart after successful checkout
                if (mounted) {
                    useCartStore.getState().clearCart();
                }

                // In a real app, here you would handle account creation if formData.createAccount is true
                // For now, we'll just simulate it for the UI

                setFormStep(3); // Show success
            }, 1500);
        }
    };

    // If cart is empty and not in success state, redirect to cart
    if (mounted && cartItems.length === 0 && formStep !== 3) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
                <div className="container mx-auto px-4 text-center max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Add some items to your cart before proceeding to checkout.
                        </p>
                        <Link
                            href="/shop"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium inline-flex items-center hover:opacity-90 transition-opacity"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success step
    if (formStep === 3) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
                <div className="container mx-auto px-4 max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Thank you for your purchase. We&apos;ve sent you an email with your order details.
                        </p>

                        {/* Account Creation Confirmation - Only show if not logged in and account was created */}
                        {!session && formData.createAccount && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-left">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                                    <User size={16} className="mr-2" />
                                    Account Created Successfully
                                </h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                    Your account has been created. You can now log in using your email and password.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Link
                                href="/shop"
                                className="block w-full py-3 px-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/"
                                className="block w-full py-3 px-4 text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
                        <li>
                            <Link href="/cart" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Cart
                            </Link>
                        </li>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <li className="text-gray-900 dark:text-white font-medium">
                            Checkout
                        </li>
                    </ol>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            {/* Guest Checkout Message - Only show if not logged in */}
                            {!session && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <User size={18} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Checking out as a guest</h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                            You can continue without an account or{" "}
                                            <Link href="/auth/login" className="font-medium text-blue-700 dark:text-blue-300 hover:underline">
                                                log in
                                            </Link>{" "}
                                            for faster checkout.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {formStep === 1 ? "Shipping Information" : "Payment Details"}
                                    </h2>
                                    {formStep === 2 && (
                                        <button
                                            type="button"
                                            onClick={() => setFormStep(1)}
                                            className="flex items-center text-sm text-blue-500"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-1" />
                                            Back
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    {formStep === 1 ? (
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        ZIP / Postal
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="zip"
                                                        name="zip"
                                                        value={formData.zip}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Country
                                                    </label>
                                                    <select
                                                        id="country"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        <option value="US">United States</option>
                                                        <option value="CA">Canada</option>
                                                        <option value="UK">United Kingdom</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex items-center mt-4">
                                                <input
                                                    type="checkbox"
                                                    id="saveInfo"
                                                    name="saveInfo"
                                                    checked={formData.saveInfo}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    Save this information for next time
                                                </label>
                                            </div>

                                            {/* Create Account Option - Only show if not logged in */}
                                            {!session && (
                                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id="createAccount"
                                                            name="createAccount"
                                                            checked={formData.createAccount}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor="createAccount" className="ml-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Create an account for faster checkout next time
                                                        </label>
                                                    </div>

                                                    {formData.createAccount && (
                                                        <div className="mt-3">
                                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                id="password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                required={formData.createAccount}
                                                                minLength={6}
                                                            />
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                Password must be at least 6 characters long
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Payment Method
                                                </label>
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="credit"
                                                            name="paymentMethod"
                                                            value="credit"
                                                            checked={formData.paymentMethod === "credit"}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-blue-500"
                                                        />
                                                        <label htmlFor="credit" className="ml-2 text-gray-700 dark:text-gray-300">
                                                            Credit / Debit Card
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="paypal"
                                                            name="paymentMethod"
                                                            value="paypal"
                                                            checked={formData.paymentMethod === "paypal"}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-blue-500"
                                                        />
                                                        <label htmlFor="paypal" className="ml-2 text-gray-700 dark:text-gray-300">
                                                            PayPal
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {formData.paymentMethod === "credit" && (
                                                <>
                                                    <div>
                                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Card Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="cardNumber"
                                                            placeholder="1234 5678 9012 3456"
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Expiry Date
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="expiry"
                                                                placeholder="MM/YY"
                                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Security Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="cvv"
                                                                placeholder="123"
                                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                        >
                                            {formStep === 1 ? "Continue to Payment" : "Complete Order"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Order Summary</h2>

                            {/* Item List */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden relative flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity} × ${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="text-gray-900 dark:text-white font-medium">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                                    <span className="text-gray-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                    <div className="flex justify-between font-medium">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/cart"
                                    className="flex items-center justify-center text-sm text-blue-500"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Return to cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 