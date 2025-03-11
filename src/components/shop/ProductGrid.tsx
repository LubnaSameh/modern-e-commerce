"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

// Sample products data - will be combined with API data
const sampleProducts = [
    {
        id: "sample-1",
        name: "Wireless Bluetooth Earbuds",
        price: 89.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
        stock: 45,
        category: "Electronics",
    },
    {
        id: "sample-2",
        name: "Smart Watch Series 5",
        price: 199.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
        stock: 30,
        category: "Electronics",
    },
    {
        id: "sample-3",
        name: "Leather Wallet",
        price: 49.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=400&h=400&fit=crop",
        stock: 100,
        category: "Accessories",
    },
    {
        id: "sample-4",
        name: "Cotton T-Shirt",
        price: 29.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        stock: 78,
        category: "Clothing",
    },
    {
        id: "sample-5",
        name: "Coffee Mug",
        price: 19.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop",
        stock: 120,
        category: "Home & Kitchen",
    },
    // Add more sample products to demonstrate pagination
    {
        id: "sample-6",
        name: "Desk Lamp",
        price: 39.99,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1580089004245-c67543d60295?w=400&h=400&fit=crop",
        stock: 55,
        category: "Home & Kitchen",
    },
    {
        id: "sample-7",
        name: "Bluetooth Speaker",
        price: 69.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        stock: 42,
        category: "Electronics",
    },
    {
        id: "sample-8",
        name: "Yoga Mat",
        price: 24.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&h=400&fit=crop",
        stock: 60,
        category: "Sports",
    },
    {
        id: "sample-9",
        name: "Stainless Steel Water Bottle",
        price: 18.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=400&h=400&fit=crop",
        stock: 85,
        category: "Accessories",
    },
    {
        id: "sample-10",
        name: "Wireless Keyboard",
        price: 49.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
        stock: 32,
        category: "Electronics",
    },
    {
        id: "sample-11",
        name: "Denim Jacket",
        price: 59.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop",
        stock: 25,
        category: "Clothing",
    },
    {
        id: "sample-12",
        name: "Leather Backpack",
        price: 89.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
        stock: 18,
        category: "Accessories",
    },
];

// Define product interface
interface Product {
    id: string;
    name: string;
    price: number;
    rating?: number;
    mainImage?: string;
    isNew?: boolean;
    discount?: number;
    stock?: number;
    category?: string;
    createdAt?: string;
}

