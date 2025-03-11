"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "react-toastify";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { getLowQualityImageUrl } from "@/lib/utils";

type Product = {
    id: string;
    name: string;
    price: number;
    mainImage: string;
    category: {
        name: string;
    } | null;
    description?: string;
};

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const { id, name, price, mainImage } = product;
    const category = product.category?.name;

    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // Get addItem function from cart store
    const { addItem } = useCartStore();
    
    // Get wishlist store functions
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    
    // Check if product is in wishlist on component mount
    useEffect(() => {
        // Set mounted to true to indicate client-side rendering
        setMounted(true);
        
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

    // Memoize handlers to prevent unnecessary re-renders
    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation
        
        addItem({
            id,
            name,
            price,
            image: mainImage || '/images/placeholder.jpg',
            stock: 100
        });
        
        toast.success(`${name} added to cart!`);
    }, [id, name, price, mainImage, addItem]);

    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
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
                // Add to wishlist
                addToWishlist({
                    id,
                    name,
                    price,
                    image: mainImage || '/images/placeholder.jpg'
                });
                toast.success(`${name} added to wishlist!`);
            } else {
                // Remove from wishlist
                removeFromWishlist(id);
                toast.info(`${name} removed from wishlist`);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            // Revert the UI state if there was an error
            setIsFavorite(!newState);
            toast.error("Failed to update wishlist. Please try again.");
        }
    }, [id, name, price, mainImage, isFavorite, addToWishlist, removeFromWishlist]);

    // Memoize hover handlers
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    // Prevent event bubbling for the favorite button container
    const handleFavoriteContainerClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    if (!mounted) {
        return null; // Return nothing during SSR to prevent hydration mismatch
    }

    // Generate low quality image URL for blur-up effect
    const lowQualityImageUrl = mainImage ? getLowQualityImageUrl(mainImage) : undefined;

    return (
        <Link
            href={`/shop/${id}`}
            className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex gap-2">
                {/* New and Featured badges would be added here */}
            </div>

            {/* Favorite Button - Wrap in a div to better isolate the click event */}
            <div 
                className="absolute right-2 sm:right-3 top-2 sm:top-3 z-20"
                onClick={handleFavoriteContainerClick}
            >
                <button
                    className={`p-1.5 sm:p-2 rounded-full transition-all transform 
                    ${isFavorite
                        ? 'bg-red-50 text-red-500 dark:bg-red-500/20 dark:text-red-400'
                        : 'bg-white/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-400'
                    } hover:scale-110 backdrop-blur-sm`}
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    type="button" // Explicitly set button type to prevent form submission
                >
                    <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}`}
                    />
                </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full pt-[100%] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <OptimizedImage
                    src={mainImage || '/images/placeholder.jpg'}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className={`object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"
                        } ${"dark:brightness-90"}`}
                    quality={80}
                    loading="lazy"
                    lowQualitySrc={lowQualityImageUrl}
                    loadingClassName="blur-sm"
                />

                {/* Overlay with add to cart button - shows on hover */}
                <div
                    className={`absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <button
                        onClick={handleAddToCart}
                        className="px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 transition-all text-xs sm:text-sm"
                        type="button" // Explicitly set button type
                    >
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium">Add to Cart</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col gap-1 sm:gap-2 flex-grow">
                {category && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category}
                    </span>
                )}

                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{name}</h3>

                <div className="flex items-center gap-2 mt-auto pt-1 sm:pt-2">
                    <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                        ${price.toFixed(2)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(ProductCard); 