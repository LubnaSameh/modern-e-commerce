"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
// Keep useSession import for compatibility but don't use it for gating access
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    useSession();
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true when component mounts (to avoid hydration issues)
    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    // Only show loading spinner during initial page load, not for auth check
    if (isClient && false) { // Changed from status === "loading" to false to disable auth check
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <AdminSidebar
                isMobileSidebarOpen={isMobileSidebarOpen}
                onMobileSidebarClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Mobile Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 flex items-center justify-between lg:hidden">
                    <button
                        onClick={toggleMobileSidebar}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</div>
                    <div className="w-6"></div> {/* Empty div for flex spacing */}
                </div>

                <main className="flex-1 overflow-y-auto p-5">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 