export interface ProductFilter {
    category?: string;
    categoryId?: string;   // Add category ID for more precise filtering
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    searchTerm?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

interface ProductGridProps {
    filters?: ProductFilter;
    currentPage?: number;
    itemsPerPage?: number;
    onTotalPagesChange?: (totalPages: number) => void;
}

// Define an interface for the API product
interface ApiProduct {
    id: string | number;
    name: string;
    price: number;
    mainImage?: string;
    stock?: number;
    category?: {
        name: string;
    };
}

// Define an interface for the converted product
interface ProductItem {
    id: string | number;
    name: string;
    price: number;
    rating: number;
    image: string;
    stock: number;
    category: string;
}

export default function ProductGrid({
    filters = {},
    currentPage = 1,
    itemsPerPage = 9, // Default to 9 items per page (3x3 grid)
    onTotalPagesChange
}: ProductGridProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]); // All filtered products
    const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]); // Products for current page
    const [error, setError] = useState<string | null>(null);

    // Fetch and filter products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Always start with sample data to ensure we have something to show
                let productsToShow = [...sampleProducts];

                // Try to fetch real products from API
                try {
                    // Build the URL with filter parameters
                    const apiUrl = '/api/products?';
                    const params = new URLSearchParams();

                    // Add all filters to the API request
                    if (filters.searchTerm) {
                        params.append('q', filters.searchTerm);
                    }

                    if (filters.categoryId) {
                        params.append('categoryId', filters.categoryId);
                    } else if (filters.category) {
                        // Legacy support for category name filtering
                        params.append('category', filters.category);
                    }

                    if (filters.minPrice !== undefined) {
                        params.append('minPrice', filters.minPrice.toString());
                    }

                    if (filters.maxPrice !== undefined) {
                        params.append('maxPrice', filters.maxPrice.toString());
                    }

                    const response = await fetch(apiUrl + params.toString());

                    if (response.ok) {
                        const data = await response.json();
                        const apiProducts = data.products || [];

                        console.log(`ProductGrid: Fetched ${apiProducts.length} products from API`);

                        // If we have real products, show them primarily
                        if (apiProducts.length > 0) {
                            // Convert API products to the format expected by ProductCard
                            const convertedApiProducts = apiProducts.map((product: ApiProduct) => {
                                // Log product data for debugging
                                console.log('Processing API product:', {
                                    id: product.id,
                                    name: product.name,
                                    hasMainImage: !!product.mainImage,
                                    rawData: JSON.stringify(product).substring(0, 100) + '...'
                                });

                                // Handle image URL properly - convert relative URLs to absolute
                                let imageUrl = 'https://via.placeholder.com/400';
                                if (product.mainImage) {
                                    // Check if it's already a full URL or a relative path
                                    if (product.mainImage.startsWith('http')) {
                                        imageUrl = product.mainImage;
                                    } else {
                                        // Convert relative path to full URL based on the current origin
                                        const baseUrl = window.location.origin;
                                        imageUrl = `${baseUrl}${product.mainImage}`;
                                    }
                                }

                                return {
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    rating: 4.5, // Default rating as it might not be in the API
                                    image: imageUrl,
                                    stock: product.stock || 10,
                                    category: product.category?.name || 'Other',
                                };
                            });

                            // Show API products first, then add sample products to fill out the grid
                            // Only if we have very few products (<3)
                            if (convertedApiProducts.length < 3) {
                                // Filter out sample products that have the same name as API products
                                const sampleWithoutDuplicates = sampleProducts.filter(sample =>
                                    !convertedApiProducts.some((api: ProductItem) =>
                                        api.name.toLowerCase() === sample.name.toLowerCase()
                                    )
                                );

                                productsToShow = [...convertedApiProducts, ...sampleWithoutDuplicates];
                                console.log(`ProductGrid: Showing ${convertedApiProducts.length} API products and ${sampleWithoutDuplicates.length} sample products`);
                            } else {
                                // If we have enough API products, just show those
                                productsToShow = convertedApiProducts;
                                console.log(`ProductGrid: Showing only API products (${convertedApiProducts.length})`);
                            }
                        } else {
                            console.log('ProductGrid: No API products found, using sample data');
                        }
                    } else {
                        console.error('API error:', response.status, response.statusText);
                        // Try to get error details
                        try {
                            const errorData = await response.json();
                            console.error('API error details:', errorData);
                        } catch {
                            console.error('Could not parse error response');
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
                    filteredProducts = filteredProducts.filter(product =>
                        product.category === filters.category
                    );
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
                            // In a real app, this would sort by creation date
                            break;
                    }
                }

                // Store all filtered products
                setAllProducts(filteredProducts);

                // Calculate total pages and notify parent if callback is provided
                const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
                if (onTotalPagesChange) {
                    onTotalPagesChange(totalPages);
                }

            } catch (err) {
                console.error('Error in product display:', err);
                setError('Failed to load products');
                // Still show sample products if there's an error
                setAllProducts(sampleProducts);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [filters, itemsPerPage, onTotalPagesChange]);

    // Apply pagination whenever allProducts or currentPage changes
    useEffect(() => {
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Get products for current page
        const currentPageProducts = allProducts.slice(startIndex, endIndex);
        setPaginatedProducts(currentPageProducts);
    }, [allProducts, currentPage, itemsPerPage]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(itemsPerPage)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse h-[380px]"
                    />
                ))}
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Show empty state
    if (paginatedProducts.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search term to find what you&apos;re looking for.
                </p>
            </div>
        );
    }

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
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Always 3 columns on large screens
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
    );
} 