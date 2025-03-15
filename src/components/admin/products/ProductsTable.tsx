"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash, Search, Filter, ChevronDown, Eye, Loader2, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-toastify";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    mainImage: string;
    stock: number;
    category: {
        name: string;
    } | null;
    createdAt: string;
};

// Mobile product card component
const ProductCard = ({ product, onDelete }: { product: Product, onDelete: (id: string) => void }) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
                <Image
                    src={product.mainImage || '/placeholder.png'}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                />

                <div className="flex-1">
                    <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>

                            {showActions && (
                                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                    <div className="py-1">
                                        <Link
                                            href={`/shop/${product.id}`}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            target="_blank"
                                            onClick={() => setShowActions(false)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/products/edit/${product.id}`}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setShowActions(false)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                onDelete(product.id);
                                                setShowActions(false);
                                            }}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                        >
                                            <Trash className="h-4 w-4 mr-2" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{product.description}</p>

                    <div className="flex justify-between items-center mt-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(product.price)}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 0
                            ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                            : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'}`}
                        >
                            {product.stock > 0 ? `${product.stock}` : 'Out'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                            {product.category?.name || 'Uncategorized'}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function ProductsTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const productsPerPage = 10;

    // Check if we're on mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Fetch ONLY products from API, without using sample data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Try to fetch real data from API
                try {
                    const response = await fetch('/api/admin/products', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const apiProducts = data.products || [];

                        // Only use actual database products
                        setProducts(apiProducts);

                        // Show empty state if no products found
                        if (apiProducts.length === 0) {
                            setError('No products found in the database. Add your first product!');
                        }
                    } else {
                        console.error('API error:', response.status);
                        setError(`Failed to fetch products: ${response.status}`);
                    }
                } catch (apiError) {
                    console.error('API request failed:', apiError);
                    setError('Failed to connect to the API. Please try again later.');
                }
            } catch (error) {
                console.error('Error in product display:', error);
                setError('An unexpected error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on search term and category filter
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Normalize the category name for comparison
        const normalizedCategoryName = product.category?.name
            ? product.category.name
                .split('-').join(' ')
                .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
            : '';

        const matchesFilter = filter === "All" || normalizedCategoryName === filter;

        return matchesSearch && matchesFilter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Reset to first page when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);

    // Get unique categories for filter dropdown with proper normalization
    const normalizedCategories = new Map();

    // Add "All" as the default option
    normalizedCategories.set("All", "All");

    // Process each product's category
    products.forEach(product => {
        if (product.category && product.category.name) {
            // Normalize by converting to title case
            const normalizedName = product.category.name
                .split('-').join(' ') // Replace hyphens with spaces
                .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

            normalizedCategories.set(normalizedName, normalizedName);
        }
    });

    // Convert the Map to an array, with "All" first
    const categories = Array.from(normalizedCategories.values());

    // Create a map of category names to ensure unique keys
    const getCategoryKey = (category: string) => {
        return category === 'All' ? 'all-category' : `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
    };

    // Delete product handler
    const handleDelete = async (id: string) => {
        if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
            try {
                // For real data, call the API
                const response = await fetch(`/api/admin/products/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'فشل في حذف المنتج');
                }

                // Remove product from state
                setProducts(products.filter(product => product.id !== id));
                toast.success('تم حذف المنتج بنجاح');
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error(`فشل في حذف المنتج: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <div className="flex">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                id="filter-menu"
                                aria-expanded="true"
                                aria-haspopup="true"
                                onClick={() => document.getElementById("filter-dropdown")?.classList.toggle("hidden")}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {filter}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                        <div
                            id="filter-dropdown"
                            className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
                        >
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="filter-menu">
                                {categories.map((category) => (
                                    <button
                                        key={getCategoryKey(category)}
                                        onClick={() => {
                                            setFilter(category);
                                            document.getElementById("filter-dropdown")?.classList.add("hidden");
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${filter === category
                                            ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            }`}
                                        role="menuitem"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading and Error States */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="p-6 text-center text-red-500">
                    {error}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No products found
                </div>
            ) : (
                <>
                    {/* Mobile View - Card Layout */}
                    {isMobile ? (
                        <div className="p-4 space-y-4">
                            {currentProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Desktop View - Table Layout */
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date Added
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            {/* Product cell with image and name */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <Image
                                                            src={product.mainImage || '/placeholder.png'}
                                                            alt={product.name}
                                                            width={40}
                                                            height={40}
                                                            className="h-10 w-10 rounded-md object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                            {product.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Price */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {formatCurrency(product.price)}
                                                </div>
                                            </td>
                                            {/* Stock */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0
                                                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                                                    : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'}`}
                                                >
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                </span>
                                            </td>
                                            {/* Category */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {product.category?.name || 'Uncategorized'}
                                                </div>
                                            </td>
                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </td>
                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/shop/${product.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        target="_blank"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/edit/${product.id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <Trash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination - works for both mobile and desktop */}
                    <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                                ${currentPage === 1
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                                ${currentPage === totalPages
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to <span className="font-medium">
                                        {Math.min(indexOfLastProduct, filteredProducts.length)}
                                    </span> of <span className="font-medium">{filteredProducts.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium 
                                        ${currentPage === 1
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={`page-${number}`}
                                            onClick={() => paginate(number)}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium 
                                            ${currentPage === number
                                                    ? 'z-10 bg-primary text-white dark:bg-primary'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium 
                                        ${currentPage === totalPages
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 