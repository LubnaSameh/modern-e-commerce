"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

// نوع بيانات التصنيف
interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    _count: {
        products: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // جلب التصنيفات عند تحميل الصفحة
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');

                if (!res.ok) {
                    throw new Error('فشل في جلب التصنيفات');
                }

                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error('خطأ:', err);
                setError('حدث خطأ أثناء جلب التصنيفات. يرجى المحاولة مرة أخرى لاحقًا.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // التوجه إلى صفحة المنتجات الخاصة بالتصنيف المحدد
    const handleCategoryClick = (categoryId: string) => {
        router.push(`/shop?category=${categoryId}`);
    };

    // صورة افتراضية للتصنيفات التي ليس لها صورة
    const defaultCategoryImage = "/images/default-category.jpg";

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16">
            {/* ترويسة الصفحة */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">التصنيفات</h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                        استكشف مجموعتنا المتنوعة من التصنيفات واختر ما يناسب احتياجاتك.
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* عرض حالة التحميل */}
                {isLoading && (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* عرض رسالة الخطأ */}
                {error && !isLoading && (
                    <div className="text-center text-red-500 py-8">{error}</div>
                )}

                {/* عرض التصنيفات */}
                {!isLoading && !error && (
                    <>
                        {categories.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                لا توجد تصنيفات متاحة حاليًا.
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {categories.map((category) => (
                                    <motion.div
                                        key={category.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                        onClick={() => handleCategoryClick(category.id)}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={category.image || defaultCategoryImage}
                                                alt={category.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = defaultCategoryImage;
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                                            {category.description && (
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                                    {category.description}
                                                </p>
                                            )}
                                            <p className="text-blue-600 dark:text-blue-400 text-sm">
                                                {category._count.products} منتج
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 