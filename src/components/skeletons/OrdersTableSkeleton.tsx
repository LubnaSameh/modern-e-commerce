export function OrdersTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-full md:w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 border-t border-gray-200 dark:border-gray-700 animate-pulse"></div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                    <div className="w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
} 