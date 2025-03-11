"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Define deterministic values instead of using Math.random()
const circleProps = [
    { width: 154.97, height: 187.08, left: 68.77, top: 32.58, animDuration: 15.26, animDelay: 0.79 },
    { width: 319.41, height: 92.05, left: 15.31, top: 84.02, animDuration: 18.96, animDelay: 3.04 },
    { width: 189.63, height: 220.66, left: 34.79, top: 23.55, animDuration: 23.56, animDelay: 0.89 },
    { width: 74.31, height: 184.57, left: 0.06, top: 39.47, animDuration: 16.62, animDelay: 1.98 },
    { width: 270.83, height: 115.01, left: 9.32, top: 27.32, animDuration: 20.57, animDelay: 0.51 },
    { width: 296.59, height: 115.04, left: 21.89, top: 36.47, animDuration: 22.62, animDelay: 0.008 }
];

export default function PromoBanner() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 relative overflow-hidden bg-white dark:bg-gray-950">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-violet-800/90 dark:to-indigo-900/80"></div>

            {/* Animated background circles */}
            <div className="absolute inset-0">
                {circleProps.map((props, i) => (
                    <div
                        key={`circle-${i}`}
                        className="absolute rounded-full bg-white opacity-10 dark:opacity-5"
                        style={{
                            width: `${props.width}px`,
                            height: `${props.height}px`,
                            left: `${props.left}%`,
                            top: `${props.top}%`,
                            transform: 'translate(-50%, -50%)',
                            animation: `float ${props.animDuration}s infinite ease-in-out ${props.animDelay}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="container mx-auto  relative z-10">
                <div className="rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10 overflow-hidden">
                    <div className="grid md:grid-cols-2 items-center">
                        {/* Left column - content */}
                        <div className="p-6 sm:p-8 md:p-12 lg:p-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                <span className="inline-block px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-medium">
                                    Limited Time Offer
                                </span>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                    Summer Sale <br />
                                    <span className="text-yellow-300 dark:text-yellow-200">Up to 50% Off</span>
                                </h2>

                                <p className="text-sm sm:text-base text-white/90 max-w-md">
                                    Discover incredible deals on our premium products. Upgrade your lifestyle with our exclusive summer discounts, available for a limited time only.
                                </p>

                                <div className="pt-2 sm:pt-4 flex flex-wrap gap-3 sm:gap-4">
                                    <Link
                                        href="/shop?sale=true"
                                        className="group relative inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base overflow-hidden rounded-full bg-white text-indigo-700 dark:text-indigo-600 font-medium shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            <span className="mr-2">Shop the Sale</span>
                                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                        <span className="absolute inset-0 overflow-hidden rounded-full">
                                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out bg-yellow-300 dark:bg-yellow-200"></span>
                                        </span>
                                    </Link>

                                    <Link
                                        href="/about-promotion"
                                        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-white hover:text-yellow-300 dark:hover:text-yellow-200 font-medium transition-colors text-sm sm:text-base"
                                    >
                                        <span>Learn More</span>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-white">24</div>
                                        <div className="text-xs text-white/80">Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-white">18</div>
                                        <div className="text-xs text-white/80">Hours</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-white">54</div>
                                        <div className="text-xs text-white/80">Minutes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-white">32</div>
                                        <div className="text-xs text-white/80">Seconds</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right column - images */}
                        <div className="h-full relative">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-indigo-900/50 md:bg-gradient-to-r md:from-indigo-900/50 md:to-transparent z-10"></div>

                            <div className="relative grid grid-cols-2 gap-2 p-2 sm:p-4 md:p-6 md:gap-4 h-[250px] sm:h-[300px] md:h-full">
                                <div className="flex flex-col gap-2 md:gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[3/4] bg-white/10 backdrop-blur-md border border-white/20"
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=580&auto=format&fit=crop"
                                            alt="Summer sale product - accessories"
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-white text-xs sm:text-sm">
                                            -30%
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="relative rounded-xl md:rounded-2xl overflow-hidden flex-1 bg-white/10 backdrop-blur-md border border-white/20"
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=580&auto=format&fit=crop"
                                            alt="Summer sale product - shoes"
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-white text-xs sm:text-sm">
                                            -50%
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="relative rounded-xl md:rounded-2xl overflow-hidden h-full bg-white/10 backdrop-blur-md border border-white/20"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1472417583565-62e7bdeda490?q=80&w=987&auto=format&fit=crop"
                                        alt="Summer sale product - dress"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-white text-xs sm:text-sm">
                                        -40%
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 