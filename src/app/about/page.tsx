import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'About Us | ModernShop',
    description: 'Learn about our story, mission, and the team behind ModernShop',
};

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 dark:opacity-20"></div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Our Story
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                            At ModernShop, we're passionate about bringing you the best products with an unmatched shopping experience.
                            Founded in 2023, we've quickly grown to become a trusted destination for quality and innovation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src="/images/about/mission.jpg"
                                    alt="Our mission"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                    unoptimized={true} // For demo purposes
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                                We believe shopping should be more than just a transaction. Our mission is to connect people with products they'll love while providing exceptional service every step of the way.
                            </p>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Values</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Quality First</h4>
                                        <p className="text-gray-600 dark:text-gray-400">We curate only the finest products that meet our high standards.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Customer Satisfaction</h4>
                                        <p className="text-gray-600 dark:text-gray-400">Your happiness is our top priority in everything we do.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Innovation</h4>
                                        <p className="text-gray-600 dark:text-gray-400">We constantly evolve to bring you the latest and greatest.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Meet Our Team</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            The passionate people behind ModernShop who work tirelessly to bring you an exceptional shopping experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Team Member 1 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                            <div className="relative w-full h-64">
                                <Image
                                    src="/images/team/team1.jpg"
                                    alt="Sarah Johnson - CEO"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized={true} // For demo purposes
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sarah Johnson</h3>
                                <p className="text-blue-600 dark:text-blue-400 mb-3">Founder & CEO</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    With over 15 years in retail, Sarah brings vast experience and vision to ModernShop.
                                </p>
                            </div>
                        </div>

                        {/* Team Member 2 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                            <div className="relative w-full h-64">
                                <Image
                                    src="/images/team/team2.jpg"
                                    alt="Michael Chen - CTO"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized={true} // For demo purposes
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Michael Chen</h3>
                                <p className="text-blue-600 dark:text-blue-400 mb-3">CTO</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Michael leads our tech team, ensuring a seamless shopping experience across all platforms.
                                </p>
                            </div>
                        </div>

                        {/* Team Member 3 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                            <div className="relative w-full h-64">
                                <Image
                                    src="/images/team/team3.jpg"
                                    alt="Jessica Patel - Head of Design"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized={true} // For demo purposes
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Jessica Patel</h3>
                                <p className="text-blue-600 dark:text-blue-400 mb-3">Head of Design</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Jessica's creative eye ensures our product selection and website are beautiful and intuitive.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-blue-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose ModernShop</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            We're more than just another online store. Here's what sets us apart:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Fast Delivery</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Get your orders quickly with our optimized logistics network and shipping partners.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Secure Shopping</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Shop with confidence knowing your data is protected by state-of-the-art security measures.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">24/7 Support</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our customer service team is always ready to assist you with any questions or concerns.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start shopping?</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who have discovered their favorite products at ModernShop.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block py-3 px-8 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg"
                    >
                        Browse Our Collection
                    </Link>
                </div>
            </section>
        </div>
    );
} 