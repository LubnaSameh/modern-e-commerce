"use client";

import { DashboardCards } from "@/components/admin/dashboard/DashboardCards";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { SalesChart } from "@/components/admin/dashboard/SalesChart";
import { PageTitle } from "@/components/admin/PageTitle";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

// Metadata moved to a separate file (layout.tsx) or config

export default function AdminDashboard() {
    const [showAlert, setShowAlert] = useState(true);

    return (
        <div className="space-y-4 sm:space-y-6">
            {showAlert && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Important Note
                        </h3>
                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                        Only the products page is currently available in the control panel. The rest of the pages are under development                        </p>
                    </div>
                    <button
                        onClick={() => setShowAlert(false)}
                        className="ml-4 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                        aria-label="إغلاق التنبيه"
                    >
                        &times;
                    </button>
                </div>
            )}

            <PageTitle
                title="Dashboard"
                description="Welcome to your e-commerce admin dashboard"
            />

            {/* Stats Cards */}
            <DashboardCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
                        Sales Statistics
                    </h3>
                    <SalesChart />
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
                        Recent Orders
                    </h3>
                    <RecentOrders />
                </div>
            </div>
        </div>
    );
} 