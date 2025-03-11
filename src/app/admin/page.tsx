import { DashboardCards } from "@/components/admin/dashboard/DashboardCards";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { SalesChart } from "@/components/admin/dashboard/SalesChart";
import { PageTitle } from "@/components/admin/PageTitle";

export const metadata = {
    title: "Admin Dashboard | E-Commerce",
    description: "Admin dashboard for the e-commerce platform"
};

export default function AdminDashboard() {
    return (
        <div>
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