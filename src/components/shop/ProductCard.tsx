"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { memo } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "react-toastify";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image: string;
    isNew?: boolean;
    isFeatured?: boolean;
    category?: string;
    stock?: number;
}

function ProductCard({
    id,
    name,
    price,
    originalPrice,
    rating,
    image,
    isNew = false,
    isFeatured = false,
    category,
    stock = 10
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    
    // Use a fallback image URL if image is empty or undefined
    const imageUrl = image && image.trim() !== "" 
        ? image 
        : "https://via.placeholder.com/400?text=No+Image";
    
    // Check if the image URL is a local URL (localhost)
    const isLocalUrl = (url: string) => {
        return url.includes('localhost') || url.startsWith('/');
    };

    // Get addItem function from cart store - use the exact function to prevent re-renders
    const addItem = useCartStore(state => state.addItem);
    
    // Get wishlist store functions
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    
    // Check if product is in wishlist on component mount
    useEffect(() => {
        // Ensure we're on the client side
        if (typeof window !== 'undefined') {
            try {
                // Force rehydration of the wishlist store
                useWishlistStore.persist.rehydrate();
                
                // Check if the product is in the wishlist
                const inWishlist = isInWishlist(id);
                setIsFavorite(inWishlist);
            } catch (error) {
                console.error("Error checking wishlist status:", error);
            }
        }
    }, [id, isInWishlist]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation when clicking the button
        
        // Add item to cart using our cart store
        addItem({
            id,
            name,
            price,
            image: imageUrl, // Use the fallback image URL if needed
            stock
        }, 1);
        
        // Show success toast
        toast.success(`${name} added to cart!`, {
            position: "top-right",
            autoClose: 2000
        });
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        // Ensure the event doesn't bubble up and cause navigation
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle the favorite state
        const newState = !isFavorite;
        setIsFavorite(newState);
        
        // Ensure we're on the client side
        if (typeof window === 'undefined') return;
        
        try {
            if (newState) {
                // Add to wishlist with guaranteed imageUrl
                addToWishlist({
                    id,
                    name,
                    price,
                    image: imageUrl // This is guaranteed to have at least a placeholder
                });
                toast.success(`${name} added to wishlist!`, {
                    position: "top-right",
                    autoClose: 2000
                });
            } else {
                // Remove from wishlist
                removeFromWishlist(id);
                toast.info(`${name} removed from wishlist`, {
                    position: "top-right",
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            // Revert the UI state if there was an error
            setIsFavorite(!newState);
            toast.error("Failed to update wishlist. Please try again.");
        }
    };

    return (
        <Link
            href={`/shop/${id}`}
            className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                {isNew && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-600 dark:bg-blue-700 text-white rounded-full">
                        New
                    </span>
                )}
                {isFeatured && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-purple-600 dark:bg-purple-700 text-white rounded-full">
                        Featured
                    </span>
                )}
            </div>

            {/* Favorite Button - Wrap in a div to better isolate the click event */}
            <div 
                className="absolute right-3 top-3 z-20"
                onClick={(e) => {
                    // Additional layer of event stopping
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <button
                    className={`p-2 rounded-full transition-all transform 
                    ${isFavorite
                        ? 'bg-red-50 text-red-500 dark:bg-red-500/20 dark:text-red-400'
                        : 'bg-white/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-400'
                    } hover:scale-110 backdrop-blur-sm`}
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    type="button" // Explicitly set button type to prevent form submission
                >
                    <Heart
                        className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}`}
                    />
                </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full pt-[100%] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {isLocalUrl(imageUrl) ? (
                    // Use Next.js Image component for better performance
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover transition-all duration-500 ${
                            isHovered ? "scale-110" : "scale-100"
                        } dark:brightness-90`}
                        loading="lazy"
                    />
                ) : (
                    // Use next/image for external URLs
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"
                            } dark:brightness-90`}
                        loading="lazy"
                    />
                )}

                {/* Overlay with add to cart button - shows on hover */}
                <div
                    className={`absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <button
                        onClick={handleAddToCart}
                        className="px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full flex items-center gap-2 transform hover:scale-105 transition-all"
                        type="button" // Explicitly set button type
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="font-medium">Add to Cart</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-grow">
                {category && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category}
                    </span>
                )}

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h3>

                <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating
                                ? "text-yellow-400 fill-yellow-400 dark:text-yellow-500 dark:fill-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                                }`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({rating.toFixed(1)})
                    </span>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${price.toFixed(2)}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard); 