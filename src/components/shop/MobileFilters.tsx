"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { ProductFilter } from "./ProductGrid";

interface MobileFiltersProps {
    filters: ProductFilter;
    onFilterChange: (filters: ProductFilter) => void;
}

export default function MobileFilters({ filters, onFilterChange }: MobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openFilters = () => setIsOpen(true);
    const closeFilters = () => setIsOpen(false);

    // Count active filters
    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(value => value !== undefined).length;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <>
            {/* Filter Button */}
            <button
                onClick={openFilters}
                className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                        {activeFiltersCount}
                    </span>
                )}
            </button>

            {/* Filters Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40"
                            onClick={closeFilters}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 overflow-y-auto"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                                <button
                                    onClick={closeFilters}
                                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-4">
                                <FilterSidebar
                                    initialFilters={filters}
                                    onFilterChange={(newFilters) => {
                                        onFilterChange(newFilters);
                                        // Don't close drawer on filter change to allow multiple selections
                                    }}
                                />
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
                                <button
                                    onClick={closeFilters}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg"
                                >
                                    View Results {activeFiltersCount > 0 ? `(${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''})` : ''}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
} 