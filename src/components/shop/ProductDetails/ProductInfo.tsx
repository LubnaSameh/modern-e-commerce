"use client";

import { useState, useCallback, useEffect } from "react";
import { Star, ShoppingBag, Heart, Share2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "react-toastify";

interface ProductInfoProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    description: string;
    stock: number;
    colors?: string[];
    isNew?: boolean;
}

export default function ProductInfo({
    id,
    name,
    price,
    originalPrice,
    rating,
    reviewCount,
    description,
    stock,
    colors = [],
    isNew = false,
}: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(
        colors.length > 0 ? colors[0] : undefined
    );
    const [isFavorite, setIsFavorite] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Get addItem function from cart store - using direct store import to prevent SSR issues
    const addItem = useCartStore.getState().addItem;
    
    // Get wishlist store functions
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    // Check if product is in wishlist on component mount
    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            useWishlistStore.persist.rehydrate();
            const inWishlist = isInWishlist(id);
            setIsFavorite(inWishlist);
        }
    }, [id, isInWishlist]);

    // Decrease quantity
    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
    };

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity((prev) => (prev < stock ? prev + 1 : prev));
    };

    // Handle add to cart
    const handleAddToCart = () => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Use the most current version of addItem
        useCartStore.getState().addItem({
            id,
            name,
            price,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", // Placeholder image
            stock,
            color: selectedColor
        }, quantity);

        toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`, {
            position: "top-right",
            autoClose: 2000
        });
    };

    // Toggle favorite
    const toggleFavorite = () => {
        const newState = !isFavorite;
        setIsFavorite(newState);
        
        if (newState) {
            // Add to wishlist
            addToWishlist({
                id,
                name,
                price,
                image: document.querySelector('.product-main-image')?.getAttribute('src') || undefined
            });
            toast.success('Added to wishlist');
        } else {
            // Remove from wishlist
            removeFromWishlist(id);
            toast.info('Removed from wishlist');
        }
    };

    // Share product
    const shareProduct = () => {
        if (typeof window === 'undefined') return;

        if (navigator.share) {
            navigator
                .share({
                    title: name,
                    text: description,
                    url: window.location.href
                })
                .catch((error) => console.log("Error sharing:", error));
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.info("Link copied to clipboard", {
                position: "top-right",
                autoClose: 2000
            });
        }
    };

    // Color name formatter
    const formatColorName = (color: string) => {
        return color.charAt(0).toUpperCase() + color.slice(1);
    };

    return (
        <div className="space-y-6">
            {/* Product name and badge */}
            <div className="space-y-2">
                {isNew && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded">
                        New Arrival
                    </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {name}
                </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${price.toFixed(2)}
                </span>
                {originalPrice && originalPrice > price && (
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${originalPrice.toFixed(2)}
                    </span>
                )}
                {originalPrice && originalPrice > price && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium px-2.5 py-0.5 rounded">
                        Save ${(originalPrice - price).toFixed(2)}
                    </span>
                )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < rating
                                    ? "text-yellow-400 fill-yellow-400 half-star"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                    {rating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({reviewCount} reviews)
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
            </p>

            {/* Color selection */}
            {colors.length > 0 && (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Color: {selectedColor && formatColorName(selectedColor)}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`relative w-12 h-12 rounded-full border-2 ${selectedColor === color
                                    ? "border-blue-500 dark:border-blue-400"
                                    : "border-transparent"
                                    }`}
                                style={{ backgroundColor: color }}
                                aria-label={`Select ${color} color`}
                            >
                                {selectedColor === color && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="h-2 w-2 rounded-full bg-white shadow-sm"></span>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity
                </label>
                <div className="flex w-fit items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className={`p-3 text-gray-600 dark:text-gray-400 ${quantity <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                            />
                        </svg>
                    </button>
                    <span className="w-12 text-center text-gray-900 dark:text-gray-100 font-medium">
                        {quantity}
                    </span>
                    <button
                        onClick={increaseQuantity}
                        disabled={quantity >= stock}
                        className={`p-3 text-gray-600 dark:text-gray-400 ${quantity >= stock
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stock > 0
                        ? stock < 10
                            ? `Only ${stock} left in stock`
                            : "In stock"
                        : "Out of stock"}
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
                <button
                    onClick={handleAddToCart}
                    disabled={stock === 0}
                    className={`flex-1 md:flex-none md:min-w-[180px] flex items-center justify-center gap-2 px-6 py-3 rounded-full ${stock === 0
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                        } text-white font-medium transition-colors`}
                >
                    <ShoppingBag className="h-5 w-5" />
                    {stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full border ${isFavorite
                        ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                    aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`}
                    />
                </button>
                <button
                    onClick={shareProduct}
                    className="p-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    aria-label="Share product"
                >
                    <Share2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
} 