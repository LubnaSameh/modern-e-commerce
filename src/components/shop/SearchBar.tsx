"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
    onSearch: (term: string) => void;
    initialSearchTerm?: string;
    className?: string;
}

interface SearchResult {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export default function SearchBar({ onSearch, initialSearchTerm = '', className = '' }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Apply search when debounced search term changes
    useEffect(() => {
        onSearch(debouncedSearchTerm);

        // If search term is not empty, fetch search results
        if (debouncedSearchTerm.trim().length > 0) {
            setIsLoading(true);
            setHasSearched(true);
            fetch(`/api/products/search?term=${encodeURIComponent(debouncedSearchTerm)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Search failed with status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setResults(data);
                        setShowResults(true);
                    } else {
                        console.error('Invalid search response format:', data);
                        setResults([]);
                    }
                })
                .catch(error => {
                    console.error('Search error:', error);
                    setResults([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setResults([]);
            setShowResults(false);
            setHasSearched(false);
        }
    }, [debouncedSearchTerm, onSearch]);

    // Handle clicks outside the search results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim() === '') {
            setShowResults(false);
            setHasSearched(false);
        }
    };

    // Clear search term
    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
        setShowResults(false);
        setHasSearched(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Handle item selection
    const handleSelectItem = (result: SearchResult) => {
        setSearchTerm(result.name);
        onSearch(result.name);
        setShowResults(false);
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
                    onFocus={() => debouncedSearchTerm.trim() !== '' && results.length > 0 && setShowResults(true)}
                    placeholder="Search for products, categories, brands..."
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

            {/* Search Results Dropdown */}
            {showResults && (
                <div
                    ref={resultsRef}
                    className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
                >
                    {isLoading ? (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div>
                            {results.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => handleSelectItem(result)}
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center"
                                >
                                    {result.image && (
                                        <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-600 mr-3 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={result.image}
                                                alt={result.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{result.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">${result.price.toFixed(2)}</span>
                                            {result.category && (
                                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
                                                    {result.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hasSearched && debouncedSearchTerm.trim() !== '' ? (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No products found for "{debouncedSearchTerm}"
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
} 