"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Define the category type
interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    _count?: {
        products: number;
    };
}

// Color mapping for categories - this stays hardcoded to maintain visual design
const categoryColors: Record<string, { color: string; darkColor: string }> = {
    'Electronics': {
        color: "from-blue-400 to-indigo-500",
        darkColor: "from-blue-600/80 to-indigo-600/80"
    },
    'Fashion': {
        color: "from-pink-400 to-rose-500",
        darkColor: "from-pink-600/80 to-rose-600/80"
    },
    'Home & Garden': {
        color: "from-green-400 to-emerald-500",
        darkColor: "from-green-600/80 to-emerald-600/80"
    },
    'Health & Beauty': {
        color: "from-purple-400 to-violet-500",
        darkColor: "from-purple-600/80 to-violet-600/80"
    },
    'Sports & Outdoors': {
        color: "from-amber-400 to-orange-500",
        darkColor: "from-amber-600/80 to-orange-600/80"
    },
    'Books & Media': {
        color: "from-teal-400 to-cyan-500",
        darkColor: "from-teal-600/80 to-cyan-600/80"
    },
    // Default color for any new categories
    'default': {
        color: "from-gray-400 to-slate-500",
        darkColor: "from-gray-600/80 to-slate-600/80"
    }
};

export default function CategorySection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/categories');

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Show loading state
    if (isLoading) {
        return (
            <section className="py-16 px-4 bg-white dark:bg-gray-950">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shop by Category</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
                            Loading categories...
                        </p>
                    </div>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state
    if (error) {
        return (
            <section className="py-16 px-4 bg-white dark:bg-gray-950">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shop by Category</h2>
                        <p className="text-red-500 dark:text-red-400 mt-3 max-w-2xl mx-auto">
                            {error}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 bg-white dark:bg-gray-950">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shop by Category</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
                        Browse our extensive collection of products organized by category to find exactly what you&apos;re looking for.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => {
                        // Get colors based on category name or use default
                        const colorScheme = categoryColors[category.name] || categoryColors.default;

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/shop?category=${encodeURIComponent(category.id)}`}
                                    className="group block h-full overflow-hidden rounded-3xl relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-90 dark:opacity-50 group-hover:opacity-95 transition-opacity duration-300 z-10 bg-gradient-to-r dark:bg-gradient-to-r dark:from-gray-900/80 dark:to-gray-900/80"></div>

                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br opacity-70 group-hover:opacity-80 transition-opacity duration-300 z-20 bg-gradient-to-r ${colorScheme.color} dark:${colorScheme.darkColor} dark:opacity-70`}>
                                    </div>

                                    <div className="relative overflow-hidden h-80">
                                        <Image
                                            src={category.image || "https://via.placeholder.com/800x800?text=No+Image"}
                                            alt={category.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-5000 group-hover:scale-110 dark:brightness-75"
                                        />
                                    </div>

                                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-30">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:underline">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/90 text-sm mb-4">
                                            {category.description || ""}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white text-sm font-medium bg-white/20 dark:bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                                                {category._count?.products || 0} Products
                                            </span>
                                            <span className="text-white group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                                                Shop Now
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    }
                    )}
                </div>
            </div>
        </section>
    );
} 