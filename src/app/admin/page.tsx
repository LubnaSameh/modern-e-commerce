'use client';

import dynamic from 'next/dynamic';
import { PageTitle } from "@/components/admin/PageTitle";
import { useState } from "react";

// Dynamically import components with no SSR to avoid hydration issues
const DashboardCards = dynamic(
    () => import('@/components/admin/dashboard/DashboardCards'),
    { ssr: false }
);

const SalesChart = dynamic(
    () => import('@/components/admin/dashboard/SalesChart'),
    { ssr: false }
);

const RecentOrders = dynamic(
    () => import('@/components/admin/dashboard/RecentOrders'),
    { ssr: false }
);

// Metadata is now imported in layout.tsx
// export const metadata = {
//    title: "Admin Dashboard | E-Commerce",
//    description: "Admin dashboard for the e-commerce platform"
// };

export default function AdminDashboard() {
    // State to control the visibility of the alert
    const [showAlert, setShowAlert] = useState(true);

    return (
        <div className="relative">
            {/* Alert Notification */}
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Important Notice</h3>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            <strong>Only the Products page is currently functional.</strong> Other dashboard features are in development and will be available soon.
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAlert(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PageTitle
                title="Dashboard"
                description="Welcome to your e-commerce admin dashboard"
            />

            {/* Stats Cards */}
            <DashboardCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                        Sales Statistics
                    </h3>
                    <SalesChart />
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                        Recent Orders
                    </h3>
                    <RecentOrders />
                </div>
            </div>
        </div>
    );
} 