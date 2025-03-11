"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

// Define the search result type to match API response
interface SearchResult {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Handle click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handle escape key to close
    useEffect(() => {
        function handleEscKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    // Reset error when search term changes
    useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [searchTerm, error]);

    // Fetch search results
    useEffect(() => {
        async function fetchSearchResults() {
            if (!debouncedSearchTerm) {
                setSearchResults([]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                console.log(`Fetching search results for: "${debouncedSearchTerm}"`);
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedSearchTerm)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    console.error('Search error:', data.error || 'Unknown error', 'Status:', response.status);
                    setError(data.error || `Failed to search products (${response.status}). Please try again.`);
                    setSearchResults([]);
                    return;
                }
                
                if (!Array.isArray(data)) {
                    console.error('Invalid search response format:', data);
                    setError(typeof data.error === 'string' ? data.error : 'Received invalid data format from server');
                    setSearchResults([]);
                    return;
                }
                
                console.log(`Found ${data.length} search results`);
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setError('An unexpected error occurred. Please try again.');
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSearchResults();
    }, [debouncedSearchTerm]);

    // Handle search submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
            onClose();
        }
    };

    // Reset search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSearchResults([]);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden transition-all transform"
            >
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="w-full py-3 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center">
                            <div className="flex justify-center mb-2">
                                <AlertTriangle className="h-8 w-8 text-amber-500" />
                            </div>
                            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                            <button 
                                onClick={() => setError(null)}
                                className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Try again
                            </button>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="p-2">
                            {searchResults.map((product) => (
                                <div 
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        // Check if it's a fixed product (IDs start with 'fixed-')
                                        const isFixedProduct = product.id.startsWith('fixed-');
                                        
                                        // Use the appropriate route
                                        if (isFixedProduct) {
                                            router.push(`/fixed-products/${product.id}`);
                                        } else {
                                            router.push(`/shop/${product.id}`);
                                        }
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        {product.image && (
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-cover rounded-md"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</p>
                                                {product.category && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                                                        {product.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : debouncedSearchTerm ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No products found</p>
                        </div>
                    ) : null}
                </div>

                {/* Footer with close button */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
} 