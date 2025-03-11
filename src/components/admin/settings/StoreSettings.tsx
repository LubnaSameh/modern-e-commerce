"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, Upload, X } from "lucide-react";

type SettingsFormData = {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    storeLogo: string;
    currencySymbol: string;
};

export function StoreSettings() {
    // In a real app, this would be fetched from your API
    const [formData, setFormData] = useState<SettingsFormData>({
        storeName: "Modern E-Commerce",
        storeEmail: "contact@example.com",
        storePhone: "+1 (555) 123-4567",
        storeAddress: "123 Commerce St, New York, NY 10001",
        storeLogo: "https://placehold.co/200x80/4f46e5/ffffff?text=E-Commerce",
        currencySymbol: "$",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMessage("Settings saved successfully!");

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Store Information
                </h2>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-md">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Store Logo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Store Logo
                            </label>
                            <div className="flex items-center">
                                <div className="h-20 w-40 relative overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
                                    <Image
                                        src={formData.storeLogo}
                                        alt="Store Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="ml-5">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Logo
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Recommended size: 200x80 pixels. Max file size: 2MB.
                            </p>
                        </div>

                        {/* Store Name */}
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Store Name
                            </label>
                            <input
                                type="text"
                                id="storeName"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                required
                            />
                        </div>

                        {/* Store Email */}
                        <div>
                            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Store Email
                            </label>
                            <input
                                type="email"
                                id="storeEmail"
                                name="storeEmail"
                                value={formData.storeEmail}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                required
                            />
                        </div>

                        {/* Store Phone */}
                        <div>
                            <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Store Phone
                            </label>
                            <input
                                type="text"
                                id="storePhone"
                                name="storePhone"
                                value={formData.storePhone}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>

                        {/* Currency Symbol */}
                        <div>
                            <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Currency Symbol
                            </label>
                            <select
                                id="currencySymbol"
                                name="currencySymbol"
                                value={formData.currencySymbol}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                                <option value="$">$ (USD)</option>
                                <option value="€">€ (EUR)</option>
                                <option value="£">£ (GBP)</option>
                                <option value="¥">¥ (JPY)</option>
                                <option value="₹">₹ (INR)</option>
                            </select>
                        </div>

                        {/* Store Address */}
                        <div className="md:col-span-2">
                            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Store Address
                            </label>
                            <textarea
                                id="storeAddress"
                                name="storeAddress"
                                value={formData.storeAddress}
                                onChange={handleChange}
                                rows={3}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 