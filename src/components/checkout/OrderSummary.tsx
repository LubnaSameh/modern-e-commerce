"use client";

import Image from "next/image";
import Link from "next/link";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color: string;
}

interface OrderSummaryProps {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
}

export default function OrderSummary({ items, subtotal, shipping, discount, total }: OrderSummaryProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'} in Cart
                </h3>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Color: <span className="capitalize">{item.color}</span>
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Qty: {item.quantity}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <Link
                        href="/cart"
                        className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Edit Cart
                    </Link>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-500">Discount</span>
                        <span className="text-green-500">-${discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-medium">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
} 