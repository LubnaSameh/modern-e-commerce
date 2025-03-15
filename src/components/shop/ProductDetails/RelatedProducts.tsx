"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image?: string;
    images?: string[];
    isNew?: boolean;
    isFeatured?: boolean;
    category?: string;
    stock?: number;
}

interface RelatedProductsProps {
    title: string;
    products: Product[];
}

export default function RelatedProducts({ title, products }: RelatedProductsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('RelatedProducts component received:', { title, productsCount: products.length });
        console.log('Products data:', products);
    }, [title, products]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -320,
                behavior: "smooth"
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 320,
                behavior: "smooth"
            });
        }
    };

    if (products.length === 0) {
        console.log('No related products to display, returning null');
        return null;
    }

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product) => {
                    const imageUrl = product.image ||
                        (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
                        'https://via.placeholder.com/400?text=No+Image';

                    return (
                        <div key={product.id} className="min-w-[280px]">
                            <ProductCard
                                {...product}
                                image={imageUrl}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
} 