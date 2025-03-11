"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

type NavLink = {
    name: string;
    href: string;
};

interface DesktopNavProps {
    links: NavLink[];
}

export default function DesktopNav({ links }: DesktopNavProps) {
    const pathname = usePathname();
    
    // Function to check if a link is active
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className={`font-medium transition-colors relative ${
                        link.name === "Dashboard" && isActive(link.href)
                            ? "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center font-semibold"
                            : link.name === "Dashboard"
                            ? "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 flex items-center"
                            : isActive(link.href) 
                                ? "text-blue-600 dark:text-blue-400 font-semibold"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    }`}
                >
                    {link.name === "Dashboard" && <LayoutDashboard size={16} className="mr-1" />}
                    {link.name}
                    {isActive(link.href) && (
                        <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
                    )}
                </Link>
            ))}
        </nav>
    );
} 