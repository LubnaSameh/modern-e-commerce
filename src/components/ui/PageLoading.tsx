'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PageLoading() {
    // منع التصيير على الخادم تمامًا
    const [isClient, setIsClient] = useState(false);
    const [progress, setProgress] = useState(0);

    // استخدم العبارة التي تريدها هنا - لن تظهر على الخادم على الإطلاق
    const loadingText = "Welcome to our exclusive collection";

    // التأكد من أننا نعمل على جانب العميل فقط
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Simulate loading progress - فقط على جانب العميل
    useEffect(() => {
        if (!isClient) return;

        const timer = setInterval(() => {
            setProgress(prevProgress => {
                // Speed up as we get closer to 100%
                const increment = prevProgress < 30 ? 5 :
                    prevProgress < 60 ? 3 :
                        prevProgress < 90 ? 1 : 0.5;

                const nextProgress = prevProgress + increment;
                return nextProgress >= 100 ? 100 : nextProgress;
            });
        }, 150);

        return () => clearInterval(timer);
    }, [isClient]);

    // إذا لم نكن على جانب العميل، ارجع div فارغ
    if (!isClient) {
        return <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50"></div>;
    }

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
                {/* Logo or site name */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-primary">ModernShop</h1>
                </motion.div>

                {/* Loading spinner */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 1
                    }}
                >
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </motion.div>

                {/* Loading text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-gray-600 dark:text-gray-400"
                >
                    {loadingText}
                </motion.p>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mt-6 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Percentage text */}
                <motion.p
                    className="mt-2 text-xs text-gray-500 dark:text-gray-500"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    {Math.round(progress)}%
                </motion.p>
            </div>
        </div>
    );
} 