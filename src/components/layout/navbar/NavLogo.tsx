"use client";

import Link from "next/link";

export default function NavLogo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ModernShop
            </span>
        </Link>
    );
} 