import React from "react";

export function ProductsTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Search and Filter Controls Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="w-full sm:w-72 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="w-full sm:w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>

            {/* Table Header Skeleton */}
            <div className="rounded-t-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 bg-gray-100 dark:bg-gray-800 p-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>

            {/* Table Rows Skeleton */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
                <div
                    key={row}
                    className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700"
                >
                    {/* Product Image */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    {/* Product Name */}
                    <div className="flex items-center">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center">
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    {/* Category */}
                    <div className="flex items-center">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}

            {/* Pagination Skeleton */}
            <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
} 