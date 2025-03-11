"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // If total pages are less than max to show, display all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first page
            pageNumbers.push(1);

            if (currentPage <= 3) {
                // If current page is near the start
                pageNumbers.push(2, 3, 4);
                pageNumbers.push(null); // null represents ellipsis
            } else if (currentPage >= totalPages - 2) {
                // If current page is near the end
                pageNumbers.push(null);
                pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1);
            } else {
                // If current page is in the middle
                pageNumbers.push(null);
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
                pageNumbers.push(null);
            }

            // Always include last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    // Helper to render each page button
    const renderPageButton = (pageNumber: number | null, index: number) => {
        if (pageNumber === null) {
            return (
                <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500 dark:text-gray-400"
                >
                    ...
                </span>
            );
        }

        return (
            <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-9 h-9 flex items-center justify-center rounded-full focus:outline-none transition-colors ${currentPage === pageNumber
                        ? "bg-blue-600 dark:bg-blue-700 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
            >
                {pageNumber}
            </button>
        );
    };

    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center items-center space-x-1" aria-label="Pagination">
            {/* Previous page button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-full focus:outline-none transition-colors ${currentPage === 1
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page numbers */}
            {pageNumbers.map(renderPageButton)}

            {/* Next page button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded-full focus:outline-none transition-colors ${currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </nav>
    );
}

// Memoize to prevent unnecessary re-renders
export default memo(Pagination); 