import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    const paymentMethods = [
        { name: "Visa", src: "/payment/visa.svg" },
        { name: "Mastercard", src: "/payment/mastercard.svg" },
        { name: "PayPal", src: "/payment/paypal.svg" },
        { name: "Apple Pay", src: "/payment/apple-pay.svg" },
    ];

    const quickLinks = [
        { name: "Shop", href: "/shop" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Blog", href: "/blog" },
    ];

    const customerService = [
        { name: "Help Center", href: "/help" },
        { name: "FAQ", href: "/faq" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "Privacy Policy", href: "/privacy" },
    ];

    return (
        <footer className="bg-white dark:bg-gray-900">
            {/* Main Footer Content */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* About */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                ModernShop
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Your one-stop destination for high-quality products at the best prices. Secure payments and fast delivery.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors">
                                    <Facebook size={16} />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-400 hover:text-white dark:hover:bg-blue-600 transition-colors">
                                    <Twitter size={16} />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-colors">
                                    <Instagram size={16} />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors">
                                    <Youtube size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Customer Service</h3>
                            <ul className="space-y-3">
                                {customerService.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Us</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-400">123 Street Name, City, Country</span>
                                </li>
                                <li className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                    <span className="text-gray-600 dark:text-gray-400">+1 234 567 8900</span>
                                </li>
                                <li className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                                    <span className="text-gray-600 dark:text-gray-400">support@modernshop.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} ModernShop. All rights reserved.
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">We Accept:</span>
                            <div className="flex items-center gap-2">
                                {paymentMethods.map((method) => (
                                    <div key={method.name} className="h-8 px-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center">
                                        <Image
                                            src={method.src}
                                            alt={method.name}
                                            width={32}
                                            height={20}
                                            className="h-4 w-auto object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 