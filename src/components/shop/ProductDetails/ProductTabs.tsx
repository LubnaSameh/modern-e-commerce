"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface ProductTabsProps {
    features: string[];
    specifications: Record<string, string>;
    reviewCount: number;
    rating: number;
}

export default function ProductTabs({
    features,
    specifications,
    reviewCount,
    rating
}: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<"features" | "specs" | "reviews">("features");

    return (
        <div className="mt-12">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="flex gap-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab("features")}
                        className={`pb-4 text-sm font-medium border-b-2 ${activeTab === "features"
                                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                            }`}
                    >
                        Features
                    </button>
                    <button
                        onClick={() => setActiveTab("specs")}
                        className={`pb-4 text-sm font-medium border-b-2 ${activeTab === "specs"
                                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                            }`}
                    >
                        Specifications
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`pb-4 text-sm font-medium border-b-2 ${activeTab === "reviews"
                                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                            }`}
                    >
                        Reviews ({reviewCount})
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            <div className="py-6">
                {activeTab === "features" && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Key Features
                        </h3>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === "specs" && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Technical Specifications
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="overflow-hidden bg-white dark:bg-gray-800 sm:rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {Object.entries(specifications).map(([key, value]) => (
                                            <tr key={key}>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    {key}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                    {rating.toFixed(1)}
                                </span>
                                <div className="flex mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.round(rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {reviewCount} reviews
                                </span>
                            </div>

                            <div className="flex-1 space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    // For demo purposes, calculate a fake percentage for each star rating
                                    const percent =
                                        star === 5
                                            ? 70
                                            : star === 4
                                                ? 20
                                                : star === 3
                                                    ? 5
                                                    : star === 2
                                                        ? 3
                                                        : 2;
                                    return (
                                        <div key={star} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 w-20">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {star}
                                                </span>
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10">
                                                {percent}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Review items would go here in a real app */}
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                Customer reviews will be displayed here
                            </p>
                            <button className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg">
                                Write a Review
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 