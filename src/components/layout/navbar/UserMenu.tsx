"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

interface UserMenuProps {
    isMobile?: boolean;
}

export default function UserMenu({ isMobile = false }: UserMenuProps) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const [userName, setUserName] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Close user menu when clicking outside (desktop only)
    useEffect(() => {
        const closeUserMenu = (event: MouseEvent) => {
            if (userMenuOpen) {
                const target = event.target as HTMLElement;
                if (!target.closest('.user-menu-container')) {
                    setUserMenuOpen(false);
                }
            }
        };

        if (userMenuOpen && mounted && !isMobile) {
            document.addEventListener('mousedown', closeUserMenu);
        }

        return () => {
            document.removeEventListener('mousedown', closeUserMenu);
        };
    }, [userMenuOpen, mounted, isMobile]);

    // Wait for component to be mounted
    useEffect(() => {
        setMounted(true);

        // Get user data from session or localStorage
        const getUserData = () => {
            // Check if logged in from localStorage first (it's more reliable in this app)
            const isLocalStorageLoggedIn = typeof window !== 'undefined' && window.localStorage.getItem('user-logged-in') === 'true';

            if (isLocalStorageLoggedIn) {
                setIsLoggedIn(true);

                // Get username from localStorage if available
                if (typeof window !== 'undefined') {
                    const storedName = window.localStorage.getItem('user-name');
                    if (storedName) {
                        setUserName(storedName);
                    }
                }
            }

            // Also check session data as a fallback
            if (session?.user) {
                setIsLoggedIn(true);

                // Set user image if available
                if (session.user.image) {
                    setUserImage(session.user.image);
                }

                // First priority: session name
                if (session.user.name) {
                    setUserName(session.user.name);

                    // Also store in localStorage for persistence
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem('user-name', session.user.name);
                        window.localStorage.setItem('user-logged-in', 'true');
                    }
                    return;
                }

                // Second priority: localStorage name
                if (typeof window !== 'undefined') {
                    const storedName = window.localStorage.getItem('user-name');
                    if (storedName) {
                        setUserName(storedName);
                        window.localStorage.setItem('user-logged-in', 'true');
                        return;
                    }
                }

                // Third priority: extract from email
                if (session.user.email) {
                    const extractedName = session.user.email.split('@')[0];
                    // Capitalize first letter for better presentation
                    const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
                    setUserName(formattedName);

                    // Store in localStorage for future sessions
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem('user-name', formattedName);
                        window.localStorage.setItem('user-logged-in', 'true');
                    }
                    return;
                }
            }
        };

        getUserData();
    }, [session, status]);

    const handleSignOut = () => {
        try {
            // Disable redirect in signOut to handle it manually
            signOut({
                redirect: false
            }).then(() => {
                // Clear any user state from localStorage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user-logged-in');
                    localStorage.removeItem('user-email');
                    localStorage.removeItem('user-name');

                    // Force reload the current page instead of redirect
                    window.location.reload();
                }
            });
        } catch (error) {
            console.error('Sign out error:', error);
            // Fallback if signOut fails - reload current page
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        }
        setUserMenuOpen(false);
    };

    if (!mounted) return null;

    // Mobile version
    if (isMobile) {
        return (
            <div>
                {(isLoggedIn || status === 'authenticated') ? (
                    <div>
                        <div className="flex items-center mb-4">
                            <Avatar
                                src={userImage}
                                alt={userName || 'User'}
                                size="md"
                            />
                            <div className="ml-3">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {userName || (session?.user?.name) || (session?.user?.email?.split('@')[0]) || 'User'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Link
                                href="/orders"
                                className="flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <LayoutDashboard size={18} className="mr-2" />
                                <span>My Orders</span>
                            </Link>

                            <button
                                onClick={handleSignOut}
                                className="flex items-center w-full p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <LogOut size={18} className="mr-2" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        <Avatar size="sm" className="mr-2" />
                        <span>Login</span>
                    </Link>
                )}
            </div>
        );
    }

    // Desktop version
    return (
        <div className="relative user-menu-container">
            {(isLoggedIn || status === 'authenticated' || (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('user-logged-in') === 'true')) ? (
                <>
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                    >
                        <Avatar
                            src={userImage}
                            alt={userName || 'User'}
                            size="sm"
                            className="mr-1"
                        />
                        <span className="text-sm font-medium hidden sm:inline">
                            {userName || (session?.user?.name && session.user.name.split(' ')[0]) || (session?.user?.email && session.user.email.split('@')[0]) || 'User'}
                        </span>
                        <span className="text-xs bg-green-500 w-2 h-2 rounded-full absolute -top-0.5 right-0.5 sm:right-auto sm:-right-0.5"></span>
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700 user-menu-dropdown">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <Avatar
                                        src={userImage}
                                        alt={userName || session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
                                        size="md"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {userName || session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mt-2">
                                    <span className="text-xs text-green-500 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                        Logged in
                                    </span>
                                </div>
                            </div>

                            {/* Dashboard Link in user menu */}
                            <Link
                                href="/admin"
                                className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <div className="flex items-center">
                                    <LayoutDashboard size={16} className="mr-2" />
                                    <span>Dashboard</span>
                                </div>
                            </Link>

                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/orders"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                My Orders
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="flex items-center">
                                    <LogOut size={16} className="mr-2" />
                                    <span>Sign out</span>
                                </div>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href="/auth/login"
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                    aria-label="Login"
                >
                    <Avatar size="sm" className="mr-1" />
                    <span className="text-sm font-medium hidden sm:inline">Login</span>
                </Link>
            )}
        </div>
    );
} 