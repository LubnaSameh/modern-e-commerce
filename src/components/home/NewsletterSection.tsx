"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            setEmail("");

            // Reset success message after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        }, 1500);
    };

    return (
        <section className="py-16 px-4 relative overflow-hidden bg-white dark:bg-gray-950">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-900 z-0"></div>

            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white/30 to-transparent dark:from-white/5 dark:to-transparent"></div>

                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/5 rounded-full filter blur-3xl"></div>

                <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full filter blur-3xl"></div>

                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/5 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto  relative z-10">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-5 items-stretch">
                        {/* Left Side - Decorative */}
                        <div className="col-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 p-8 md:p-10 flex items-center justify-center relative">
                            <div className="absolute inset-0 overflow-hidden">
                                {/* Decorative pattern */}
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    className="absolute top-0 left-0 opacity-10"
                                >
                                    <defs>
                                        <pattern
                                            id="smallGrid"
                                            width="10"
                                            height="10"
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M 10 0 L 0 0 0 10"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="0.5"
                                            />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#smallGrid)" />
                                </svg>

                                {/* Circle decoration */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-10 filter blur-md"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white opacity-10 filter blur-md"></div>
                            </div>

                            <div className="relative text-center">
                                <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
                                <p className="text-blue-100">
                                    Get exclusive offers, new product announcements, and personalized recommendations.
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="col-span-3 p-8 md:p-10 flex items-center">
                            <div className="w-full">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Subscribe to our newsletter
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Join our community and be the first to know about special promotions, new arrivals, and insider-only discounts.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full bg-gray-100 dark:bg-gray-700/50 border ${error
                                                ? 'border-red-300 dark:border-red-500'
                                                : 'border-gray-200 dark:border-gray-600'
                                                } rounded-full px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all text-gray-900 dark:text-gray-100`}
                                            placeholder="Enter your email address"
                                            disabled={isLoading || isSubmitted}
                                        />
                                        {error && (
                                            <p className="text-red-500 text-sm mt-1 ml-4">{error}</p>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading || isSubmitted}
                                            className={`w-full flex items-center justify-center rounded-full px-6 py-4 text-white font-medium transition-all ${isSubmitted
                                                ? 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500'
                                                : isLoading
                                                    ? 'bg-blue-400 dark:bg-blue-500 cursor-wait'
                                                    : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600'
                                                }`}
                                        >
                                            {isSubmitted ? (
                                                <>
                                                    <Check className="h-5 w-5 mr-2" />
                                                    <span>Thank you for subscribing!</span>
                                                </>
                                            ) : isLoading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Subscribing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Subscribe</span>
                                                    <ArrowRight className="h-5 w-5 ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                                    By subscribing, you agree to our <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a> and consent to receive marketing emails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits icons below the form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4"
                    >
                        <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Exclusive Offers</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                Be the first to know about special promotions and member-only discounts.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4"
                    >
                        <div className="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">New Arrivals</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                Stay updated on the latest products added to our store each week.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4"
                    >
                        <div className="bg-teal-100 dark:bg-teal-800/30 p-3 rounded-lg text-teal-600 dark:text-teal-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tips & Guides</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                Receive helpful product guides and lifestyle tips in your inbox.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 