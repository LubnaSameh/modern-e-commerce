"use client";

import { useCallback, useState, useEffect } from "react";
import { ProductFilter } from "./ProductGrid";
import { motion } from "framer-motion";
import { ChevronDown, X, Loader2 } from "lucide-react";

interface FilterSidebarProps {
    initialFilters?: ProductFilter;
    onFilterChange: (filters: ProductFilter) => void;
}

interface Category {
    id: string;
    name: string;
}

export default function FilterSidebar({ initialFilters = {}, onFilterChange }: FilterSidebarProps) {
    const [filters, setFilters] = useState<ProductFilter>(initialFilters);
    const [priceRange, setPriceRange] = useState({ min: initialFilters.minPrice || 0, max: initialFilters.maxPrice || 1000 });
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        rating: true
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Toggle section expanded state
    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    // Update filters and notify parent component
    const updateFilters = useCallback((newFilters: Partial<ProductFilter>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    }, [filters, onFilterChange]);

    // Handle category selection
    const handleCategoryChange = (categoryId: string, categoryName: string) => {
        updateFilters({ 
            category: categoryId === "all" ? undefined : categoryName,
            categoryId: categoryId === "all" ? undefined : categoryId
        });
    };

    // Handle price range change
    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        const newRange = { ...priceRange, [type]: value };
        setPriceRange(newRange);
        // Only update filters when user stops dragging
    };

    // Apply price filter when sliders are released
    const handlePriceApply = () => {
        updateFilters({
            minPrice: priceRange.min > 0 ? priceRange.min : undefined,
            maxPrice: priceRange.max < 1000 ? priceRange.max : undefined
        });
    };

    // Handle rating filter
    const handleRatingChange = (rating: number) => {
        updateFilters({ minRating: rating || undefined });
    };

    // Reset all filters
    const resetAllFilters = () => {
        setPriceRange({ min: 0, max: 1000 });
        setFilters({});
        onFilterChange({});
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

    return (
        <aside className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={resetAllFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Reset All
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mb-5 space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                        {filters.category && (
                            <button
                                onClick={() => handleCategoryChange("all", filters.category || "")}
                                className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                                {filters.category}
                                <X className="ml-1 h-3 w-3" />
                            </button>
                        )}
                        {filters.minPrice && (
                            <button
                                onClick={() => updateFilters({ minPrice: undefined })}
                                className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                                Min: ${filters.minPrice}
                                <X className="ml-1 h-3 w-3" />
                            </button>
                        )}
                        {filters.maxPrice && (
                            <button
                                onClick={() => updateFilters({ maxPrice: undefined })}
                                className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                                Max: ${filters.maxPrice}
                                <X className="ml-1 h-3 w-3" />
                            </button>
                        )}
                        {filters.minRating && (
                            <button
                                onClick={() => updateFilters({ minRating: undefined })}
                                className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                                {filters.minRating}+ Stars
                                <X className="ml-1 h-3 w-3" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Categories Filter */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
                    <button
                        onClick={() => toggleSection('categories')}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Categories</h3>
                        <ChevronDown
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.categories ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {expandedSections.categories && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                            <div className={`mt-1 ${expandedSections.categories ? 'block' : 'hidden'}`}>
                                <div className="space-y-1">
                                    {isLoadingCategories ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleCategoryChange("all", "All")}
                                                    className={`w-full text-left py-1.5 px-2 rounded text-sm ${
                                                        !filters.category && !filters.categoryId
                                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }`}
                                                >
                                                    All Categories
                                                </button>
                                            </div>
                                            
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center">
                                                    <button
                                                        onClick={() => handleCategoryChange(category.id, category.name)}
                                                        className={`w-full text-left py-1.5 px-2 rounded text-sm ${
                                                            filters.categoryId === category.id
                                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        }`}
                                                    >
                                                        {category.name}
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Price Range Filter */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Price Range</h3>
                        <ChevronDown
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.price ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {expandedSections.price && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-[45%]">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Min</span>
                                    <div className="flex items-center">
                                        <span className="text-gray-500 dark:text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                                            onBlur={handlePriceApply}
                                            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-[45%]">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Max</span>
                                    <div className="flex items-center">
                                        <span className="text-gray-500 dark:text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                                            onBlur={handlePriceApply}
                                            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange.min}
                                    onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                                    onMouseUp={handlePriceApply}
                                    onTouchEnd={handlePriceApply}
                                    className="w-full"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange.max}
                                    onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                                    onMouseUp={handlePriceApply}
                                    onTouchEnd={handlePriceApply}
                                    className="w-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Rating Filter */}
                <div className="pb-4">
                    <button
                        onClick={() => toggleSection('rating')}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Rating</h3>
                        <ChevronDown
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.rating ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {expandedSections.rating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3"
                        >
                            {[4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`w-full flex items-center text-left px-2 py-1.5 rounded ${filters.minRating === rating
                                            ? "bg-blue-50 dark:bg-blue-900/30"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 ${i < rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {rating}+ stars
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </aside>
    );
} 