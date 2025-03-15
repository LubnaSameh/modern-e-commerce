"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SearchBar from "@/components/shop/SearchBar";
import SortDropdown from "@/components/shop/SortDropdown";
import Pagination from "@/components/shop/Pagination";
import { ProductFilter } from "@/components/shop/ProductGrid";
import { FEATURED_CATEGORIES } from "@/lib/categories";
import { getSampleProductsForShop, convertToShopFormat, combineProductsConsistently } from "@/lib/product-utils";

// Add this interface to define the product type
interface ProductType {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    stock: number;
    category: string;
    description?: string;
    mainImage?: string;
    categoryId?: string;
}

// Add this interface for sort options
type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';

// Get sample products from the shared utility
const sampleProducts = getSampleProductsForShop();

export default function ShopPage() {
    const [filters, setFilters] = useState<ProductFilter>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);
    const [paginatedProducts, setPaginatedProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 9;

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters: ProductFilter) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    }, []);

    // Handle search
    const handleSearch = useCallback((term: string) => {
        setFilters(prev => ({ ...prev, searchTerm: term || undefined }));
        setCurrentPage(1);
    }, []);

    // Handle sort
    const handleSort = useCallback((sortBy: string) => {
        setFilters(prev => ({ ...prev, sortBy: sortBy as SortOption }));
    }, []);

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Fetch and filter products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);

            try {
                // Start with sample data to ensure we have something to show
                let productsToShow = [...sampleProducts];

                // Try to fetch real products from API
                try {
                    // Use the exact same API endpoint without any parameters to ensure consistency
                    // This matches the endpoint used in FeaturedProducts.tsx
                    const response = await fetch('/api/products');

                    if (response.ok) {
                        const data = await response.json();
                        const apiProducts = data.products || [];

                        // If we have real products, combine them with sample products
                        if (apiProducts.length > 0) {
                            // Convert API products to the format expected by ProductCard
                            const convertedApiProducts = apiProducts.map(convertToShopFormat);

                            // Prioritize the Apple product and other API products
                            let appleProduct = convertedApiProducts.find((p: ProductType) =>
                                p.name.toLowerCase() === 'apple'
                            );

                            let otherApiProducts = convertedApiProducts.filter((p: ProductType) =>
                                p.name.toLowerCase() !== 'apple'
                            );

                            // Make sure Apple product is first if it exists
                            if (appleProduct) {
                                productsToShow = [appleProduct, ...otherApiProducts];
                            } else {
                                productsToShow = [...otherApiProducts];
                            }

                            // Only add sample products if we don't have enough real ones
                            if (productsToShow.length < 6) {
                                // Add Wireless Bluetooth Earbuds and Smart Watch Series 5 first if they're in sample
                                let earbudsProduct = sampleProducts.find((p: ProductType) =>
                                    p.name.includes('Wireless Bluetooth Earbuds')
                                );

                                let watchProduct = sampleProducts.find((p: ProductType) =>
                                    p.name.includes('Smart Watch Series 5')
                                );

                                let prioritySamples = [];
                                if (earbudsProduct) prioritySamples.push(earbudsProduct);
                                if (watchProduct) prioritySamples.push(watchProduct);

                                // Then add other samples without duplicating names
                                const sampleWithoutDuplicates = sampleProducts.filter(sample =>
                                    !productsToShow.some(api => api.name === sample.name) &&
                                    sample.name !== 'Wireless Bluetooth Earbuds' &&
                                    sample.name !== 'Smart Watch Series 5'
                                );

                                const neededCount = 6 - productsToShow.length - prioritySamples.length;
                                const additionalSamples = sampleWithoutDuplicates.slice(0, neededCount);

                                productsToShow = [
                                    ...productsToShow,
                                    ...prioritySamples,
                                    ...additionalSamples
                                ];
                            }

                            console.log(`Shop showing products: ${productsToShow.map(p => p.name).join(', ')}`);
                        }
                    }
                } catch (apiError) {
                    console.error('API request failed:', apiError);
                    // We still have sample data, so we can continue
                }

                // Apply filters to the combined products
                let filteredProducts = productsToShow;

                // Filter by category if specified
                if (filters.category && filters.category !== 'All') {
                    // First try to match by categoryId (which is more reliable)
                    if (filters.categoryId) {
                        const categoryIdLower = filters.categoryId.toLowerCase();
                        filteredProducts = filteredProducts.filter(product =>
                            product.categoryId?.toLowerCase() === categoryIdLower
                        );
                    } else {
                        // Fallback to category name if categoryId is not available
                        const categoryLower = filters.category.toLowerCase();
                        filteredProducts = filteredProducts.filter(product =>
                            product.category?.toLowerCase() === categoryLower
                        );
                    }
                }

                // Filter by price range if specified
                if (filters.minPrice !== undefined) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.price >= filters.minPrice!
                    );
                }

                if (filters.maxPrice !== undefined) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.price <= filters.maxPrice!
                    );
                }

                // Filter by minimum rating if specified
                if (filters.minRating !== undefined) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.rating >= filters.minRating!
                    );
                }

                // Filter by search term if specified
                if (filters.searchTerm) {
                    const searchTermLower = filters.searchTerm.toLowerCase();
                    filteredProducts = filteredProducts.filter(product =>
                        product.name.toLowerCase().includes(searchTermLower) ||
                        product.category.toLowerCase().includes(searchTermLower)
                    );
                }

                // Sort products based on the sort criteria
                if (filters.sortBy) {
                    switch (filters.sortBy) {
                        case 'price-asc':
                            filteredProducts.sort((a, b) => a.price - b.price);
                            break;
                        case 'price-desc':
                            filteredProducts.sort((a, b) => b.price - a.price);
                            break;
                        case 'rating':
                            filteredProducts.sort((a, b) => b.rating - a.rating);
                            break;
                        case 'newest':
                            // Since we don't have a real date for sample products, we keep the default order
                            break;
                    }
                }

                // Store all filtered products
                setAllProducts(filteredProducts);

                // Calculate total pages
                const total = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
                setTotalPages(total);
            } catch (err) {
                console.error('Error in product display:', err);
                // Still show sample products if there's an error
                setAllProducts(sampleProducts);
                setTotalPages(Math.ceil(sampleProducts.length / ITEMS_PER_PAGE));
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    // Apply pagination whenever allProducts or currentPage changes
    useEffect(() => {
        // Calculate pagination
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Get products for current page
        const currentPageProducts = allProducts.slice(startIndex, endIndex);
        setPaginatedProducts(currentPageProducts);
    }, [allProducts, currentPage]);

    // Animation for grid items
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16">
            {/* Page header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="container mx-auto max-w-6xl px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shop</h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                        Browse our collection of high-quality products. Use the filters to find exactly what you&apos;re looking for.
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Mobile header with filter button */}
                <div className="lg:hidden mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <button
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 flex items-center gap-2"
                            >
                                <span>Filters</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            </button>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {allProducts.length} Products
                            </span>
                        </div>

                        <SearchBar
                            initialSearchTerm={filters.searchTerm || ''}
                            onSearch={handleSearch}
                        />

                        <SortDropdown
                            onSortChange={handleSort}
                            initialSort={filters.sortBy}
                        />
                    </div>
                </div>

                {/* Mobile sidebar overlay */}
                {showMobileSidebar && (
                    <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileSidebar(false)}>
                        <div
                            className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl p-4 overflow-y-auto transform transition-transform"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Filters</h2>
                                <button onClick={() => setShowMobileSidebar(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                            <FilterSidebar
                                initialFilters={filters}
                                onFilterChange={(newFilters) => {
                                    handleFilterChange(newFilters);
                                    setShowMobileSidebar(false);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Desktop layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - using classes directly on FilterSidebar */}
                    <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
                        <FilterSidebar
                            initialFilters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Main content */}
                    <div className="flex-grow">
                        <div className="hidden lg:flex justify-between items-center mb-6">
                            <div className="w-[400px]">
                                <SearchBar
                                    initialSearchTerm={filters.searchTerm || ''}
                                    onSearch={handleSearch}
                                />
                            </div>

                            <SortDropdown
                                onSortChange={handleSort}
                                initialSort={filters.sortBy}
                            />
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse h-[380px]"
                                    />
                                ))}
                            </div>
                        ) : paginatedProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mx-auto">
                                    Try adjusting your filters or search term to find what you&apos;re looking for.
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {paginatedProducts.map((product) => (
                                    <motion.div key={product.id} variants={item}>
                                        <ProductCard {...product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 