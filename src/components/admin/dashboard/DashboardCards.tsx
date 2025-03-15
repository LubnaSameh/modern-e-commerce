"use client";

import {
    Users,
    ShoppingBag,
    TrendingUp,
    LineChart,
    ShoppingCart
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Loader from "@/components/ui/Loader";
import { motion, useInView, animate } from "framer-motion";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: number;
    description?: string;
    isLoading?: boolean;
    color?: string;
    index?: number;
};

// Fixed data for the dashboard
const fixedStats = {
    totalRevenue: 1580.5,
    totalOrders: 84,
    totalUsers: 532,
};

const StatCard = ({ title, value, icon, change, description, isLoading, color = "primary", index = 0 }: StatCardProps) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true });
    const valueRef = useRef<HTMLDivElement>(null);

    // Animation variants for the card
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    // Colors for different card types
    const colorMap: Record<string, string> = {
        primary: "bg-primary bg-opacity-10 text-primary",
        blue: "bg-blue-500 bg-opacity-10 text-blue-500",
        green: "bg-green-500 bg-opacity-10 text-green-500",
        red: "bg-red-500 bg-opacity-10 text-red-500"
    };

    // Apply color based on prop or fallback to primary
    const colorClass = colorMap[color] || colorMap.primary;

    // Line chart paths - unique for each card type
    const chartPaths: Record<string, string> = {
        primary: "M5 20 L25 12 L45 15 L65 5 L85 8", // Trending up slightly
        blue: "M5 15 L25 16 L45 14 L65 11 L85 5", // Trending down then up sharply
        red: "M5 8 L25 12 L45 16 L65 18 L85 19", // Trending down gradually
        green: "M5 18 L25 15 L45 16 L65 13 L85 5", // Fluctuating then up
    };

    // Get the appropriate chart path based on color
    const chartPath = chartPaths[color] || chartPaths.primary;

    // Animate number values when they come into view
    useEffect(() => {
        if (isInView && valueRef.current && !isLoading && typeof value === 'number') {
            animate(0, value, {
                duration: 1.5,
                delay: index * 0.1 + 0.3,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (valueRef.current) {
                        if (title === "Total Sales") {
                            valueRef.current.textContent = formatCurrency(latest);
                        } else {
                            valueRef.current.textContent = Math.round(latest).toString();
                        }
                    }
                }
            });
        }
    }, [isInView, value, isLoading, index, title]);

    // SVG path animation properties
    const pathVariants = {
        hidden: {
            pathLength: 0,
            opacity: 0
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    delay: index * 0.1 + 0.5,
                    duration: 1.5,
                    ease: "easeInOut"
                },
                opacity: {
                    delay: index * 0.1 + 0.5,
                    duration: 0.3
                }
            }
        }
    };

    return (
        <motion.div
            ref={cardRef}
            className={`bg-white dark:bg-gray-800 p-5 sm:p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all relative overflow-hidden h-[160px]`}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={index}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Top section with title and icon */}
            <div className="flex items-start justify-between mb-2">
                <motion.h3
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 z-20"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                >
                    {title}
                </motion.h3>
                <motion.div
                    className={`h-12 w-12 rounded-full ${colorClass} flex items-center justify-center shadow-md z-20`}
                    whileHover={{ rotate: 15 }}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.1 + 0.1
                    }}
                >
                    {icon}
                </motion.div>
            </div>

            {/* Middle section with value and percentage */}
            <div className="flex justify-between items-center mb-8 z-20 relative">
                <div className="z-20">
                    <div className="text-2xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                        {isLoading ? (
                            <Loader size="small" variant="pulse" className="my-1" />
                        ) : (
                            <motion.div
                                ref={valueRef}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                            >
                                {typeof value === 'string' ? value : (title === "Total Sales" ? formatCurrency(0) : "0")}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Percentage change - moved to right side */}
                {change !== undefined && (
                    <motion.div
                        className={`inline-flex items-center text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'} z-20`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    >
                        <span>{change >= 0 ? '+' : ''}{change}%</span>
                        <TrendingUp className={`ml-1 h-3 w-3 ${change >= 0 ? '' : 'transform rotate-180'}`} />
                    </motion.div>
                )}
            </div>

            {/* Bottom section with chart only - now has clear space */}
            <div className="absolute bottom-0 right-0 left-0 h-16 pt-2">
                <motion.div
                    className="h-full w-full opacity-80 z-0"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 90 25" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                            d={chartPath}
                            stroke={color === "red" ? "#ef4444" : color === "green" ? "#22c55e" : color === "blue" ? "#3b82f6" : "#6366f1"}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            variants={pathVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
};

export function DashboardCards() {
    const [isLoading, setIsLoading] = useState(true);
    const [productCount, setProductCount] = useState(0);
    const [productChange, setProductChange] = useState(0);
    const [apiError, setApiError] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        async function fetchProductData() {
            try {
                setIsLoading(true);
                setApiError(false);

                // Fetch the actual products from the API
                const response = await fetch('/api/products');

                if (response.ok) {
                    const data = await response.json();
                    const products = data.products || [];

                    // Set the actual count of products from the API
                    setProductCount(products.length);

                    // Calculate percentage change (in a real app, this would compare to previous period)
                    // For demo purposes, we'll calculate a number based on the product count
                    if (products.length > 0) {
                        const calculatedChange = parseFloat((Math.max(products.length / 5, 0.2)).toFixed(1));
                        setProductChange(calculatedChange);
                    } else {
                        setProductChange(0);
                    }
                } else {
                    console.error('Failed to fetch products');
                    setProductCount(0);
                    setProductChange(0);
                    setApiError(true);
                }
            } catch (error) {
                console.error('Error fetching product count:', error);
                setProductCount(0);
                setProductChange(0);
                setApiError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProductData();
    }, []);

    // Create stats card data with different colors and better icons
    const statCards = [
        {
            title: "Total Sales",
            value: fixedStats.totalRevenue,
            icon: <LineChart className="h-6 w-6 sm:h-7 sm:w-7" />,
            change: 12.5,
            description: "",
            color: "primary"
        },
        {
            title: "Products",
            value: apiError ? "Error" : productCount,
            icon: <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />,
            change: productChange,
            description: "",
            isLoading: isLoading,
            color: "blue"
        },
        {
            title: "Orders",
            value: fixedStats.totalOrders,
            icon: <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />,
            change: -3.4,
            description: "",
            color: "red"
        },
        {
            title: "Customers",
            value: fixedStats.totalUsers,
            icon: <Users className="h-6 w-6 sm:h-7 sm:w-7" />,
            change: 4.6,
            description: "",
            color: "green"
        },
    ];

    // Container animation to stagger the children
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            ref={containerRef}
            className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-6 px-1 sm:px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {statCards.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    change={stat.change}
                    description={stat.description}
                    isLoading={stat.isLoading}
                    color={stat.color}
                    index={index}
                />
            ))}
        </motion.div>
    );
} 