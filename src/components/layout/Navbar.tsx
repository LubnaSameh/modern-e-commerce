"use client";

import { useState } from "react";
import SearchModal from "./SearchModal";
import NavLogo from "./navbar/NavLogo";
import DesktopNav from "./navbar/DesktopNav";
import ActionButtons from "./navbar/ActionButtons";
import MobileMenu from "./navbar/MobileMenu";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    // Navigation Links
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Dashboard", href: "/admin" },
    ];

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container  mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <NavLogo />

                        {/* Desktop Navigation */}
                        <DesktopNav links={navLinks} />

                        {/* Action Buttons */}
                        <ActionButtons 
                            onSearchClick={() => setSearchModalOpen(true)}
                            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                            isMobileMenuOpen={mobileMenuOpen}
                        />
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu 
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                links={navLinks}
            />

            {/* Search Modal */}
            <SearchModal 
                isOpen={searchModalOpen} 
                onClose={() => setSearchModalOpen(false)} 
            />
        </>
    );
} 