"use client";

import Link from "next/link";
import { X, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

type NavLink = {
    name: string;
    href: string;
};

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    links: NavLink[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
    const pathname = usePathname();
    
    // Function to check if a link is active
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname?.startsWith(href);
    };
    
    return (
        <div 
            className={`fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden mobile-menu-container ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Navigation Links */}
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center p-2 rounded-lg ${
                                            link.name === "Dashboard" && isActive(link.href)
                                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold" 
                                                : link.name === "Dashboard"
                                                ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                : isActive(link.href)
                                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                        onClick={onClose}
                                    >
                                        {link.name === "Dashboard" && <LayoutDashboard size={18} className="mr-2" />}
                                        <span>{link.name}</span>
                                        {isActive(link.href) && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    
                    {/* Theme Toggle - Mobile */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <ThemeToggle isMobile={true} />
                    </div>
                    
                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <UserMenu isMobile={true} />
                    </div>
                </div>
            </div>
        </div>
    );
} 