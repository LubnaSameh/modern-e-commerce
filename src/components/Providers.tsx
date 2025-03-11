'use client';

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "@/lib/auth-provider";
import { usePathname } from 'next/navigation';
import { useState, useEffect, lazy, Suspense } from 'react';
import { registerServiceWorker } from "@/app/sw-register";
import { CriticalCSSInjector } from "@/lib/critical-css";
// import { NavigationEvents } from "./NavigationEvents";

// Lazy load components
const Navbar = lazy(() => import("@/components/layout/Navbar"));
const Footer = lazy(() => import("@/components/layout/Footer"));

// Loading fallbacks
const NavbarFallback = () => <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"></div>;
const FooterFallback = () => <div className="h-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"></div>;

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');
    const [mounted, setMounted] = useState(false);

    // Wait for client-side hydration to complete before rendering theme-dependent UI
    useEffect(() => {
        setMounted(true);
        
        // Register service worker
        registerServiceWorker();
    }, []);

    // To avoid hydration mismatch, we need to ensure the theme is only applied client-side
    return (
        <AuthProvider>
            {/* Inject critical CSS */}
            <CriticalCSSInjector />
            
            {/* Add navigation progress indicator */}
            {/* <NavigationEvents /> */}
            
            {/* Force "light" as initial theme to avoid hydration mismatch */}
            <ThemeProvider
                attribute="data-theme"
                defaultTheme="system"
                enableSystem
                themes={["light", "dark"]}
                forcedTheme={mounted ? undefined : "light"}
            >
                <div className="flex flex-col min-h-screen">
                    {mounted && !isAdminPath && (
                        <Suspense fallback={<NavbarFallback />}>
                            <Navbar />
                        </Suspense>
                    )}
                    <main className="flex-grow">
                        {mounted && (
                            <ToastContainer
                                position="top-right"
                                theme="colored"
                                autoClose={3000}
                                pauseOnHover
                                limit={3}
                            />
                        )}
                        {children}
                    </main>
                    {mounted && !isAdminPath && (
                        <Suspense fallback={<FooterFallback />}>
                            <Footer />
                        </Suspense>
                    )}
                </div>
            </ThemeProvider>
        </AuthProvider>
    );
} 