"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchWithCache } from "@/lib/api-cache";
import { useSlowConnection } from "@/lib/performance";

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
    products: Product[];
};

// Sample products that will be combined with API data
const sampleProducts = [
    {
        id: "sample-1",
        name: "Modern Coffee Table",
        price: 199.99,
        mainImage: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=800&auto=format&fit=crop&q=80",
        category: { name: "Furniture" },
    },
    {
        id: "sample-2",
        name: "Wireless Headphones",
        price: 149.99,
        mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        category: { name: "Electronics" },
    },
    {
        id: "sample-3",
        name: "Cotton T-Shirt",
        price: 29.99,
        mainImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
        category: { name: "Clothing" },
    },
    {
        id: "sample-4",
        name: "Smart Watch",
        price: 299.99,
        mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        category: { name: "Electronics" },
    },
    {
        id: "sample-5",
        name: "Leather Backpack",
        price: 89.99,
        mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        category: { name: "Accessories" },
    },
    {
        id: "sample-6",
        name: "Ceramic Plant Pot",
        price: 24.99,
        mainImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        category: { name: "Home Decor" },
    },
    {
        id: "sample-7",
        name: "Stainless Steel Water Bottle",
        price: 19.99,
        mainImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
        category: { name: "Kitchen" },
    },
    {
        id: "sample-8",
        name: "Yoga Mat",
        price: 39.99,
        mainImage: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=800&auto=format&fit=crop&q=80",
        category: { name: "Sports" },
    }
];

// Memoized ProductCard component
const MemoizedProductCard = memo(ProductCard);

// Memoized category button
const CategoryButton = memo(({ category, isActive, onClick }: { 
    category: string; 
    isActive: boolean; 
    onClick: () => void 
}) => (
    <button
        onClick={onClick}
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            isActive
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
        {category}
    </button>
));

export default function FeaturedProducts() {
    const [activeTab, setActiveTab] = useState("All");
    const [products, setProducts] = useState<Product[]>(sampleProducts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const INITIAL_DISPLAY_COUNT = 8;
    
    // Check if user is on a slow connection
    const isSlowConnection = useSlowConnection();

    // Fetch products from API and combine with sample data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                // Use cached data if available (cache for 5 minutes)
                const data = await fetchWithCache<ApiResponse>('/api/products?limit=8', {}, 5 * 60 * 1000);
                const apiProducts = data.products || [];

                // Combine API products with sample products, making sure there are no duplicates by ID
                const combinedProducts = [
                    ...apiProducts,
                    ...sampleProducts.filter(sample =>
                        !apiProducts.some((api: Product) => api.id === sample.id)
                    )
                ];

                setProducts(combinedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
                
                // Fallback to sample products on error
                setProducts(sampleProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Memoize categories to prevent recalculation on each render
    const categories = useMemo(() => {
        return ["All", ...new Set(products.filter(p => p.category).map(product => product.category?.name || ''))];
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
        <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-900">
            <div className="mx-auto container sm:px-4">
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
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-10 sm:py-20 text-red-500 text-sm sm:text-base">
                        {error}
                    </div>
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
                                        duration: isSlowConnection ? 0 : 0.3, 
                                        delay: isSlowConnection ? 0 : index * 0.1 
                                    }}
                                >
                                    <MemoizedProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* View All Products Link */}
                        {filteredProducts.length > INITIAL_DISPLAY_COUNT && (
                            <div className="flex justify-center mt-6 sm:mt-10">
                                <Link 
                                    href={`/shop${activeTab !== "All" ? `?category=${encodeURIComponent(activeTab)}` : ''}`}
                                    className="bg-primary hover:bg-primary-dark text-white text-sm sm:text-base font-medium py-2 px-6 sm:px-8 rounded-full transition-colors"
                                >
                                    View All Products
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}