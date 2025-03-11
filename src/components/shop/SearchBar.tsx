"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
    onSearch: (term: string) => void;
    initialSearchTerm?: string;
    className?: string;
}

export default function SearchBar({ onSearch, initialSearchTerm = '', className = '' }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const inputRef = useRef<HTMLInputElement>(null);

    // Apply search when debounced search term changes
    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Clear search term
    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Search products..."
                    className="w-full py-3 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
} 