"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, DollarSign, CreditCardIcon } from "lucide-react";

interface PaymentMethodsProps {
    onSelect: (method: string) => void;
}

export default function PaymentMethods({ onSelect }: PaymentMethodsProps) {
    const [selectedMethod, setSelectedMethod] = useState("card");

    const handleSelect = (method: string) => {
        setSelectedMethod(method);
        onSelect(method);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h3>

            <div className="space-y-4">
                {/* Credit Card */}
                <div
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedMethod === 'card'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                    onClick={() => handleSelect('card')}
                >
                    <div className="flex items-start">
                        <div className="flex-1">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="card"
                                    name="paymentMethod"
                                    checked={selectedMethod === 'card'}
                                    onChange={() => handleSelect('card')}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                />
                                <label htmlFor="card" className="ml-2 font-medium text-gray-900 dark:text-white">Credit Card</label>
                            </div>

                            <div className="mt-4 pl-6 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <div className="w-12 h-8 relative">
                                        <Image
                                            src="/payment/visa.svg"
                                            alt="Visa"
                                            width={48}
                                            height={32}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="w-12 h-8 relative">
                                        <Image
                                            src="/payment/mastercard.svg"
                                            alt="Mastercard"
                                            width={48}
                                            height={32}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>

                                {selectedMethod === 'card' && (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Card Number
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="cardNumber"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
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
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    CVC
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cvc"
                                                    placeholder="123"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cash on Delivery */}
                <div
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedMethod === 'cod'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                    onClick={() => handleSelect('cod')}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            checked={selectedMethod === 'cod'}
                            onChange={() => handleSelect('cod')}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="cod" className="ml-2 flex-1 font-medium text-gray-900 dark:text-white">Cash on Delivery</label>
                        <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Manual Bank Transfer */}
                <div
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedMethod === 'bank'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                    onClick={() => handleSelect('bank')}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="bank"
                            name="paymentMethod"
                            checked={selectedMethod === 'bank'}
                            onChange={() => handleSelect('bank')}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="bank" className="ml-2 flex-1 font-medium text-gray-900 dark:text-white">Manual Bank Transfer</label>
                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    </div>

                    {selectedMethod === 'bank' && (
                        <div className="mt-4 pl-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Bank:</span> ModernBank International
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Account Name:</span> ModernShop Inc.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Account Number:</span> XXXX-XXXX-XXXX-1234
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 