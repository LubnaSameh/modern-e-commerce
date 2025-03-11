"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    // Filter out empty image URLs and ensure we have valid images
    const validImages = useMemo(() => {
        // Make sure we have at least one image, even if it's a placeholder
        if (!images || images.length === 0) {
            return ['https://via.placeholder.com/400?text=No+Image'];
        }
        
        // Filter out empty strings or undefined values
        const filtered = images.filter(img => img && img.trim() !== '');
        
        // If all images were filtered out, return placeholder
        return filtered.length > 0 ? filtered : ['https://via.placeholder.com/400?text=No+Image'];
    }, [images]);

    const [activeImage, setActiveImage] = useState(0);

    // Next and previous image handlers
    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + validImages.length) % validImages.length);
    };
    
    // Check if the image URL is a local URL (localhost)
    const isLocalUrl = (url: string) => {
        return url.includes('localhost') || url.startsWith('/');
    };

    return (
        <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                {validImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-300 ${index === activeImage ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {isLocalUrl(image) ? (
                            // استخدام Image من Next.js للحصول على أداء أفضل
                            <div className="relative w-full h-full">
                                <Image
                                    src={image}
                                    alt={`${productName} - Image ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            // If it's an external URL, use next/image
                            <Image
                                src={image}
                                alt={`${productName} - Image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority={index === 0}
                            />
                        )}
                    </div>
                ))}

                {/* Navigation arrows */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-white hover:bg-white dark:hover:bg-black/70"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-white hover:bg-white dark:hover:bg-black/70"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}

                {/* Image counter */}
                {validImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                        {activeImage + 1} / {validImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail navigation */}
            {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
                    {validImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition ${activeImage === index
                                ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                                : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600'
                                }`}
                        >
                            {isLocalUrl(image) ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <Image
                                    src={image}
                                    alt={`${productName} thumbnail ${index + 1}`}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 