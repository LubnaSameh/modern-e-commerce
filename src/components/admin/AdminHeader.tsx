"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
    Bell,
    Menu,
    User,
    Moon,
    Sun,
    Search,
} from "lucide-react";

type AdminHeaderProps = {
    user: {
        name: string;
        email: string;
        image?: string;
    };
};

export function AdminHeader({ user }: AdminHeaderProps) {
    const { theme, setTheme } = useTheme();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-5">
                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" />
                </button>

                {/* Search */}
                <div className="hidden md:flex md:w-1/3 lg:w-1/4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                    >
                        <span className="sr-only">Toggle theme</span>
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none relative"
                    >
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center space-x-3 focus:outline-none"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "User"}
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Administrator
                                </div>
                            </div>
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                <Link
                                    href="/admin/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Your Profile
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Settings
                                </Link>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <Link
                                    href="/"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Back to Store
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 