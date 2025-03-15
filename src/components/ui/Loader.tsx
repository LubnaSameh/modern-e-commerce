'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    fullPage?: boolean;
    className?: string;
    variant?: 'spinner' | 'dots' | 'pulse';
}

export default function Loader({
    size = 'medium',
    text,
    fullPage = false,
    className = '',
    variant = 'spinner'
}: LoaderProps) {
    // حجم Loader استناداً إلى الحجم المطلوب
    const sizeMap = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const spinnerClasses = `${sizeMap[size]} text-primary animate-spin`;
    const containerClasses = `flex flex-col items-center justify-center ${fullPage ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50' : ''
        } ${className}`;

    // متغيرات للتحريك
    const dotVariants = {
        initial: {
            y: 0,
            opacity: 0.5
        },
        animate: {
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    };

    // ظهور على حسب نوع المؤشر المطلوب
    const renderLoader = () => {
        switch (variant) {
            case 'spinner':
                return <Loader2 className={spinnerClasses} />;

            case 'dots':
                return (
                    <div className="flex space-x-2">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                variants={dotVariants}
                                initial="initial"
                                animate="animate"
                                custom={index}
                                className={`rounded-full bg-primary ${size === 'small' ? 'w-1.5 h-1.5' :
                                    size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'
                                    }`}
                                style={{ animationDelay: `${index * 0.2}s` }}
                            />
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className={`rounded-full bg-primary ${size === 'small' ? 'w-4 h-4' :
                            size === 'medium' ? 'w-8 h-8' : 'w-12 h-12'
                            }`}
                    />
                );

            default:
                return <Loader2 className={spinnerClasses} />;
        }
    };

    return (
        <div className={containerClasses}>
            {renderLoader()}
            {text && (
                <p className={`mt-3 text-gray-600 dark:text-gray-400 ${size === 'small' ? 'text-xs' :
                    size === 'medium' ? 'text-sm' : 'text-base'
                    }`}>
                    {text}
                </p>
            )}
        </div>
    );
} 