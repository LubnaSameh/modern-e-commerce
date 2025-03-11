"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Create a deterministic set of animation properties instead of random values
const animationCircles = Array(12).fill(0).map((_, i) => ({
    width: 100 + ((i * 17) % 200),
    height: 100 + ((i * 13) % 200),
    left: ((i * 8.3) % 100),
    top: ((i * 7.7) % 100),
    animationDuration: 15 + ((i * 0.7) % 10),
    animationDelay: (i * 0.4) % 5
}));

export default function HeroSlider() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [animating, setAnimating] = useState(false);
    const { resolvedTheme } = useTheme();
    const sliderRef = useRef<HTMLDivElement>(null);
    // Add mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    // Use mounted to ensure client-side only rendering for theme-dependent elements
    useEffect(() => {
        setMounted(true);
    }, []);

    // Use resolvedTheme with a default to ensure consistent rendering
    const isDark = mounted ? resolvedTheme === 'dark' : false;

    const slides = [
        {
            title: "Discover Amazing Products",
            subtitle: "For Your Lifestyle",
            description: "Explore our curated collection of high-quality products with exclusive deals.",
            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=2000&auto=format&fit=crop&q=100",
            alt: "Modern living room with contemporary furniture",
            lightColors: {
                primary: "from-blue-400 to-indigo-500",
                secondary: "from-blue-100 to-indigo-200",
                text: "text-blue-950"
            },
            darkColors: {
                primary: "from-blue-800 to-indigo-700",
                secondary: "from-blue-900 to-indigo-800",
                text: "text-blue-200"
            },
            buttonText: "Shop Now",
            buttonLink: "/shop"
        },
        {
            title: "New Collection",
            subtitle: "Summer 2025",
            description: "Refresh your style with our latest summer collection. Limited editions available now.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2000&auto=format&fit=crop&q=100",
            alt: "Summer fashion collection",
            lightColors: {
                primary: "from-pink-400 to-purple-500",
                secondary: "from-pink-100 to-purple-200",
                text: "text-purple-950"
            },
            darkColors: {
                primary: "from-blue-800 to-purple-900",
                secondary: "from-blue-900 to-purple-800",
                text: "text-pink-200"
            },
            buttonText: "View Collection",
            buttonLink: "/shop?collection=summer"
        },
        {
            title: "Premium Electronics",
            subtitle: "Latest Technology",
            description: "Discover cutting-edge devices that enhance your digital lifestyle.",
            image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=2000&auto=format&fit=crop&q=100",
            alt: "Premium electronics display",
            lightColors: {
                primary: "from-cyan-400 to-blue-500",
                secondary: "from-cyan-100 to-blue-200",
                text: "text-cyan-950"
            },
            darkColors: {
                primary: "from-cyan-800 to-blue-700",
                secondary: "from-cyan-900 to-blue-800",
                text: "text-cyan-200"
            },
            buttonText: "Explore Gadgets",
            buttonLink: "/shop?category=electronics"
        }
    ];

    const goToSlide = useCallback((index: number) => {
        if (animating) return;
        setAnimating(true);
        setActiveSlide(index);
        setTimeout(() => setAnimating(false), 800);
    }, [animating]);

    const nextSlide = useCallback(() => {
        goToSlide((activeSlide + 1) % slides.length);
    }, [activeSlide, goToSlide, slides.length]);

    const prevSlide = useCallback(() => {
        goToSlide((activeSlide - 1 + slides.length) % slides.length);
    }, [activeSlide, goToSlide, slides.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!animating) {
                nextSlide();
            }
        }, 6000);
        return () => clearInterval(interval);
    }, [animating, nextSlide]);

    return (
        <div className="relative  py-4 md:py-8 px-2 md:px-4">
            {/* Background gradient container - changes with theme and active slide */}
            <div className="absolute  inset-0 overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={`bg-${index}`}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? slide.darkColors.secondary : slide.lightColors.secondary
                            } ${isDark ? 'opacity-20' : 'opacity-30'}`}></div>
                    </div>
                ))}

                {/* Animated circular background elements with deterministic values */}
                <div className="absolute inset-0 overflow-hidden">
                    {animationCircles.map((circle, i) => (
                        <div
                            key={`circle-${i}`}
                            className={`absolute rounded-full blur-xl bg-gradient-to-r ${isDark ?
                                slides[activeSlide].darkColors.primary :
                                slides[activeSlide].lightColors.primary
                                } ${isDark ? 'opacity-15' : 'opacity-20'} transition-all duration-1000`}
                            style={{
                                width: `${circle.width}px`,
                                height: `${circle.height}px`,
                                left: `${circle.left}%`,
                                top: `${circle.top}%`,
                                transform: `translate(-50%, -50%)`,
                                animation: `float ${circle.animationDuration}s infinite ease-in-out ${circle.animationDelay}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Main slider container */}
            <div
                className="container  mx-auto relative z-10"
                ref={sliderRef}
            >
                {/* Content and image layout */}
                <div className="relative overflow-hidden rounded-[20px] md:rounded-[50px] shadow-2xl bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-800/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] md:min-h-[600px]">

                        {/* Content Side */}
                        <div className="relative z-20 p-6 md:p-8 lg:p-12 flex items-center">
                            {slides.map((slide, index) => {
                                const isActive = index === activeSlide;
                                return (
                                    <div
                                        key={`content-${index}`}
                                        className={`w-full transition-all duration-700 ease-out transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 absolute'
                                            }`}
                                    >
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="inline-block px-3 py-1 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm text-xs md:text-sm font-medium dark:text-white">
                                                {slide.subtitle}
                                            </div>

                                            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${isDark ? slide.darkColors.text : slide.lightColors.text
                                                }`}>
                                                {slide.title}
                                            </h2>

                                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-md">
                                                {slide.description}
                                            </p>

                                            <div className="pt-2 md:pt-4">
                                                <Link
                                                    href={slide.buttonLink}
                                                    className={`group relative inline-flex items-center px-5 py-3 md:px-8 md:py-4 overflow-hidden rounded-full transition-all
                            ${isDark ?
                                                            'bg-gradient-to-r ' + slide.darkColors.primary + ' text-white' :
                                                            'bg-gradient-to-r ' + slide.lightColors.primary + ' text-white'
                                                        } shadow-lg hover:shadow-xl`}
                                                >
                                                    <span className="relative z-10 flex items-center text-sm md:text-base">
                                                        <span className="mr-2">{slide.buttonText}</span>
                                                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                    <span className="absolute inset-0 overflow-hidden rounded-full">
                                                        <span className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out bg-gradient-to-r 
                              ${isDark ? slide.darkColors.secondary : slide.lightColors.secondary} opacity-90`}>
                                                        </span>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Image Side - with circular border radius */}
                        <div className="relative h-[250px] sm:h-[350px] md:h-full lg:h-full">
                            {slides.map((slide, index) => {
                                const isActive = index === activeSlide;
                                return (
                                    <div
                                        key={`image-${index}`}
                                        className={`absolute inset-0 transition-all duration-1000 ease-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                            }`}
                                    >
                                        <div className="relative h-full w-full">
                                            {/* Decorative circles */}
                                            <div className="absolute -top-20 -right-20 w-32 md:w-64 h-32 md:h-64 rounded-full bg-gradient-to-r opacity-80 blur-md
                        dark:opacity-30 transition-all duration-1000 z-10"
                                                style={{
                                                    backgroundImage: `radial-gradient(circle, ${isDark ? '#3b82f650' : '#60a5fa80'}, transparent 70%)`
                                                }}
                                            ></div>
                                            <div className="absolute -bottom-10 -left-10 w-20 md:w-40 h-20 md:h-40 rounded-full bg-gradient-to-r opacity-60 blur-md
                        dark:opacity-20 transition-all duration-1000 z-10"
                                                style={{
                                                    backgroundImage: `radial-gradient(circle, ${isDark ? '#4f46e550' : '#c4b5fd80'}, transparent 70%)`
                                                }}
                                            ></div>

                                            {/* Main image with rounded mask */}
                                            <div className="relative h-full w-full overflow-hidden lg:rounded-[0_50px_50px_0] rounded-b-[20px] md:rounded-b-[50px]">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/20 dark:from-black/60 dark:to-black/60 z-10"></div>
                                                <Image
                                                    src={slide.image}
                                                    alt={slide.alt}
                                                    fill
                                                    quality={100}
                                                    priority={index === 0}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                                                    className={`object-cover transition-transform duration-10000 ${isActive ? 'scale-110' : 'scale-100'} ${isDark ? 'brightness-75' : 'brightness-100'
                                                        }`}
                                                    style={{ objectPosition: 'center center' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-8 z-30 flex space-x-2 md:space-x-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-6 md:w-10 h-2 md:h-3 rounded-full transition-all duration-300 ${index === activeSlide
                                    ? isDark
                                        ? `bg-gradient-to-r ${slides[activeSlide].darkColors.primary} w-10 md:w-16`
                                        : `bg-gradient-to-r ${slides[activeSlide].lightColors.primary} w-10 md:w-16`
                                    : 'bg-white/30 dark:bg-white/10'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrow controls - hidden on small screens, visible on md and up */}
                    <div className="hidden md:block absolute top-1/2 right-8 -translate-y-1/2 z-30 space-y-4">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-white border border-white/20 dark:border-gray-700/30 transition-all hover:bg-white/40 dark:hover:bg-gray-700/50"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-white border border-white/20 dark:border-gray-700/30 transition-all hover:bg-white/40 dark:hover:bg-gray-700/50"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-2 md:bottom-4 left-0 right-0 z-30 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="relative h-1 rounded-full overflow-hidden bg-white/10 dark:bg-white/5">
                        <div
                            className={`h-full transition-all duration-[6000ms] ease-linear rounded-full bg-gradient-to-r ${isDark
                                ? slides[activeSlide].darkColors.primary
                                : slides[activeSlide].lightColors.primary
                                }`}
                            style={{
                                width: animating ? '0%' : '100%',
                                transitionTimingFunction: 'linear'
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
} 