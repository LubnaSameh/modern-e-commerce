"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Emily Rodriguez",
        position: "Designer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        rating: 5,
        text: "This has been the best online shopping experience I've ever had. The quality of the products exceeded my expectations, and the customer service was exceptional. I'll definitely be a returning customer!",
        product: {
            name: "Minimalist Desk Lamp",
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80"
        }
    },
    {
        id: 2,
        name: "Michael Chen",
        position: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        rating: 5,
        text: "I was skeptical about buying electronics online, but this store has changed my mind. The product arrived faster than expected, was perfectly packaged, and works flawlessly. The detailed product description was spot on.",
        product: {
            name: "Wireless Earbuds",
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80"
        }
    },
    {
        id: 3,
        name: "Sophia Williams",
        position: "Marketing Director",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        rating: 4,
        text: "The attention to detail in both the products and the shopping experience is remarkable. Everything from browsing to checkout was seamless. I particularly appreciated the recommendations based on my preferences.",
        product: {
            name: "Leather Tote Bag",
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80"
        }
    }
];

export default function TestimonialSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goToSlide = (index: number) => {
        if (animating) return;
        setAnimating(true);
        setActiveIndex(index);
        setTimeout(() => setAnimating(false), 500);
    };

    const nextSlide = () => {
        goToSlide((activeIndex + 1) % testimonials.length);
    };

    const prevSlide = () => {
        goToSlide((activeIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">What Our Customers Say</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
                        We value customer feedback and strive to deliver the best shopping experience. Here's what some of our satisfied customers have to say.
                    </p>
                </div>

                <div className="relative">
                    {/* Main testimonial slider */}
                    <div className="relative overflow-hidden rounded-3xl shadow-lg bg-white dark:bg-gray-800">
                        {testimonials.map((testimonial, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <div
                                    key={testimonial.id}
                                    className={`transition-all duration-500 ease-in-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-full'
                                        }`}
                                >
                                    <div className="grid md:grid-cols-5 items-stretch">
                                        {/* Left Column - Content */}
                                        <div className="col-span-3 p-8 md:p-12 flex flex-col justify-center">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                                                transition={{ duration: 0.5 }}
                                                className="space-y-6"
                                            >
                                                <Quote className="h-10 w-10 text-blue-500 dark:text-blue-400 opacity-50" />

                                                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed italic">
                                                    "{testimonial.text}"
                                                </p>

                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-5 w-5 ${i < testimonial.rating
                                                                ? "text-yellow-400 fill-yellow-400 dark:text-yellow-500 dark:fill-yellow-500"
                                                                : "text-gray-300 dark:text-gray-600"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-4 pt-4">
                                                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-blue-500 dark:border-blue-600">
                                                        <Image
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {testimonial.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {testimonial.position}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Right Column - Product Image */}
                                        <div className="relative col-span-2 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="space-y-4 text-center"
                                            >
                                                <div className="relative h-48 w-48 mx-auto overflow-hidden rounded-xl shadow-md">
                                                    <Image
                                                        src={testimonial.product.image}
                                                        alt={testimonial.product.name}
                                                        fill
                                                        className="object-cover dark:brightness-90"
                                                    />
                                                </div>
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {testimonial.product.name}
                                                </h4>
                                                <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                                    Verified Purchase
                                                </div>
                                            </motion.div>

                                            {/* Background pattern */}
                                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                                <div className="absolute inset-0" style={{
                                                    backgroundImage: 'radial-gradient(circle, #3b82f6 8%, transparent 8%)',
                                                    backgroundSize: '30px 30px'
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center mt-8">
                        <div className="flex space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-10 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? "bg-blue-600 dark:bg-blue-700 w-16"
                                        : "bg-gray-300 dark:bg-gray-700"
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={prevSlide}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 