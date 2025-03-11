"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    ClipboardList,
    Tag,
    Settings,
    Image as ImageIcon,
    Home,
    ChevronDown,
    X,
    Sun,
    Moon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type NavItemProps = {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

const NavItem = ({ href, icon, label, active, onClick }: NavItemProps) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3.5 rounded-md px-3 py-2 text-sm transition-colors",
            active
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        )}
        onClick={onClick}
    >
        <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
        <span>{label}</span>
    </Link>
);

type NavGroupProps = {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
};

const NavGroup = ({ label, icon, children, defaultOpen = false }: NavGroupProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-3.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <div className="flex items-center gap-3.5">
                    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
                    <span>{label}</span>
                </div>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <div className={cn(
                "mt-1 pl-10 overflow-hidden transition-all",
                isOpen ? "max-h-96" : "max-h-0"
            )}>
                {children}
            </div>
        </div>
    );
};

type AdminSidebarProps = {
    isMobileSidebarOpen?: boolean;
    onMobileSidebarClose?: () => void;
};

export function AdminSidebar({ isMobileSidebarOpen = false, onMobileSidebarClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isMobileView, setIsMobileView] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Check if in mobile view on mount and window resize
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobileView(window.innerWidth < 1024); // lg breakpoint
        };

        // Initial check
        checkIfMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Wait for component to be mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {isMobileSidebarOpen && isMobileView && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileSidebarClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen z-50",
                    "transition-all duration-300 ease-in-out",
                    "lg:w-64 lg:static lg:translate-x-0 flex-shrink-0",
                    isMobileView ? (
                        isMobileSidebarOpen
                            ? "fixed w-[250px] left-0 top-0 translate-x-0"
                            : "fixed w-[250px] left-0 top-0 -translate-x-full"
                    ) : "w-64"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo and mobile close button */}
                    <div className="py-6 px-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <Link href="/admin" className="flex items-center">
                            <span className="text-2xl font-bold text-primary">Dashboard</span>
                        </Link>

                        {/* Mobile close button */}
                        {isMobileView && (
                            <button
                                onClick={onMobileSidebarClose}
                                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4 px-3">
                        <div className="space-y-1.5">
                            <NavItem
                                href="/admin"
                                icon={<LayoutDashboard className="h-5 w-5" />}
                                label="Dashboard"
                                active={pathname === "/admin"}
                                onClick={isMobileView ? onMobileSidebarClose : undefined}
                            />

                            <NavItem
                                href="/admin/products"
                                icon={<ShoppingBag className="h-5 w-5" />}
                                label="Products"
                                active={pathname.includes('/admin/products')}
                                onClick={isMobileView ? onMobileSidebarClose : undefined}
                            />

                            <NavItem
                                href="/admin/orders"
                                icon={<ClipboardList className="h-5 w-5" />}
                                label="Orders"
                                active={pathname === "/admin/orders"}
                                onClick={isMobileView ? onMobileSidebarClose : undefined}
                            />

                            <NavItem
                                href="/admin/customers"
                                icon={<Users className="h-5 w-5" />}
                                label="Customers"
                                active={pathname === "/admin/customers"}
                                onClick={isMobileView ? onMobileSidebarClose : undefined}
                            />

                            <NavGroup
                                label="Marketing"
                                icon={<ImageIcon className="h-5 w-5" />}
                                defaultOpen={pathname.includes('/admin/marketing')}
                            >
                                <NavItem
                                    href="/admin/marketing/banners"
                                    icon={<ImageIcon className="h-4 w-4" />}
                                    label="Banners"
                                    active={pathname === "/admin/marketing/banners"}
                                    onClick={isMobileView ? onMobileSidebarClose : undefined}
                                />
                                <NavItem
                                    href="/admin/marketing/coupons"
                                    icon={<Tag className="h-4 w-4" />}
                                    label="Coupons"
                                    active={pathname === "/admin/marketing/coupons"}
                                    onClick={isMobileView ? onMobileSidebarClose : undefined}
                                />
                            </NavGroup>

                            <NavItem
                                href="/admin/settings"
                                icon={<Settings className="h-5 w-5" />}
                                label="Settings"
                                active={pathname === "/admin/settings"}
                                onClick={isMobileView ? onMobileSidebarClose : undefined}
                            />
                        </div>
                    </div>

                    {/* Theme toggle and Back to store links */}
                    <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center w-full gap-3.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                {mounted && theme === "dark" ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </div>
                            <span>{mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                        </button>

                        {/* Back to store link */}
                        <NavItem
                            href="/"
                            icon={<Home className="h-5 w-5" />}
                            label="Back to Store"
                            onClick={isMobileView ? onMobileSidebarClose : undefined}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
} 