"use client";

import Link from "next/link";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import CartDropdown from "./CartDropdown";

interface ActionButtonsProps {
    onSearchClick: () => void;
    onMobileMenuToggle: () => void;
    isMobileMenuOpen: boolean;
}

export default function ActionButtons({ onSearchClick, onMobileMenuToggle, isMobileMenuOpen }: ActionButtonsProps) {
    const [mounted, setMounted] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    
    // Use individual selectors to prevent re-render loops
    const cartTotalItems = useCartStore(state => state.totalItems);
    const wishlistTotalItems = useWishlistStore(state => state.totalItems);
    
    const cartDropdownRef = useRef<HTMLDivElement>(null);
    
    // Wait for component to be mounted
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Close cart dropdown when clicking outside
    useEffect(() => {
        const closeCartDropdown = (event: MouseEvent) => {
            if (cartDropdownOpen && cartDropdownRef.current) {
                const target = event.target as HTMLElement;
                if (!target.closest('.cart-dropdown-container')) {
                    setCartDropdownOpen(false);
                }
            }
        };

        if (cartDropdownOpen && mounted) {
            document.addEventListener('mousedown', closeCartDropdown);
        }
        
        return () => {
            document.removeEventListener('mousedown', closeCartDropdown);
        };
    }, [cartDropdownOpen, mounted]);

    // Open cart dropdown on hover
    const handleCartHover = (isHovering: boolean) => {
        if (isHovering) {
            setCartDropdownOpen(true);
        }
    };
    
    return (
        <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
                onClick={onSearchClick}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Search"
            >
                <Search size={20} />
            </button>

            {/* Wishlist Button */}
            <Link
                href="/wishlist"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 relative"
                aria-label="Wishlist"
            >
                <Heart size={20} />
                {mounted && wishlistTotalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {wishlistTotalItems}
                    </span>
                )}
            </Link>

            {/* Cart Button with Dropdown */}
            <div 
                className="relative cart-dropdown-container" 
                ref={cartDropdownRef}
                onMouseEnter={() => handleCartHover(true)}
                onMouseLeave={() => setTimeout(() => handleCartHover(false), 300)}
            >
                <button
                    onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 relative"
                    aria-label="Cart"
                >
                    <ShoppingCart size={20} />
                    {mounted && (
                        <span className={`absolute -top-2 -right-2 ${cartTotalItems > 0 ? 'bg-blue-600' : 'bg-gray-400'} text-white text-xs rounded-full h-4 w-4 flex items-center justify-center`}>
                            {cartTotalItems}
                        </span>
                    )}
                </button>
                
                {/* Cart Dropdown */}
                {cartDropdownOpen && <CartDropdown />}
            </div>

            {/* User Account / Login - Hidden on mobile */}
            <div className="relative hidden md:block">
                <UserMenu />
            </div>

            {/* Theme Toggle - Hidden on mobile */}
            <div className="hidden md:block">
                <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <button
                type="button"
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={onMobileMenuToggle}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
                {isMobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                )}
            </button>
        </div>
    );
} 