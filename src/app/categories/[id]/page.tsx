"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";
import { motion } from "framer-motion";

// تعريف أنواع البيانات
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    mainImage: string;
    stock: number;
    discount: {
        discountPercent: number;
    } | null;
    productImages: {
        id: string;
        url: string;
    }[];
}

interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    products: Product[];
}

export default function CategoryDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // جلب بيانات التصنيف
    useEffect(() => {
        const fetchCategoryDetails = async () => {
            if (!params.id) return;

            try {
                setIsLoading(true);
                const res = await fetch(`/api/categories/${params.id}`);

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('التصنيف غير موجود');
                    }
                    throw new Error('فشل في جلب بيانات التصنيف');
                }

                const data = await res.json();
                setCategory(data);
            } catch (err) {
                console.error('خطأ:', err);
                setError('حدث خطأ أثناء جلب بيانات التصنيف. يرجى المحاولة مرة أخرى لاحقًا.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [params.id]);

    // صورة افتراضية
    const defaultCategoryImage = "/images/default-category.jpg";

    // العودة إلى صفحة التصنيفات
    const handleBackClick = () => {
        router.back();
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16">
            {/* عرض حالة التحميل */}
            {isLoading && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* عرض رسالة الخطأ */}
            {error && !isLoading && (
                <div className="container mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center text-red-500">{error}</div>
                    <div className="text-center mt-4">
                        <button
                            onClick={handleBackClick}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            العودة إلى التصنيفات
                        </button>
                    </div>
                </div>
            )}

            {/* عرض بيانات التصنيف والمنتجات */}
            {category && !isLoading && !error && (
                <>
                    {/* ترويسة التصنيف */}
                    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="container mx-auto max-w-7xl px-4 py-8">
                            <button
                                onClick={handleBackClick}
                                className="mb-4 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                العودة إلى التصنيفات
                            </button>

                            <div className="flex flex-col md:flex-row items-start gap-6">
                                {category.image && (
                                    <div className="relative h-48 w-48 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                            src={category.image || defaultCategoryImage}
                                            alt={category.name}
                                            fill
                                            sizes="192px"
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = defaultCategoryImage;
                                            }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{category.name}</h1>
                                    {category.description && (
                                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                                            {category.description}
                                        </p>
                                    )}
                                    <p className="text-blue-600 dark:text-blue-400">
                                        {category.products.length} منتج في هذا التصنيف
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* عرض المنتجات */}
                    <div className="container mx-auto max-w-7xl px-4 py-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">المنتجات في هذا التصنيف</h2>

                        {category.products.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                لا توجد منتجات في هذا التصنيف بعد.
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {category.products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        image={product.mainImage}
                                        rating={4.5}
                                        stock={product.stock}
                                        category={category.name}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
} 