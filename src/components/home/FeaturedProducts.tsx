"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchWithCache } from "@/lib/api-cache";
import { useSlowConnection } from "@/lib/performance";
import { useKeepAlive } from "@/lib/keep-alive";
import ServerErrorRetry from "@/components/ui/ServerErrorRetry";
import Loader from "@/components/ui/Loader";
import { FEATURED_CATEGORIES } from "@/lib/categories";
import { getSampleProductsForHome, convertToHomeFormat, FEATURED_SAMPLE_PRODUCTS, combineProductsConsistently } from "@/lib/product-utils";
import ProductCard from "@/components/shop/ProductCard";

type Product = {
    id: string;
    name: string;
    price: number;
    mainImage: string;
    category: {
        name: string;
    } | null;
};

type ApiResponse = {
    products: any[];
};

// Get sample products from the shared utility
const sampleProducts = getSampleProductsForHome();

// Memoized category button
const CategoryButton = memo(({ category, isActive, onClick }: {
    category: string;
    isActive: boolean;
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${isActive
            ? "bg-primary text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
    >
        {category}
    </button>
));

// Add display name
CategoryButton.displayName = "CategoryButton";

export default function FeaturedProducts() {
    const [activeTab, setActiveTab] = useState("All");
    const [products, setProducts] = useState<Product[]>(sampleProducts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const INITIAL_DISPLAY_COUNT = 8;

    // Initialize keep-alive mechanism
    useKeepAlive();

    // Fetch products from API and combine with sample data
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Increment connection attempt counter
            setConnectionAttempts(prev => prev + 1);
            console.log(`Attempting to fetch products (attempt ${connectionAttempts + 1})...`);

            // Use the same exact endpoint as the shop page without limit parameter
            // to get all products including ones like 'apple'
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const data = await fetchWithCache<ApiResponse>(
                '/api/products',
                {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                },
                2 * 60 * 1000 // Reduced cache time to 2 minutes
            );

            clearTimeout(timeoutId);
            const apiProducts = data.products || [];

            // Convert API products to the correct format for the home page
            const formattedApiProducts = apiProducts.map(convertToHomeFormat);

            let combinedProducts: Product[] = [];

            if (formattedApiProducts.length > 0) {
                // Prioritize the Apple product and other API products
                let appleProduct = formattedApiProducts.find((p: Product) =>
                    p.name.toLowerCase() === 'apple'
                );

                let otherApiProducts = formattedApiProducts.filter((p: Product) =>
                    p.name.toLowerCase() !== 'apple'
                );

                // Make sure Apple product is first if it exists
                if (appleProduct) {
                    combinedProducts = [appleProduct, ...otherApiProducts];
                } else {
                    combinedProducts = [...otherApiProducts];
                }

                // Only add sample products if we don't have enough real ones
                if (combinedProducts.length < 6) {
                    // Add Wireless Bluetooth Earbuds and Smart Watch Series 5 first if they're in sample
                    let earbudsProduct = sampleProducts.find((p: Product) =>
                        p.name.includes('Wireless Bluetooth Earbuds')
                    );

                    let watchProduct = sampleProducts.find((p: Product) =>
                        p.name.includes('Smart Watch Series 5')
                    );

                    let prioritySamples: Product[] = [];
                    if (earbudsProduct) prioritySamples.push(earbudsProduct);
                    if (watchProduct) prioritySamples.push(watchProduct);

                    // Then add other samples without duplicating names
                    const sampleWithoutDuplicates = sampleProducts.filter(sample =>
                        !combinedProducts.some(api => api.name === sample.name) &&
                        sample.name !== 'Wireless Bluetooth Earbuds' &&
                        sample.name !== 'Smart Watch Series 5'
                    );

                    const neededCount = 6 - combinedProducts.length - prioritySamples.length;
                    const additionalSamples = sampleWithoutDuplicates.slice(0, neededCount);

                    combinedProducts = [
                        ...combinedProducts,
                        ...prioritySamples,
                        ...additionalSamples
                    ];
                }
            } else {
                // If no API products, use sample products
                combinedProducts = [...sampleProducts];

                // Only show error if this was a real connection attempt
                if (connectionAttempts > 0) {
                    console.warn("No products returned from API, using sample products");
                    setError('Unable to load real products. Showing samples instead.');
                }
            }

            // Reset connection attempts on success
            setConnectionAttempts(0);
            console.log(`FeaturedProducts showing products: ${combinedProducts.map(p => p.name).join(', ')}`);

            setProducts(combinedProducts);
            setError(null);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unknown error occurred while fetching products';

            console.error('Error fetching products:', error);
            setError(errorMessage);

            // Log detailed error info
            console.error(`Product fetch failed (attempt ${connectionAttempts}):`, {
                message: errorMessage,
                type: error instanceof Error ? error.name : 'Unknown',
                stack: error instanceof Error ? error.stack : undefined,
                abort: error instanceof DOMException && error.name === 'AbortError'
            });

            // On error, still show sample products
            setProducts(sampleProducts);

            // Return false to indicate failure for retry logic
            return false;
        } finally {
            setLoading(false);
        }
    }, [connectionAttempts]);

    // Initial fetch on component mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Memoize categories to prevent recalculation on each render
    const categories = useMemo(() => {
        // Get unique product categories from actual products
        const productCategories = [...new Set(
            products
                .filter(p => p.category && p.category.name)
                .map(product => product.category?.name || '')
        )];

        // Always ensure all featured categories are included, even if no products yet
        const featuredNames = FEATURED_CATEGORIES.map(cat => cat.name);
        const allCategories = [...new Set([...productCategories, ...featuredNames])];

        // Start with "All" and then alphabetically sort the rest
        return ["All", ...allCategories.sort()];
    }, [products]);

    // Memoize filtered products to prevent recalculation on each render
    const filteredProducts = useMemo(() => {
        return activeTab === "All"
            ? products
            : products.filter(product => product.category && product.category.name === activeTab);
    }, [products, activeTab]);

    // Memoize displayed products
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, INITIAL_DISPLAY_COUNT);
    }, [filteredProducts]);

    // Memoize tab change handler
    const handleTabChange = useCallback((category: string) => {
        setActiveTab(category);
    }, []);

    return (
        <section className="py-8 sm:py-12 md:py-16 bg-white lg:px-7 dark:bg-gray-900">
            <div className="mx-auto  container">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        Featured Products
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our handpicked selection of premium products, designed to enhance your lifestyle with quality and style.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center mb-6 sm:mb-8 gap-1.5 sm:gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <CategoryButton
                            key={category}
                            category={category}
                            isActive={activeTab === category}
                            onClick={() => handleTabChange(category)}
                        />
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-10 sm:py-20">
                        <Loader
                            size="large"
                            variant="dots"
                            text="Loading featured products..."
                        />
                    </div>
                ) : error && displayedProducts.length <= sampleProducts.length ? (
                    // Show error state with auto-retry capability
                    <ServerErrorRetry
                        message="Attempting to connect to server to load real products..."
                        onRetry={fetchProducts}
                        autoRetry={true}
                        maxRetries={5}
                    />
                ) : displayedProducts.length === 0 ? (
                    <div className="text-center py-10 sm:py-20 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        No products found in this category.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {displayedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1
                                    }}
                                >
                                    <ProductCard
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        rating={4.5} // Default rating
                                        image={product.mainImage}
                                        category={product.category?.name}
                                        stock={10} // Default stock
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Products Link */}
                        <div className="text-center mt-8 sm:mt-12">
                            <Link href="/shop" prefetch={false} className="inline-block py-2.5 px-5 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors">
                                View All Products
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}